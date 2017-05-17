package teams.api.validations;

import teams.domain.ExternalTeam;
import teams.domain.FederatedUser;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalLinkExternalTeamException;

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

    default void isAllowedToLinkExternalTeam(Role roleOfLoggedInPerson, Team team, FederatedUser federatedUser) {
        if (Role.MEMBER.equals(roleOfLoggedInPerson)){
            throw new IllegalLinkExternalTeamException(
                    String.format("Person %s is a Member of team %s. Members are not allowed to link / de-link external teams",
                            federatedUser.getUrn(), team.getUrn())
            );
        }
    }

    default boolean externalTeamLinkedToTeam(Team team, ExternalTeam externalTeam) {
        return team.getExternalTeams().stream()
                .filter(ex -> ex.getIdentifier().equals(externalTeam.getIdentifier())).findFirst().isPresent();
    }

    default ExternalTeam externalTeamFromFederatedUser(FederatedUser federatedUser, String externalTeamIdentifier) {
        return federatedUser.getExternalTeams().stream()
                .filter(et -> et.getIdentifier().equals(externalTeamIdentifier))
                .findFirst()
                .orElseThrow(() -> new IllegalLinkExternalTeamException(
                        String.format("Person %s is not a member of External Team %s",
                                federatedUser.getUrn(), externalTeamIdentifier)));

    }
}
