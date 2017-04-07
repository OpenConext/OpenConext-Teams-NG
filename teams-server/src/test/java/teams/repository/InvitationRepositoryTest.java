package teams.repository;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.Invitation;
import teams.domain.Person;
import teams.domain.Team;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

public class InvitationRepositoryTest extends AbstractApplicationTest {

    @Test
    public void findByInvitationMessagesPerson() throws Exception {
        Person person = personRepository.findByUrn("urn:collab:person:surfnet.nl:rdoe").get();

        List<Invitation> invitations = invitationRepository.findByInvitationMessagesPerson(person);
        assertEquals(1, invitations.size());
        assertFalse(invitations.get(0).getLatestInvitationMessage().getInvitation().hasExpired());
    }

    @Test
    public void findByTeam() throws Exception {
        Team team = teamRepository.findByUrn("nl:surfnet:diensten:riders").get();

        List<Invitation> invitations = invitationRepository.findByTeam(team);
        assertEquals(1, invitations.size());
    }

    @Test
    public void findFirstByInvitationHash() throws Exception {
        Invitation invitation = invitationRepository.findFirstByInvitationHash("secret").get();
        assertEquals("secret", invitation.getInvitationHash());
    }

}