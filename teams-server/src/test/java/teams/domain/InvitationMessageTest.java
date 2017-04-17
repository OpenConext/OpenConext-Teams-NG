package teams.domain;

import org.junit.Test;
import teams.Seed;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static teams.domain.Language.Dutch;
import static teams.domain.Role.ADMIN;

public class InvitationMessageTest implements Seed {

    @Test
    public void isContainsMessage() throws Exception {
        InvitationMessage invitationMessage = new InvitationMessage(
            new Invitation(team(), "email", ADMIN, Dutch), person("urn"), "  ");

        assertFalse(invitationMessage.isContainsMessage());
        assertEquals("", invitationMessage.getHtmlMessage());
    }

    @Test
    public void getHtmlMessage() throws Exception {
        InvitationMessage invitationMessage = new InvitationMessage(
            new Invitation(team(), "email", ADMIN, Dutch), person("urn"), "hoi\nnewLine");

        assertTrue(invitationMessage.isContainsMessage());
        assertEquals("hoi<br/>newLine", invitationMessage.getHtmlMessage());
    }

}