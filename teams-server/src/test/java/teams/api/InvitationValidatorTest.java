package teams.api;

import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;
import teams.Seed;
import teams.domain.Invitation;
import teams.domain.Language;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalInviteException;
import teams.exception.InvitationAlreadyAcceptedException;
import teams.exception.InvitationAlreadyDeclinedException;
import teams.exception.InvitationExpiredException;

import java.io.UnsupportedEncodingException;

public class InvitationValidatorTest implements Seed {

    private InvitationValidator subject = new InvitationController();

    @Test(expected = InvitationExpiredException.class)
    public void invitationExpired() throws Exception {
        Invitation invitation = invitation(false, false);
        ReflectionTestUtils.setField(invitation, "timestamp", 1000);
        subject.validateInvitation(invitation);
    }

    @Test(expected = InvitationAlreadyAcceptedException.class)
    public void invitationAlreadyAccepted() throws Exception {
        subject.validateInvitation(invitation(true, false));
    }

    @Test(expected = InvitationAlreadyDeclinedException.class)
    public void invitationAlreadyDeclined() throws Exception {
        subject.validateInvitation(invitation(false, true));
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

    private Invitation invitation(boolean accepted, boolean declined) throws UnsupportedEncodingException {
        Invitation invitation = new Invitation(team(), "jdoe@example.com", Role.ADMIN, Language.Dutch);
        ReflectionTestUtils.setField(invitation, "accepted", accepted);
        ReflectionTestUtils.setField(invitation, "declined", declined);
        return invitation;
    }

}