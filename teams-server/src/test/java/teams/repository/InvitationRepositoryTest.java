package teams.repository;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.*;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class InvitationRepositoryTest extends AbstractApplicationTest {

    @Test
    public void findFirstByInvitationHash() throws Exception {
        Invitation invitation = invitationRepository.findFirstByInvitationHash("secret").get();
        assertEquals("secret", invitation.getInvitationHash());
    }

    @Test
    public void countInvitationsByTeamId() throws Exception {
        List<Object[]> results = invitationRepository.countInvitationsByTeamId(Arrays.asList(1L, 2L, 3L));

        Object[] r1 = results.get(0);
        assertEquals(1L, Long.class.cast(r1[0]).longValue());
        assertEquals(1L, Long.class.cast(r1[1]).longValue());

        Object[] r2 = results.get(1);
        assertEquals(2L, Long.class.cast(r2[0]).longValue());
        assertEquals(1L, Long.class.cast(r2[1]).longValue());
    }

    @Test
    public void deleteOlderThenExpiryDays() throws Exception {
        Invitation invitation = new Invitation(teamRepository.findOne(1L), "test@test.org", Role.ADMIN, Language.Dutch);
        invitation.addInvitationMessage(personRepository.findOne(1L), "Please join");
        invitationRepository.save(invitation);

        int count = invitationRepository.deleteExpiredInvitations(System.currentTimeMillis() + 3600 * 1000);
        assertEquals(1, count);
    }

}