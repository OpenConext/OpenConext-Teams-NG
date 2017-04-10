package teams.api.validations;

import org.junit.Test;
import teams.Seed;
import teams.api.MembershipController;
import teams.domain.FederatedUser;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalJoinRequestException;
import teams.exception.IllegalMembershipException;

import java.util.List;

import static org.junit.Assert.assertEquals;

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
            new Membership(Role.ADMIN, team, person));
        subject.oneAdminIsRequired(team, person, Role.MEMBER);
    }

    @Test
    public void oneAdminIsRequiredNoException() {
        Team team = team();
        Person person = person("urn");
        team.getMemberships().add(
            new Membership(Role.ADMIN, team, person));
        subject.oneAdminIsRequired(team, person, Role.ADMIN);
    }

    @Test
    public void oneAdminIsRequiredNoExceptionOtherAdmin() {
        Team team = team();
        Person person = person("urn");
        team.getMemberships().add(new Membership(Role.ADMIN, team, person));
        team.getMemberships().add(new Membership(Role.ADMIN, team, person("admin")));

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
        subject.onlyAdminsCanRemoveOthers(Role.ADMIN, person("urn"), new FederatedUser(person("diff")));
    }

    @Test
    public void membersCanNotRemoveOthersButThemselves() {
        subject.onlyAdminsCanRemoveOthers(Role.MEMBER, person("urn"), new FederatedUser(person("urn")));
    }

    @Test
    public void managersCanNotRemoveOthersButThemselves() {
        subject.onlyAdminsCanRemoveOthers(Role.MANAGER, person("urn"), new FederatedUser(person("urn")));
    }

    @Test(expected = IllegalMembershipException.class)
    public void membersCanNotRemoveOthers() {
        subject.onlyAdminsCanRemoveOthers(Role.MEMBER, person("urn"), new FederatedUser(person("diff")));
    }

    @Test(expected = IllegalMembershipException.class)
    public void managersCanNotRemoveOthers() {
        subject.onlyAdminsCanRemoveOthers(Role.MANAGER, person("urn"), new FederatedUser(person("diff")));
    }

    @Test(expected = IllegalJoinRequestException.class)
    public void membershipNotAllowed() {
        Person person = person("urn");
        Team team = team();
        membership(Role.ADMIN, team, person);

        subject.membershipNotAllowed(team, person);
    }

    @Test(expected = IllegalJoinRequestException.class)
    public void privateTeamDoesNotAllowMembers() {
        subject.privateTeamDoesNotAllowMembers(team(false), person("urn"));
    }

    @Test(expected = IllegalJoinRequestException.class)
    public void adminsException() {
        subject.admins(team());
    }

    @Test
    public void admins() {
        Team team = team();
        new Membership(Role.ADMIN, team, person());
        List<String> admins = subject.admins(team);

        assertEquals(1, admins.size());
    }
}