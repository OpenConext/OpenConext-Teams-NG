package teams.api.validations;

import org.junit.Test;
import teams.Seed;
import teams.api.JoinRequestController;
import teams.domain.*;
import teams.exception.IllegalJoinRequestException;
import teams.exception.IllegalMembershipException;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class JoinRequestValidatorTest implements Seed{

    private JoinRequestValidator subject = new JoinRequestController();

    @Test(expected = IllegalJoinRequestException.class)
    public void membershipNotAllowed() {
        Person person = person("urn");
        Team team = team();
        membership(Role.ADMIN, team, person);

        subject.membershipNotAllowed(team, person);
    }

    @Test(expected = IllegalJoinRequestException.class)
    public void adminsException() {
        subject.admins(team());
    }

    @Test
    public void admins() {
        Team team = team();
        new Membership(Role.ADMIN, team, person(), MembershipOrigin.INITIAL_ADMIN, "John Doe");
        List<String> admins = subject.admins(team);

        assertEquals(1, admins.size());
    }

    @Test
    public void validateJoinRequest() throws Exception {
        subject.validateJoinRequest(joinRequest("urn"), federatedUser("urn"));
    }

    @Test(expected = IllegalJoinRequestException.class)
    public void validateJoinRequestException() throws Exception {
        subject.validateJoinRequest(joinRequest("nope"), federatedUser("different"));
    }

    @Test(expected = IllegalMembershipException.class)
    public void membersCanNotApproveJoinRequests() {
        subject.membersCanNotApproveJoinRequests(Role.MEMBER);
    }

    @Test
    public void managersCanApproveJoinRequests() {
        subject.membersCanNotApproveJoinRequests(Role.MANAGER);
    }

}