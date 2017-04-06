package teams.domain;

import org.junit.Test;
import teams.Seed;
import teams.exception.ResourceNotFoundException;

import java.io.UnsupportedEncodingException;

import static org.junit.Assert.assertTrue;
import static teams.domain.Language.Dutch;
import static teams.domain.Role.ADMIN;

public class InvitationTest implements Seed{

    @Test
    public void invitationHash() throws UnsupportedEncodingException {
        String invitationHash = invitation().getInvitationHash();
        int length = invitationHash.length();
        assertTrue(length > 170 && length < 200);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void getLatestInvitationMessage() throws UnsupportedEncodingException {
        invitation().getLatestInvitationMessage();
    }

    private Invitation invitation() throws UnsupportedEncodingException {
        return new Invitation(team(), "email", ADMIN, Dutch);
    }

}