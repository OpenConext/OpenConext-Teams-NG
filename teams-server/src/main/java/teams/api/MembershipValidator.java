package teams.api;

import teams.domain.FederatedUser;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalMembershipException;

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

    default void membersCanNotRemoveOthers(Role roleOfLoggedInPerson, Person personWhoIsRemoved, FederatedUser federatedUser) {
        if (roleOfLoggedInPerson.equals(Role.MEMBER) && !personWhoIsRemoved.getUrn().equals(federatedUser.getUrn())) {
            throw new IllegalMembershipException("Members are not allowed to do remove memberships other then themselves");
        }
    }
}