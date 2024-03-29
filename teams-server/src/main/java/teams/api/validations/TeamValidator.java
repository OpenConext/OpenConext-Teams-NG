package teams.api.validations;

import org.springframework.beans.factory.annotation.Value;
import teams.domain.*;
import teams.exception.DuplicateTeamNameException;
import teams.exception.IllegalMembershipException;
import teams.exception.InvalidTeamNameException;

import java.util.List;
import java.util.function.BiConsumer;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static java.lang.String.format;

public interface TeamValidator {

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
        boolean superAdmin = user.getPerson().isSuperAdmin();
        team.getMemberships().forEach(membership -> membership.getPerson().isValid());
        if (Role.MEMBER.equals(role) && !superAdmin) {
            return new TeamDetailsSummary(team, user);
        }
        team.getInvitations()
                //lazy load messages
                .forEach(invitation -> invitation.getInvitationMessages().forEach(InvitationMessage::getMessage));
        team.getJoinRequests().forEach(joinRequest -> joinRequest.getPerson().isValid());
        team.getExternalTeams().forEach(ExternalTeam::getIdentifier);
        return team;
    }

    default boolean isAllowedToAcceptJoinRequest(TeamSummary teamSummary) {
        return Role.ADMIN.equals(teamSummary.getRole()) || Role.MANAGER.equals(teamSummary.getRole())
                || Role.OWNER.equals(teamSummary.getRole());
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

    default void validateTeamName(String name) {
        Pattern pattern = Pattern.compile("[\\w \\-']{1,255}");
        if (!pattern.matcher(name).matches()) {
            throw new InvalidTeamNameException(
                    String.format("Team name %s in invalid, must match %s", name, pattern.pattern()));
        }

    }

}
