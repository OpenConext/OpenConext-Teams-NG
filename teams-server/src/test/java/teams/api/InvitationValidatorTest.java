package teams.api;

import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;
import teams.Seed;
import teams.domain.FederatedUser;
import teams.domain.Invitation;
import teams.domain.Language;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalInviteException;
import teams.exception.InvitationAlreadyAcceptedException;
import teams.exception.InvitationAlreadyDeclinedException;
import teams.exception.InvitationExpiredException;
import teams.exception.NotAllowedException;
import teams.exception.ResourceNotFoundException;

import java.io.UnsupportedEncodingException;

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

    @Test(expected = ResourceNotFoundException.class)
    public void assertNotNull() {
        subject.assertNotNull(null, 1L);
    }

    @Test(expected = NotAllowedException.class)
    public void mustBeTeamAdminOrManagerNoMember() throws UnsupportedEncodingException {
        Invitation invitation = invitation(false, false);
        invitation.addInvitationMessage(person("urn"), "Please join");
        subject.mustBeTeamAdminOrManager(invitation, new FederatedUser(person("urn")));
    }

    @Test(expected = NotAllowedException.class)
    public void mustBeTeamAdminOrManager() throws UnsupportedEncodingException {
        Invitation invitation = invitation(false, false);
        FederatedUser federatedUser = new FederatedUser(person("urn"));
        membership(Role.MEMBER, invitation.getTeam(), federatedUser.getPerson());
        invitation.addInvitationMessage(person("urn"), "Please join");

        subject.mustBeTeamAdminOrManager(invitation, federatedUser);
    }

    private Invitation invitation(boolean accepted, boolean declined) throws UnsupportedEncodingException {
        Invitation invitation = new Invitation(team(), "jdoe@example.com", Role.ADMIN, Language.Dutch);
        ReflectionTestUtils.setField(invitation, "accepted", accepted);
        ReflectionTestUtils.setField(invitation, "declined", declined);
        return invitation;
    }

}