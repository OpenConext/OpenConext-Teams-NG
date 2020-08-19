package teams.repository;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import teams.AbstractApplicationTest;
import teams.domain.Team;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceUnitUtil;
import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;
import static org.junit.Assert.*;

public class TeamRepositoryTest extends AbstractApplicationTest {

    @Autowired
    private EntityManager entityManager;

    private PersistenceUnitUtil persistenceUnitUtil;

    @Before
    public void before() {
        this.persistenceUnitUtil = entityManager.getEntityManagerFactory().getPersistenceUnitUtil();
    }

    @Test
    public void findByUrn() throws Exception {
        Team team = teamRepository.findByUrn("demo:openconext:org:giants").get();

        assertTrue(areMembershipLoaded(team));
        assertEquals("giants", team.getName());
        assertEquals("Why did I create this team", team.getPersonalNote());
    }

    @Test
    public void findByUrnOrderById() throws Exception {
        Team team = teamRepository.findByUrnOrderById("demo:openconext:org:giants").get();
        assertFalse(areMembershipLoaded(team));
    }

    @Test
    public void findByMembershipsPersonUrn() {
        List<Team> teams = teamRepository.findByMembershipsUrnPersonIgnoreCase(
                "urn:collab:person:surfnet.nl:jdoe");
        assertEquals(3, teams.size());
    }

    @Test
    public void findByMembershipsPersonUrnIgnoreCase() throws Exception {
        List<Team> teams = teamRepository.findByMembershipsUrnPersonIgnoreCase(
                "urn:COLLAB:person:SURFNET.nl:JDOE");
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
    public void autoCompleteIncludeNonViewable() {
        List<Object[]> result = teamRepository.autocompleteSuperAdmin(0L, "%PRIVAT%");
        assertEquals(1, result.size());

        result = teamRepository.autocomplete(0L, "%PRIVAT%", 0L);
        assertEquals(0, result.size());
    }

    @Test
    public void existsByUrn() throws Exception {
        List<Object> urns = teamRepository.existsByUrn("demo:openconext:org:giants");
        assertEquals(1, urns.size());
    }

    @Test
    public void findByIdNoPersonsFetched() {
        Team team = teamRepository.findById(1L);
        assertTrue(areMembershipLoaded(team));
        assertFalse(arePersonsLoaded(team));
    }

    @Test
    public void findByIdPersonsFetched() {
        Team team = teamRepository.findFirstById(1L);
        assertTrue(areMembershipLoaded(team));
        assertTrue(arePersonsLoaded(team));
    }

    @Test
    public void findIdByUrn() {
        Long idByUrn = teamRepository.findIdByUrn("demo:openconext:org:wolves").get();
        assertEquals(5L, idByUrn.longValue());

        Optional<Long> nope = teamRepository.findIdByUrn("nope");
        assertFalse(nope.isPresent());
    }

    private boolean areMembershipLoaded(Team team) {
        return this.persistenceUnitUtil.isLoaded(team, "memberships");
    }

    private boolean arePersonsLoaded(Team team) {
        return areMembershipLoaded(team) &&
                team.getMemberships().stream()
                        .allMatch(membership -> persistenceUnitUtil.isLoaded(membership, "person"));
    }
}
