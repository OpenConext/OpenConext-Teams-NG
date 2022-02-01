package teams.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import teams.domain.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends CrudRepository<Team, Long> {

    @EntityGraph(value = "findByUrn", type = EntityGraph.EntityGraphType.LOAD, attributePaths = "memberships")
    Optional<Team> findByUrn(String urn);

    Optional<Team> findByUrnOrderById(String urn);

    @EntityGraph(value = "findByPublicLinkAndPublicLinkDisabled", type = EntityGraph.EntityGraphType.LOAD, attributePaths = "memberships")
    Optional<Team> findByPublicLinkAndPublicLinkDisabled(String publicLink, boolean publicLinkDisabled);

    @EntityGraph(value = "findByMembershipsUrnPersonIgnoreCase", type = EntityGraph.EntityGraphType.LOAD, attributePaths = "memberships")
    List<Team> findByMembershipsUrnPersonIgnoreCase(String personUrn);

    @Query(value = "select distinct(teams.name), teams.id, teams.description, (select memberships.role from memberships " +
            "where memberships.person_id = ?1 and memberships.team_id = teams.id) as role " +
            "from teams as teams left outer join memberships on memberships.team_id = teams.id " +
            "where upper(name) like ?2 and (teams.viewable = 1 or memberships.person_id = ?3) limit 100", nativeQuery = true)
    List<Object[]> autocomplete(Long personId, String query, Long memberId);

    @Query(value = "select distinct(teams.name), teams.id, teams.description, (select memberships.role from memberships " +
            "where memberships.person_id = ?1 and memberships.team_id = teams.id) as role " +
            "from teams as teams left outer join memberships on memberships.team_id = teams.id " +
            "where upper(name) like ?2 limit 100", nativeQuery = true)
    List<Object[]> autocompleteSuperAdmin(Long personId, String query);

    @Query(value = "select distinct(teams.urn) from teams where urn = ? LIMIT 1", nativeQuery = true)
    List<Object> existsByUrn(String urn);

    @EntityGraph(value = "findById", type = EntityGraph.EntityGraphType.LOAD, attributePaths = "memberships")
    Optional<Team> findById(Long id);

    @EntityGraph(value = "findFirstById", type = EntityGraph.EntityGraphType.LOAD,
            attributePaths = {"memberships.person"})
    Team findFirstById(Long id);

    @Query(value = "select t.id from teams.domain.Team t where t.urn = :urn")
    Optional<Long> findIdByUrn(@Param("urn") String urn);

}
