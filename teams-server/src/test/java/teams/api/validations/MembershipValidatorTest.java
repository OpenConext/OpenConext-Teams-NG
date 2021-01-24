package teams.api.validations;

import org.junit.Test;
import teams.Seed;
import teams.api.MembershipController;
import teams.domain.Membership;
import teams.domain.MembershipOrigin;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalJoinRequestException;
import teams.exception.IllegalMembershipException;

public class MembershipValidatorTest implements Seed {

    private MembershipValidator subject = new MembershipController();

    @Test(expected = IllegalMembershipException.class)
    public void membersCanNotDoAnything() {
        subject.membersCanNotChangeRoles(Role.MEMBER);
    }

    @Test
    public void membersCanNotDoAnythingNoException() {
        subject.membersCanNotChangeRoles(Role.MANAGER);
    }

    @Test(expected = IllegalMembershipException.class)
    public void oneAdminIsRequired() {
        Team team = team();
        Person person = person("urn");
        team.getMemberships().add(
                new Membership(Role.ADMIN, team, person, MembershipOrigin.INITIAL_ADMIN, "John Doe"));
        subject.oneAdminIsRequired(team, person, Role.MEMBER);
    }

    @Test
    public void oneAdminIsRequiredNoException() {
        Team team = team();
        Person person = person("urn");
        team.getMemberships().add(
                new Membership(Role.ADMIN, team, person,MembershipOrigin.INITIAL_ADMIN, "John Doe"));
        subject.oneAdminIsRequired(team, person, Role.ADMIN);
    }

    @Test
    public void oneAdminIsRequiredNoExceptionOtherAdmin() {
        Team team = team();
        Person person = person("urn");
        team.getMemberships().add(new Membership(Role.ADMIN, team, person,MembershipOrigin.INITIAL_ADMIN, "John Doe"));
        team.getMemberships().add(new Membership(Role.ADMIN, team, person("admin"),MembershipOrigin.INITIAL_ADMIN, "John Doe"));

        subject.oneAdminIsRequired(team, person, Role.MEMBER);
    }

    @Test
    public void oneAdminIsRequiredNoExceptionMember() {
        Team team = team();
        Person person = person("urn");
        team.getMemberships().add(new Membership(Role.MEMBER, team, person,MembershipOrigin.INITIAL_ADMIN, "John Doe"));
        subject.oneAdminIsRequired(team, person, Role.MEMBER);
    }

    @Test
    public void canNotUpgradeToMoreImportantThenYourselfAllowed() {
        subject.canNotUpgradeToMoreImportantThenYourself(Role.MANAGER, Role.MANAGER);
        subject.canNotUpgradeToMoreImportantThenYourself(Role.MANAGER, Role.MEMBER);
    }

    @Test(expected = IllegalMembershipException.class)
    public void canNotUpgradeToMoreImportantThenYourself() {
        subject.canNotUpgradeToMoreImportantThenYourself(Role.MANAGER, Role.ADMIN);
    }

    @Test
    public void membersCanNotRemoveOthersButAdminCan() {
        subject.onlyAdminsAndManagersCanRemoveMemberships(Role.ADMIN, person("urn"), federatedUser("diff"), Role.MANAGER);
    }

    @Test
    public void membersCanNotRemoveOthersButThemselves() {
        subject.onlyAdminsAndManagersCanRemoveMemberships(Role.MEMBER, person("urn"), federatedUser("urn"), Role.MEMBER);
    }

    @Test
    public void managersCanRemoveMembersAndThemselves() {
        subject.onlyAdminsAndManagersCanRemoveMemberships(Role.MANAGER, person("urn"), federatedUser("urn"), Role.MANAGER);
    }

    @Test(expected = IllegalMembershipException.class)
    public void membersCanNotRemoveOthers() {
        subject.onlyAdminsAndManagersCanRemoveMemberships(Role.MEMBER, person("urn"), federatedUser("diff"), Role.MEMBER);
    }

    @Test
    public void managersCanRemoveMembers() {
        subject.onlyAdminsAndManagersCanRemoveMemberships(Role.MANAGER, person("urn"), federatedUser("diff"), Role.MEMBER);
    }

    @Test(expected = IllegalMembershipException.class)
    public void managersMayNotRemoveOtherManagers() {
        subject.onlyAdminsAndManagersCanRemoveMemberships(Role.MANAGER, person("urn"), federatedUser("diff"), Role.MANAGER);
    }

    @Test(expected = IllegalJoinRequestException.class)
    public void privateTeamDoesNotAllowMembers() {
        subject.privateTeamDoesNotAllowMembers(team(false), person("urn"));
    }

}