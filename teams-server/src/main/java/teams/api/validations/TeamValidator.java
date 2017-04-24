package teams.api.validations;

import teams.domain.*;
import teams.exception.DuplicateTeamNameException;
import teams.exception.IllegalLinkExternalTeamException;
import teams.exception.IllegalMembershipException;

import java.util.Optional;

import static java.lang.String.format;

public interface TeamValidator {

    default void teamNameDuplicated(String name, Optional<Team> teamOptional) {
        if (teamOptional.isPresent()) {
            throw new DuplicateTeamNameException(format("Team with name %s already exists", name));
        }
    }

    default String onlyAdminAllowed(Role roleOfLoggedInPerson, FederatedUser federatedUser, Team team, String action) {
        String federatedUserUrn = federatedUser.getUrn();

        if (roleOfLoggedInPerson.isLessImportant(Role.ADMIN)) {
            throw new IllegalMembershipException(String.format(
                    "Only ADMIN can %s team. Person %s is %s in team %s",
                    action, federatedUserUrn, roleOfLoggedInPerson, team.getUrn()));
        }
        return federatedUserUrn;
    }

    default Object lazyLoadTeam(Team team, Role role, FederatedUser user) {
        team.getMemberships().forEach(membership -> membership.getPerson().isValid());
        if (role.equals(Role.MEMBER)) {
            return new TeamDetailsSummary(team, user);
        }
        team.getInvitations().forEach(
                invitation -> invitation.getInvitationMessages().forEach(message -> message.getMessage()));
        team.getJoinRequests().forEach(joinRequest -> joinRequest.getPerson().isValid());
        team.getExternalTeams().forEach(externalTeam -> externalTeam.getIdentifier());
        return team;
    }

    default boolean isAllowedToAcceptJoinRequest(TeamSummary teamSummary) {
        return Role.ADMIN.equals(teamSummary.getRole()) || Role.MEMBER.equals(teamSummary.getRole());
    }


}
