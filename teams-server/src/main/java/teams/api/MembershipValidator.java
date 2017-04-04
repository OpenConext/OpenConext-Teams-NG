package teams.api;

import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;

public interface MembershipValidator {

    default void membersCanNotDoAnything(Role roleOfLoggedInPerson) {
        if (roleOfLoggedInPerson.equals(Role.MEMBER)) {
            throw new IllegalMembershipException("Members are not allowed to do anything");
        }
    }

    default void oneAdminIsRequired(Team team, Person person, Role futureRole) {
        if (!futureRole.equals(Role.ADMIN)) {
            team.getMemberships().stream()
                .filter(membership -> !membership.getUrnPerson().equals(person.getUrn()))
                .filter(membership -> membership.getRole().equals(Role.ADMIN))
                .findAny()
                .orElseThrow(() ->
                    new IllegalMembershipException(String.format("Not allowed to remove the only admin {}", person.getUrn())));
        }
    }

    default void canNotUpgradeToMoreImportantThenYourself(Role roleOfLoggedInPerson, Role futureRole) {
        if (futureRole.isMoreImportant(roleOfLoggedInPerson)) {
            throw new IllegalMembershipException(String.format(
                "Not allowed to upgrade someone more import then yourself: your role is {} and future role is {}",
                roleOfLoggedInPerson, futureRole));
        }
    }

}
