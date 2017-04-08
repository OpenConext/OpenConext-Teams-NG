package teams.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.ExternalTeam;
import teams.domain.FederatedUser;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.domain.TeamAutocomplete;
import teams.domain.TeamSummary;
import teams.exception.DuplicateTeamNameException;
import teams.exception.IllegalMembershipException;
import teams.exception.ResourceNotFoundException;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;


@RestController
public class TeamController extends ApiController {

    @Value("${teams.group-name-context}")
    private String groupNameContext;

    @Value("${teams.default-stem-name}")
    private String defaultStemName;

    private TeamMatcher teamMatcher = new TeamMatcher();

    @GetMapping("api/teams/teams/me")
    public List<TeamSummary> myTeams(FederatedUser federatedUser) {
        return teamRepository
            .findByMembershipsUrnPersonOrderByNameAsc(federatedUser.getUrn(), new PageRequest(0, Integer.MAX_VALUE))
            .getContent()
            .stream()
            .map(team -> new TeamSummary(team, federatedUser))
            .collect(toList());
    }

    @GetMapping("api/teams/teams/{urn}")
    public Team teamByUrn(@PathVariable("urn") String urn, FederatedUser federatedUser) {
        Team team = teamByUrn(urn);
        membership(team, federatedUser.getUrn());
        return lazyLoadTeam(team);
    }

    @GetMapping("api/teams/teams")
    public List<TeamAutocomplete> teamSearch(@RequestParam("query") String query, FederatedUser federatedUser) {
        if (query.length() < 3) {
            throw new IllegalArgumentException("Minimal query lenght is 3");
        }
        List<TeamAutocomplete> autocompleteList = teamRepository.autocomplete(("%" + query + "%").toUpperCase(), federatedUser.getUrn())
            .stream()
            .sorted((s1, s2) -> teamMatcher.compare(s1[0].toString().toLowerCase(), s2[0].toString().toLowerCase(), query.toLowerCase()))
            .map(arr -> new TeamAutocomplete(arr[0].toString(), arr[1].toString()))
            .collect(toList());
        return autocompleteList.subList(0, Math.max(0, Math.min(autocompleteList.size(), 15)));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("api/teams/teams")
    public Team createTeam(@Validated @RequestBody Team teamProperties, FederatedUser federatedUser) {
        String name = teamProperties.getName();
        String urn = format("%s:%s", defaultStemName,
            name.toLowerCase().trim().replaceAll("[ ']", "_"));
        Optional<Team> teamOptional = teamRepository.findByUrn(urn);

        if (teamOptional.isPresent()) {
            throw new DuplicateTeamNameException(format("Team with name %s already exists", name));
        }

        Team team = new Team(urn, name, teamProperties.getDescription(), teamProperties.isViewable());
        Person person = federatedUser.getPerson();
        new Membership(Role.ADMIN, team, person);

        LOG.info("Team {} created by {}", urn, federatedUser.getUrn());

        return teamRepository.save(team);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("api/teams/teams")
    public Team updateTeam(@Validated @RequestBody Team teamProperties, FederatedUser federatedUser) {
        Team team = teamByUrn(teamProperties.getUrn());

        String federatedUserUrn = onlyAdminAllowed(federatedUser, team, "update");

        team.setDescription(teamProperties.getDescription());
        team.setViewable(teamProperties.isViewable());

        LOG.info("Team {} updated by {}", team.getUrn(), federatedUserUrn);

        return teamRepository.save(team);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("api/teams/teams/{id}")
    public void deleteTeam(@PathVariable("id") Long id, FederatedUser federatedUser) {
        Team team = teamRepository.findOne(id);
        assertNotNull(Team.class.getSimpleName(), team, id);

        String federatedUserUrn = onlyAdminAllowed(federatedUser, team, "delete");

        List<ExternalTeam> externalTeams = externalTeamRepository.findByTeamsUrn(team.getUrn());
        externalTeams.forEach(externalTeam -> removeTeamFromExternalTeam(externalTeam, team));

        teamRepository.delete(team);
        LOG.info("Team {} deleted by {}", team.getUrn(), federatedUserUrn);
    }

    private void removeTeamFromExternalTeam(ExternalTeam externalTeam, Team team) {
        externalTeam.getTeams().remove(team);
        externalTeamRepository.save(externalTeam);
    }

    private String onlyAdminAllowed(FederatedUser federatedUser, Team team, String action) {
        String federatedUserUrn = federatedUser.getUrn();
        Role roleOfLoggedInPerson = membership(team, federatedUserUrn).getRole();

        if (roleOfLoggedInPerson.isLessImportant(Role.ADMIN)) {
            throw new IllegalMembershipException(String.format(
                "Only ADMIN can %s team. Person %s is %s in team %s",
                action, federatedUserUrn, roleOfLoggedInPerson, team.getUrn()));
        }
        return federatedUserUrn;
    }

    private Team lazyLoadTeam(Team team) {
        team.getMemberships().forEach(membership -> membership.getPerson().isValid());
        return team;
    }


}
