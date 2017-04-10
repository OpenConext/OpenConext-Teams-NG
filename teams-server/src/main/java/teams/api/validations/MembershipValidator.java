package teams.api.validations;

import teams.domain.FederatedUser;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalJoinRequestException;
import teams.exception.IllegalMembershipException;

import java.util.List;

import static java.util.stream.Collectors.toList;

public interface MembershipValidator {

    default void membersCanNotChangeRoles(Role roleOfLoggedInPerson) {
        if (roleOfLoggedInPerson.equals(Role.MEMBER)) {
            throw new IllegalMembershipException("Members are not allowed to change roles");
        }
    }

    default void oneAdminIsRequired(Team team, Person person, Role futureRole) {
        if (!futureRole.equals(Role.ADMIN)) {
            team.getMemberships().stream()
                .filter(membership -> !membership.getUrnPerson().equals(person.getUrn()))
                .filter(membership -> membership.getRole().equals(Role.ADMIN))
                .findAny()
                .orElseThrow(() ->
                    new IllegalMembershipException(String.format("Not allowed to remove the only admin %s", person.getUrn())));
        }
    }

    default void canNotUpgradeToMoreImportantThenYourself(Role roleOfLoggedInPerson, Role futureRole) {
        if (futureRole.isMoreImportant(roleOfLoggedInPerson)) {
            throw new IllegalMembershipException(String.format(
                "Not allowed to upgrade someone more import then yourself: your role is %s and future role is %s",
                roleOfLoggedInPerson, futureRole));
        }
    }

    default void onlyAdminsCanRemoveOthers(Role roleOfLoggedInPerson, Person personWhoIsRemoved, FederatedUser federatedUser) {
        if (!(roleOfLoggedInPerson.equals(Role.ADMIN) || personWhoIsRemoved.getUrn().equals(federatedUser.getUrn()))) {
            throw new IllegalMembershipException("Members are not allowed to do remove memberships other then themselves");
        }
    }

    default void membershipNotAllowed(Team team, Person person) {
        if (team.getMemberships().stream().anyMatch(membership -> membership.getUrnPerson().equals(person.getUrn()))) {
            throw new IllegalJoinRequestException(String.format("Person %s is already a member of team %s", person.getUrn(), team.getUrn()));
        }
    }

    default void privateTeamDoesNotAllowMembers(Team team, Person person) {
        if (!team.isViewable()) {
            throw new IllegalJoinRequestException(String.format("Person %s can not join private team %s", person.getUrn(), team.getUrn()));
        }
    }

    default List<String> admins(Team team) {
        List<String> admins = team.getMemberships().stream()
            .filter(membership -> membership.getRole().equals(Role.ADMIN))
            .map(membership -> membership.getPerson().getEmail())
            .collect(toList());
        if (admins.isEmpty()) {
            throw new IllegalJoinRequestException(String.format("Team %s does not have an ADMIN user", team.getUrn()));
        }
        return admins;
    }


}
