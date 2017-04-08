package teams.repository;

import org.junit.Test;
import org.springframework.data.domain.PageRequest;
import teams.AbstractApplicationTest;
import teams.domain.Team;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TeamRepositoryTest extends AbstractApplicationTest {

    @Test
    public void findByUrn() throws Exception {
        Optional<Team> teamOptional = teamRepository.findByUrn("nl:surfnet:diensten:giants");
        assertEquals("giants", teamOptional.get().getName());
    }

    @Test
    public void findByMembershipsPersonUrn() throws Exception {
        List<Team> teams = teamRepository.findByMembershipsUrnPersonOrderByNameAsc(
            "urn:collab:person:surfnet.nl:jdoe", new PageRequest(0, 10)).getContent();
        assertEquals(3, teams.size());
    }

    @Test
    public void findByNameContainingIgnoreCaseAndMembershipsPersonUrnOrderByNameAsc() throws Exception {
        List<Team> teams = teamRepository.findByNameContainingIgnoreCaseAndMembershipsUrnPersonOrderByNameAsc(
            "ERS", "urn:collab:person:surfnet.nl:jdoe", new PageRequest(0, 10)).getContent();
        assertEquals(2, teams.size());
    }

    @Test
    public void autoComplete() {
        List<Object[]> result = teamRepository.autocomplete("%ERS%", "urn:collab:person:surfnet.nl:tdoe");
        assertEquals(2, result.size());

        List<String> teamNames = result.stream().map(s -> String.valueOf(s[0])).collect(toList());
        assertTrue(teamNames.contains("riders"));
        assertTrue(teamNames.contains("gliders"));
    }

}
