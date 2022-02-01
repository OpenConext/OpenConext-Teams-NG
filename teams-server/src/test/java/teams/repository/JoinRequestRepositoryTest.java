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
        Person person = personRepository.findByUrnIgnoreCase("urn:collab:person:example.com:john.doe").get();
        List<JoinRequest> joinRequests = joinRequestRepository.findByPerson(person);
        assertEquals(1, joinRequests.size());
    }

    @Test
    public void countInvitationsByTeamId() throws Exception {
        List<Object[]> results = joinRequestRepository.countJoinRequestsByTeamId(Arrays.asList(1L, 2L, 3L));

        Object[] r1 = results.get(0);
        assertEquals(1L, Long.class.cast(r1[0]).longValue());
        assertEquals(2L, Long.class.cast(r1[1]).longValue());
    }

    @Test
    public void findByPersonAndTeam() {
        Team team = teamRepository.findById(1L).get();
        Person person = personRepository.findById(6L).get();
        List<JoinRequest> joinRequests = joinRequestRepository.findByPersonAndTeam(person, team);
        assertEquals(1, joinRequests.size());
    }

}