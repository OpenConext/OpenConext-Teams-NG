package teams.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.TeamValidator;
import teams.domain.*;
import teams.exception.IllegalSearchParamException;
import teams.exception.NotAllowedException;
import teams.exception.ResourceNotFoundException;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;


@RestController
public class TeamController extends ApiController implements TeamValidator {

    @Value("${teams.default-stem-name}")
    private String defaultStemName;

    private TeamMatcher teamMatcher = new TeamMatcher();

    @GetMapping("api/teams/my-teams")
    public MyTeams myTeams(FederatedUser federatedUser) {
        List<Team> teams = teamRepository
                .findByMembershipsUrnPersonIgnoreCase(federatedUser.getUrn());
        List<TeamSummary> teamSummaries = teams
                .stream()
                .map(team -> new TeamSummary(team, federatedUser, false))
                .collect(toList());
        List<Long> teamIds = teamSummaries.stream().filter(this::isAllowedToAcceptJoinRequest)
                .map(TeamSummary::getId).collect(toList());

        List<JoinRequest> myJoinRequests = joinRequestRepository.findByPerson(federatedUser.getPerson());

        if (!teamIds.isEmpty()) {
            invitationsCountFromQuery(invitationRepository.countInvitationsByTeamId(teamIds), teamSummaries);
            joinRequestsCountFromQuery(joinRequestRepository.countJoinRequestsByTeamId(teamIds), teamSummaries);
        }

        List<PendingJoinRequest> pendingJoinRequests = myJoinRequests.stream()
                .map(PendingJoinRequest::new)
                .collect(toList());

        return new MyTeams(pendingJoinRequests, teamSummaries);

    }

    @GetMapping("api/teams/teams/{id}")
    public Object teamById(@PathVariable("id") Long id, FederatedUser federatedUser) {
        Team team = teamById(id, true);
        assertNotNull("Team", team, id);
        boolean superAdmin = federatedUser.getPerson().isSuperAdmin();
        Optional<Membership> membershipOptional = superAdmin ? Optional.of(new Membership()) : team.member(federatedUser.getUrn());
        if (!membershipOptional.isPresent() && !team.isViewable() && !superAdmin) {
            throw new NotAllowedException(String.format("Team %s is private and %s is not a member", id, federatedUser.getUrn()));
        }
        return membershipOptional.map(membership -> lazyLoadTeam(team, membership.getRole(), federatedUser))
                .orElse(new TeamSummary(team, federatedUser, true));
    }

    @GetMapping("api/teams/teamIdFromUrn/{urn:.+}")
    public Long teamIdFromUrn(@PathVariable("urn") String urn) {
        return teamRepository.findIdByUrn(urn).orElseThrow(() -> new ResourceNotFoundException(String.format("Team with urn %s does not exists", urn)));
    }

    @GetMapping("api/teams/teams")
    public List<TeamAutocomplete> teamSearch(@RequestParam("query") String query, FederatedUser federatedUser) {
        if (query.trim().length() < 2) {
            throw new IllegalSearchParamException("Minimal query length is 2");
        }
        Long id = federatedUser.getPerson().getId();
        boolean superAdmin = federatedUser.getPerson().isSuperAdmin();
        String queryUpper = ("%" + query + "%").toUpperCase();
        List<Object[]> autocompletes = superAdmin ? teamRepository.autocompleteSuperAdmin(id, queryUpper) : teamRepository
                .autocomplete(id, queryUpper, id);
        List<TeamAutocomplete> autoCompletes = autocompletes
                .stream()
                .map(arr -> new TeamAutocomplete(
                        arr[0].toString(),
                        Long.valueOf(arr[1].toString()),
                        arr[2] != null ? arr[2].toString() : "",
                        (arr.length == 4 && arr[3] != null) ? arr[3].toString() : null))
                .sorted((a1, a2) -> teamMatcher.compare(a1.getName().toLowerCase(), a2.getName().toLowerCase(), queryUpper.toLowerCase()))
                .collect(toList());
        return autoCompletes.subList(0, Math.max(0, Math.min(autoCompletes.size(), 11)));
    }

