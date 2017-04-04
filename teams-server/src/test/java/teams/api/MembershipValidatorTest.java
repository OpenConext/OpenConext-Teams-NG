package teams.api;

import org.junit.Test;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;

public class MembershipValidatorTest {

    private MembershipValidator subject = new MembershipController();

    @Test(expected = IllegalMembershipException.class)
    public void membersCanNotDoAnything() throws Exception {
        subject.membersCanNotDoAnything(Role.MEMBER);
    }

    @Test
    public void membersCanNotDoAnythingNoException() throws Exception {
        subject.membersCanNotDoAnything(Role.MANAGER);
    }

    @Test(expected = IllegalMembershipException.class)
    public void oneAdminIsRequired() throws Exception {
        Team team = team();
        Person person = person("urn");
        team.getMemberships().add(
            new Membership(Role.ADMIN, team, person));
        subject.oneAdminIsRequired(team, person, Role.MEMBER);
    }

    @Test
    public void oneAdminIsRequiredNoException() throws Exception {
        Team team = team();
        Person person = person("urn");
        team.getMemberships().add(
            new Membership(Role.ADMIN, team, person));
        subject.oneAdminIsRequired(team, person, Role.ADMIN);
    }

    @Test
    public void oneAdminIsRequiredNoExceptionOtherAdmin() throws Exception {
        Team team = team();
        Person person = person("urn");
        team.getMemberships().add(new Membership(Role.ADMIN, team, person));
        team.getMemberships().add(new Membership(Role.ADMIN, team, person("admin")));

        subject.oneAdminIsRequired(team, person, Role.MEMBER);
    }

    @Test
    public void canNotUpgradeToMoreImportantThenYourselfAllowed() throws Exception {
        subject.canNotUpgradeToMoreImportantThenYourself(Role.MANAGER, Role.MANAGER);
        subject.canNotUpgradeToMoreImportantThenYourself(Role.MANAGER, Role.MEMBER);
    }

    @Test(expected = IllegalMembershipException.class)
    public void canNotUpgradeToMoreImportantThenYourself() throws Exception {
        subject.canNotUpgradeToMoreImportantThenYourself(Role.MANAGER, Role.ADMIN);
    }

    private Team team() {
        return new Team("urn", "name", "description", true);
    }

    private Person person(String urn) {
        return new Person(urn,"name", "email", true);
    }
}