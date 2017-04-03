package teams.repository;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.ExternalTeam;

import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class ExternalTeamRepositoryTest extends AbstractApplicationTest {

    @Test
    public void findByIdentifierIn() throws Exception {
        List<ExternalTeam> externalTeams = externalTeamRepository.findByIdentifierIn(Arrays.asList("urn:collab:group:example.org:name1", "urn:collab:group:example.org:name2"));
        assertEquals(2, externalTeams.size());
    }

    @Test
    public void findByTeamsUrnIn() throws Exception {
        List<ExternalTeam> externalTeams = externalTeamRepository.findByTeamsUrn("nl:surfnet:diensten:riders");
        assertEquals(2, externalTeams.size());
    }
}