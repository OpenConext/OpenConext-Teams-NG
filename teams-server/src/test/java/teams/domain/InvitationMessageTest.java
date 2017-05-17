package teams.domain;

import org.junit.Test;
import teams.Seed;

import static org.junit.Assert.*;

public class InvitationMessageTest implements Seed {

    @Test
    public void isContainsMessage() throws Exception {
        InvitationMessage invitationMessage = invitationMessage("  ");

        assertFalse(invitationMessage.isContainsMessage());
        assertEquals("", invitationMessage.getHtmlMessage());
    }

    @Test
    public void getHtmlMessage() throws Exception {
        InvitationMessage invitationMessage = invitationMessage("hoi\nnewLine");

        assertTrue(invitationMessage.isContainsMessage());
        assertEquals("hoi<br/>newLine", invitationMessage.getHtmlMessage());
    }

}