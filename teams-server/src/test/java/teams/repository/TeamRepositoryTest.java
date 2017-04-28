package teams.repository;

import org.hibernate.Hibernate;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import teams.AbstractApplicationTest;
import teams.domain.Team;

import javax.persistence.EntityManager;
import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class TeamRepositoryTest extends AbstractApplicationTest {

    @Autowired
    private EntityManager entityManager;

    @Test
    public void findByUrn() throws Exception {
        Team team = teamRepository.findByUrn("nl:surfnet:diensten:giants").get();

        assertTrue(areMembershipLoaded(team));
        assertEquals("giants", team.getName());
        assertEquals("Why did I create this team", team.getPersonalNote());
    }

    @Test
    public void findByUrnOrderById() throws Exception {
        Team team = teamRepository.findByUrnOrderById("nl:surfnet:diensten:giants").get();
        assertFalse(areMembershipLoaded(team));
    }

    @Test
    public void findByMembershipsPersonUrn() throws Exception {
        List<Team> teams = teamRepository.findByMembershipsUrnPerson(
                "urn:collab:person:surfnet.nl:jdoe");
        assertEquals(3, teams.size());
    }

    @Test
    public void autoComplete() {
        List<Object[]> result = teamRepository.autocomplete(4L, "%ERS%", 4L);
        assertEquals(3, result.size());

        List<String> teamNames = result.stream().map(s -> s[0].toString()).collect(toList());
        assertTrue(teamNames.contains("riders"));
        assertTrue(teamNames.contains("gliders"));
        assertTrue(teamNames.contains("masters"));
    }

    @Test
    public void existsByUrn() throws Exception {
        List<Object> urns = teamRepository.existsByUrn("nl:surfnet:diensten:giants");
        assertEquals(1, urns.size());
    }

    private boolean areMembershipLoaded(Team team) {
        return entityManager.getEntityManagerFactory().getPersistenceUnitUtil().isLoaded(team, "memberships");
    }

}
