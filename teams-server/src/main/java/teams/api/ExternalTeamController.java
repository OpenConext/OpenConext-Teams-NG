package teams.api;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.ExternalTeamValidator;
import teams.domain.*;

import java.util.List;

import static java.util.stream.Collectors.toList;


@RestController
public class ExternalTeamController extends ApiController implements ExternalTeamValidator {

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("api/teams/external")
    public Object linkTeamToExternalTeam(@Validated @RequestBody ExternalTeamProperties externalTeamProperties, FederatedUser federatedUser) {
        Team team = teamById(externalTeamProperties.getTeamId());
        List<ExternalTeam> externalTeams = externalTeamProperties.getExternalTeams();

        externalTeams.forEach(externalTeam -> externalTeamNotLinked(team, externalTeam));

        String federatedUserUrn = federatedUser.getUrn();
        Role roleOfLoggedInPerson = membership(team, federatedUserUrn).getRole();

        List<ExternalTeam> teams = federatedUser.getExternalTeams();
        externalTeamsMembership(teams, externalTeams, federatedUserUrn);

        //replace all external teams that are already provisioned
        List<ExternalTeam> provisionedExternalTeams = externalTeamRepository.findByIdentifierIn(
                externalTeams.stream().map(externalTeam -> externalTeam.getIdentifier()).collect(toList()));

        List<ExternalTeam> newExternalTeams = externalTeams.stream()
                .filter(externalTeam -> !provisionedExternalTeams.contains(externalTeam)).collect(toList());

        provisionedExternalTeams.addAll(newExternalTeams);
        team.getExternalTeams().addAll(provisionedExternalTeams);
        provisionedExternalTeams.forEach(externalTeam -> externalTeam.getTeams().add(team));

        LOG.info("Team {} linked to external teams {} by {}", team.getUrn(),
                provisionedExternalTeams.stream().map(ExternalTeam::getIdentifier).collect(toList()), federatedUserUrn);

        return lazyLoadTeam(teamRepository.save(team), roleOfLoggedInPerson, federatedUser);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("api/teams/external/{id}/{teamId}")
    public Object delinkTeamFromExternalTeam(@PathVariable("id") Long id,@PathVariable("teamId") Long teamId, FederatedUser federatedUser) {
        Team team = teamById(teamId);
        ExternalTeam externalTeam = externalTeamById(id);

        String federatedUserUrn = federatedUser.getUrn();
        Role roleOfLoggedInPerson = membership(team, federatedUserUrn).getRole();

        externalTeamLinked(team, externalTeam);
        team.getExternalTeams().remove(externalTeam);
        externalTeam.getTeams().remove(team);

        LOG.info("Team {} de-linked from external team {} by {}", team.getUrn(), externalTeam.getIdentifier(), federatedUserUrn);

        Team teamSaved = teamRepository.save(team);
        if (externalTeam.getTeams().isEmpty()) {
            externalTeamRepository.delete(externalTeam);
        }
        return lazyLoadTeam(teamSaved, roleOfLoggedInPerson, federatedUser);
    }
}
