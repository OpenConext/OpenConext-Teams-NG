package teams.domain;

import org.junit.Test;

import java.io.UnsupportedEncodingException;

import static org.junit.Assert.*;

public class InvitationTest {

    @Test
    public void invitationHash() throws UnsupportedEncodingException {
        assertTrue(new Invitation(team(), "email", Role.ADMIN).getInvitationHash().length() > 256);
    }

    private Team team() {
        return new Team("urn", "name", "description", true);
    }

}