package teams.domain;

import org.junit.Test;
import teams.Seed;

import java.time.Instant;

import static org.junit.Assert.*;

public class InvitationInfoTest implements Seed {

    @Test
    public void getExpiryDate() {
        Instant now = Instant.now();
        InvitationInfo invitationInfo = getInvitationInfo(now);
        assertEquals(now.getEpochSecond(), invitationInfo.getExpiryDate().longValue());
    }

    @Test
    public void getExpiryDateDefault() {
        InvitationInfo invitationInfo = getInvitationInfo(null);
        assertNotNull(invitationInfo.getExpiryDate());
    }

    private InvitationInfo getInvitationInfo(Instant now) {
        Invitation invitation = new Invitation(team(), "mail@example.org", Role.ADMIN, Language.DUTCH, now, null);
        invitation.addInvitationMessage(person(), "Please join");
        return new InvitationInfo(
                invitation,
                federatedUser());
    }

}