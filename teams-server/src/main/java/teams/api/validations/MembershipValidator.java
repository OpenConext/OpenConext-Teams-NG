package teams.api.validations;

import teams.domain.FederatedUser;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalJoinRequestException;
import teams.exception.IllegalMembershipException;

public interface MembershipValidator {

    default void membersCanNotChangeRoles(Role roleOfLoggedInPerson) {
        if (roleOfLoggedInPerson.equals(Role.MEMBER)) {
            throw new IllegalMembershipException("Members are not allowed to change roles");
        }
    }

    default void roleForChangingExpiryDate(Role roleOfLoggedInPerson) {
        if (Role.ADMIN.isLessImportant(roleOfLoggedInPerson)) {
            throw new IllegalMembershipException("Only admins and managers are allowed to change expiry dates");
        }
    }

    default void oneAdminIsRequired(Team team, Person person, Role futureRole) {
        boolean isMember = team.getMemberships().stream().anyMatch(membership ->
                membership.getUrnPerson().equals(person.getUrn()) && (membership.getRole().equals(Role.MEMBER) ||
                        membership.getRole().equals(Role.MANAGER)));
        if (!isMember && (futureRole.equals(Role.MEMBER) || futureRole.equals(Role.MANAGER))) {
            team.getMemberships().stream()
                    .filter(membership -> !membership.getUrnPerson().equals(person.getUrn()))
                    .filter(membership -> membership.getRole().equals(Role.ADMIN) || membership.getRole().equals(Role.OWNER))
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

    default void onlyAdminsAndManagersCanRemoveMemberships(Role roleOfLoggedInPerson, Person personWhoIsRemoved,
                                                           FederatedUser federatedUser, Role roleOfMembershipToBeDeleted) {
        boolean personWantsToDeleteHerself = personWhoIsRemoved.getUrn().equals(federatedUser.getUrn());
        if (roleOfLoggedInPerson.equals(Role.MEMBER) && !personWantsToDeleteHerself) {
            throw new IllegalMembershipException("Members are not allowed to do remove memberships other then themselves");
        }
        if (roleOfLoggedInPerson.equals(Role.MANAGER) && !roleOfMembershipToBeDeleted.equals(Role.MEMBER) &&
                !personWantsToDeleteHerself) {
            throw new IllegalMembershipException("Managers are only allowed to remove members");
        }
    }

    default void privateTeamDoesNotAllowMembers(Team team, Person person) {
        if (!team.isViewable()) {
            throw new IllegalJoinRequestException(String.format("Person %s can not join private team %s", person.getUrn(), team.getUrn()));
        }
    }


}
