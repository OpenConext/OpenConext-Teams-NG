package teams.api.validations;

import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;
import teams.Seed;
import teams.api.InvitationController;
import teams.domain.*;
import teams.exception.*;

import java.io.UnsupportedEncodingException;

import static org.junit.Assert.assertEquals;

public class InvitationValidatorTest implements Seed {

    private InvitationValidator subject = new InvitationController();

    @Test(expected = InvitationExpiredException.class)
    public void invitationExpired() throws Exception {
        Invitation invitation = invitation(false, false);
        ReflectionTestUtils.setField(invitation, "timestamp", 1000);
        subject.validateInvitation(invitation, person());
    }

    @Test(expected = InvitationAlreadyAcceptedException.class)
    public void invitationAlreadyAccepted() throws Exception {
        subject.validateInvitation(invitation(true, false), person());
    }

    @Test(expected = InvitationAlreadyAcceptedException.class)
    public void invitationPersonAlreadyMember() throws Exception {
        Invitation invitation = invitation(false, false);
        Person person = person();
        membership(Role.ADMIN, invitation.getTeam(), person);
        subject.validateInvitation(invitation, person);
    }

    @Test(expected = InvitationAlreadyDeclinedException.class)
    public void invitationAlreadyDeclined() throws Exception {
        subject.validateInvitation(invitation(false, true), person());
    }

    @Test
    public void membershipRequired() throws Exception {
        Team team = team();
        Person person = person("urn");
        membership(Role.ADMIN, team, person);

        subject.membershipRequired(team, person);
    }

    @Test(expected = IllegalInviteException.class)
    public void membershipRequiredException() throws Exception {
        Team team = team();
        Person person = person("urn");
        subject.membershipRequired(team, person);
    }

    @Test(expected = NotAllowedException.class)
    public void mustBeTeamAdminOrManagerNoMember() throws UnsupportedEncodingException {
        Invitation invitation = invitation(false, false);
        invitation.addInvitationMessage(person("urn"), "Please join");
        subject.mustBeTeamAdminOrManager(invitation, new FederatedUser(person("urn"), "urn:collab:group:dev.surfteams.nl:"));
    }

    @Test(expected = NotAllowedException.class)
    public void mustBeTeamAdminOrManager() throws UnsupportedEncodingException {
        Invitation invitation = invitation(false, false);
        FederatedUser federatedUser = new FederatedUser(person("urn"), "urn:collab:group:dev.surfteams.nl:");
        membership(Role.MEMBER, invitation.getTeam(), federatedUser.getPerson());
        invitation.addInvitationMessage(person("urn"), "Please join");

        subject.mustBeTeamAdminOrManager(invitation, federatedUser);
    }

    @Test(expected = IllegalInviteException.class)
    public void determineFutureRoleNoMembership() throws Exception {
        subject.determineFutureRole(team(), person(), Role.ADMIN);
    }

    @Test
    public void determineFutureRoleManager() throws Exception {
        doDetermineFutureRole(Role.MANAGER, Role.MEMBER);
    }

    @Test
    public void determineFutureRoleAdmin() throws Exception {
        doDetermineFutureRole(Role.ADMIN, Role.ADMIN);
    }

    @Test(expected = IllegalInviteException.class)
    public void determineFutureRoleMember() throws Exception {
        doDetermineFutureRole(Role.MEMBER, Role.ADMIN);
    }

    private void doDetermineFutureRole(Role role, Role intendedRole) {
        Team team = team();
        Person person = person();
        new Membership(role, team, person);
        assertEquals(intendedRole, subject.determineFutureRole(team, person, Role.ADMIN));
    }

    private Invitation invitation(boolean accepted, boolean declined) throws UnsupportedEncodingException {
        Invitation invitation = new Invitation(team(), "jdoe@example.com", Role.ADMIN, Language.Dutch);
        ReflectionTestUtils.setField(invitation, "accepted", accepted);
        ReflectionTestUtils.setField(invitation, "declined", declined);
        return invitation;
    }

}