    @GetMapping("api/teams/team-exists-by-name")
    public boolean teamExistsByName(@RequestParam("name") String name) {
        if (name.equals("malpura")) {
            throw new IllegalArgumentException(name);
        }
        return !teamRepository.existsByUrn(constructUrn(name)).isEmpty();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("api/teams/teams")
    public Object createTeam(HttpServletRequest request, @Validated @RequestBody NewTeamProperties teamProperties, FederatedUser federatedUser) throws IOException, MessagingException {
        String name = teamProperties.getName();

        String urn = constructUrn(name);
        List<Object> urns = teamRepository.existsByUrn(urn);

        teamNameDuplicated(name, urns);

        Team team = new Team(urn, name, teamProperties.getDescription(), teamProperties.isViewable(), teamProperties.getPersonalNote());
        Person person = federatedUser.getPerson();
        String roleOfCurrentUser = teamProperties.getRoleOfCurrentUser();
        Role currentUserRole = getCurrentUserRole(roleOfCurrentUser);
        Membership membership = new Membership(currentUserRole, team, person, MembershipOrigin.INITIAL_ADMIN, person.getName());

        Team savedTeam = teamRepository.save(team);

        log.info("Team {} created by {}", urn, federatedUser.getUrn());

        if (!CollectionUtils.isEmpty(teamProperties.getEmails())) {
            teamProperties.getEmails().forEach((email, role) -> {
                Invitation invitation = new Invitation(
                        team,
                        email,
                        Role.valueOf(role),
                        teamProperties.getLanguage(),
                        null);
                invitation.addInvitationMessage(person, teamProperties.getInvitationMessage());
                Invitation saved = saveAndSendInvitation(Collections.singletonList(invitation), team, person, federatedUser).get(0);
                savedTeam.getInvitations().add(saved);

            });
        }

        return lazyLoadTeam(savedTeam, membership.getRole(), federatedUser);
    }

    private Role getCurrentUserRole(String roleOfCurrentUser) {
        return StringUtils.hasText(roleOfCurrentUser) ? Role.valueOf(roleOfCurrentUser) : Role.ADMIN;
    }

    private String constructUrn(String name) {
        return format("%s:%s", defaultStemName,
                name.toLowerCase().trim().replaceAll("[ ']", "_"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("api/teams/teams")
    public Object updateTeam(@Validated @RequestBody TeamProperties teamProperties, FederatedUser federatedUser) {
        Team team = teamById(teamProperties.getId(), false);

        String federatedUserUrn = federatedUser.getUrn();
        Role roleOfLoggedInPerson = membership(team, federatedUserUrn).getRole();
        onlyAdminAllowed(roleOfLoggedInPerson, federatedUser, team, "update");

        team.setDescription(teamProperties.getDescription());
        team.setViewable(teamProperties.isViewable());
        team.setPersonalNote(teamProperties.getPersonalNote());
        team.setPublicLinkDisabled(teamProperties.isPublicLinkDisabled());

        log.info("Team {} updated by {}", team.getUrn(), federatedUserUrn);

        return lazyLoadTeam(teamRepository.save(team), roleOfLoggedInPerson, federatedUser);
    }

    @PutMapping("api/teams/teams/reset-public-link/{id}")
    public Object resetPublicLink(@PathVariable("id") Long id, FederatedUser federatedUser) {
        Team team = teamById(id, false);

        String federatedUserUrn = federatedUser.getUrn();
        Role roleOfLoggedInPerson = membership(team, federatedUserUrn).getRole();
        onlyAdminAllowed(roleOfLoggedInPerson, federatedUser, team, "resetPublicLink");

        team.resetPublicLink();
        log.info("Team {} resetPublicLink by {}", team.getUrn(), federatedUserUrn);

        return lazyLoadTeam(teamRepository.save(team), roleOfLoggedInPerson, federatedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("api/teams/teams/{id}")
    public void deleteTeam(@PathVariable("id") Long id, FederatedUser federatedUser) {
        Team team = teamById(id, false);

        String federatedUserUrn = federatedUser.getUrn();
        Role roleOfLoggedInPerson = membership(team, federatedUserUrn).getRole();
        onlyAdminAllowed(roleOfLoggedInPerson, federatedUser, team, "delete");

        List<ExternalTeam> externalTeams = externalTeamRepository.findByTeamsUrn(team.getUrn());
        externalTeams.forEach(externalTeam -> removeTeamFromExternalTeam(externalTeam, team));

        teamRepository.delete(team);
        log.info("Team {} deleted by {}", team.getUrn(), federatedUserUrn);
    }

    private void removeTeamFromExternalTeam(ExternalTeam externalTeam, Team team) {
        externalTeam.getTeams().remove(team);
        externalTeamRepository.save(externalTeam);
    }

}
