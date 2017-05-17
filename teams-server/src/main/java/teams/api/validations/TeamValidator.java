package teams.api.validations;

import teams.domain.*;
import teams.exception.DuplicateTeamNameException;
import teams.exception.IllegalMembershipException;

import java.util.List;
import java.util.function.BiConsumer;

import static java.lang.String.format;

public interface TeamValidator {

    default void teamNameDuplicated(String name, List<Object> urns) {
        if (!urns.isEmpty()) {
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
                invitation -> invitation.getInvitationMessages().forEach(InvitationMessage::getMessage));
        team.getJoinRequests().forEach(joinRequest -> joinRequest.getPerson().isValid());
        team.getExternalTeams().forEach(ExternalTeam::getIdentifier);
        return team;
    }

    default boolean isAllowedToAcceptJoinRequest(TeamSummary teamSummary) {
        return Role.ADMIN.equals(teamSummary.getRole()) || Role.MANAGER.equals(teamSummary.getRole());
    }

    default void invitationsCountFromQuery(List<Object[]> counts, List<TeamSummary> summaries) {
        consumeTeamSummaryById(counts, summaries, (teamSummary, integer) -> teamSummary.invitationsCount(integer));
    }

    default void joinRequestsCountFromQuery(List<Object[]> counts, List<TeamSummary> summaries) {
        consumeTeamSummaryById(counts, summaries, (teamSummary, integer) -> teamSummary.joinRequestsCount(integer));
    }

    default void consumeTeamSummaryById(List<Object[]> counts, List<TeamSummary> summaries, BiConsumer<TeamSummary, Integer> biConsumer) {
        counts.forEach(objects -> summaries.stream().filter(teamSummary -> teamSummary.getId().equals(Long.class.cast(objects[0])))
                .findFirst().ifPresent(teamSummary -> biConsumer.accept(teamSummary, Number.class.cast(objects[1]).intValue())));
    }

}
