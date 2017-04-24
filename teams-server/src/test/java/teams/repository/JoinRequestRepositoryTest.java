package teams.repository;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import teams.AbstractApplicationTest;
import teams.domain.JoinRequest;
import teams.domain.Person;
import teams.domain.Team;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class JoinRequestRepositoryTest extends AbstractApplicationTest {

    @Autowired
    private JoinRequestRepository joinRequestRepository;

    @Test
    public void findByPerson() throws Exception {
        Person person = personRepository.findByUrn("urn:collab:person:example.com:john.doe").get();
        List<JoinRequest> joinRequests = joinRequestRepository.findByPerson(person);
        assertEquals(1, joinRequests.size());
    }

    @Test
    public void findByTeam() throws Exception {
        Team team = teamRepository.findByUrn("nl:surfnet:diensten:riders").get();
        List<JoinRequest> joinRequests = joinRequestRepository.findByTeam(team);
        assertEquals(1, joinRequests.size());
    }

    @Test
    public void findByTeamIdIn() throws Exception {
        List<JoinRequest> joinRequests = joinRequestRepository.findByTeamIdIn(Arrays.asList(1L, 2L, 3L));
        assertEquals(1 ,joinRequests.size());
    }

}