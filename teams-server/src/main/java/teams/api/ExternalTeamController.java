package teams.api;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import teams.api.validations.ExternalTeamValidator;
import teams.domain.*;
import teams.exception.ResourceNotFoundException;

import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.toList;


@RestController
public class ExternalTeamController extends ApiController implements ExternalTeamValidator {

    @GetMapping("api/teams/external-teams/linked-teams")
    public Map<String, List<LinkedTeamInfo>> linkedTeams(FederatedUser federatedUser) {
        List<String> externalTeamIdentifiers = federatedUser.getExternalTeams().stream()
                .map(ExternalTeam::getIdentifier).collect(toList());
        if (externalTeamIdentifiers.isEmpty()) {
            return Collections.emptyMap();
        }
        List<Object[]> teamsByExternalTeamIdentifiers = externalTeamRepository
                .findTeamsByExternalTeamIdentifiers(externalTeamIdentifiers);

        return teamsByExternalTeamIdentifiers.stream()
                .map(obj ->
                        new LinkedTeamInfo(String.class.cast(obj[0]), Long.class.cast(obj[1]), String.class.cast(obj[2])))
                .collect(groupingBy(LinkedTeamInfo::getExternalTeamIdentifier));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("api/teams/external-teams/link")
    public Object linkTeamToExternalTeam(@Validated @RequestBody ExternalTeamProperties externalTeamProperties, FederatedUser federatedUser) {
        Team team = teamById(externalTeamProperties.getId(), true);
        String externalTeamIdentifier = externalTeamProperties.getExternalTeamIdentifier();

        ExternalTeam externalTeam = externalTeamFromFederatedUser(federatedUser, externalTeamIdentifier);

        externalTeamNotLinked(team, externalTeam);

        String federatedUserUrn = federatedUser.getUrn();
        Role roleOfLoggedInPerson = membership(team, federatedUserUrn).getRole();

        isAllowedToLinkExternalTeam(roleOfLoggedInPerson, team, federatedUser);

        //There is the possibility that the external team is already linked another team of this person
        externalTeam = externalTeamRepository.findByIdentifier(externalTeamIdentifier).orElse(externalTeam);
        externalTeam.setAdminName(federatedUser.getUsername());
        externalTeam.setCreatedAt(Instant.now());

        team.getExternalTeams().add(externalTeam);
        externalTeam.getTeams().add(team);

        log.info("Team {} linked to external team {} by {}", team.getUrn(), externalTeamIdentifier, federatedUserUrn);

        return lazyLoadTeam(teamRepository.save(team), roleOfLoggedInPerson, federatedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("api/teams/external-teams/delink")
    public Object delinkTeamFromExternalTeam(@Validated @RequestBody ExternalTeamProperties externalTeamProperties, FederatedUser federatedUser) {
        Team team = teamById(externalTeamProperties.getId(), true);
        String externalTeamIdentifier = externalTeamProperties.getExternalTeamIdentifier();

        //validation
        externalTeamFromFederatedUser(federatedUser, externalTeamIdentifier);
        ExternalTeam externalTeam = externalTeamRepository.findByIdentifier(externalTeamIdentifier).orElseThrow(() ->
                new ResourceNotFoundException(
                        String.format("ExternalTeam %s does not exists. Can not be unlinked by Person %s.",
                                externalTeamIdentifier, federatedUser.getUrn())));

        String federatedUserUrn = federatedUser.getUrn();
        Role roleOfLoggedInPerson = membership(team, federatedUserUrn).getRole();

        isAllowedToLinkExternalTeam(roleOfLoggedInPerson, team, federatedUser);
        externalTeamLinked(team, externalTeam);

        team.getExternalTeams().remove(externalTeam);
        externalTeam.getTeams().remove(team);

        log.info("Team {} de-linked from external team {} by {}", team.getUrn(), externalTeam.getIdentifier(), federatedUserUrn);

        Team teamSaved = teamRepository.save(team);
        if (externalTeam.getTeams().isEmpty()) {
            externalTeamRepository.delete(externalTeam);
        }
        return lazyLoadTeam(teamSaved, roleOfLoggedInPerson, federatedUser);
    }

}
