package teams.api.validations;

import teams.domain.ExternalTeam;
import teams.domain.Team;
import teams.exception.IllegalLinkExternalTeamException;

import java.util.List;

public interface ExternalTeamValidator extends TeamValidator {

    default void externalTeamNotLinked(Team team, ExternalTeam externalTeam) {
        if (externalTeamLinkedToTeam(team, externalTeam)) {
            throw new IllegalLinkExternalTeamException(
                    String.format("Team %s is already linked to ExternalTeam %s", team.getUrn(), externalTeam.getIdentifier()));
        }
    }

    default void externalTeamLinked(Team team, ExternalTeam externalTeam) {
        if (!externalTeamLinkedToTeam(team, externalTeam)) {
            throw new IllegalLinkExternalTeamException(
                    String.format("Team %s is not linked to ExternalTeam %s", team.getUrn(), externalTeam.getIdentifier()));
        }

    }

    default void externalTeamsMembership(List<ExternalTeam> externalTeamsOfPerson,
                                         List<ExternalTeam> externalTeamsToLink, String federatedUserUrn) {
        externalTeamsToLink.forEach(externalTeam -> {
            if (!externalTeamsOfPerson.contains(externalTeam)) {
                throw new IllegalLinkExternalTeamException(
                        String.format("Person %s is not a member of External Team %s", federatedUserUrn, externalTeam.getIdentifier()));
            }
        });
    }

    default boolean externalTeamLinkedToTeam(Team team, ExternalTeam externalTeam) {
        return team.getExternalTeams().stream()
                .filter(ex -> ex.getIdentifier().equals(externalTeam.getIdentifier())).findFirst().isPresent();
    }
}
