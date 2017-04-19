package teams.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import teams.domain.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends CrudRepository<Team, Long> {

    @EntityGraph(value = "Team.memberships", type = EntityGraph.EntityGraphType.LOAD)
    Optional<Team> findByUrn(String urn);

    @EntityGraph(value = "Team.memberships", type = EntityGraph.EntityGraphType.LOAD)
    List<Team> findByMembershipsUrnPersonOrderByNameAsc(String personUrn);

    @EntityGraph(value = "Team.memberships", type = EntityGraph.EntityGraphType.LOAD)
    Page<Team> findByNameContainingIgnoreCaseAndMembershipsUrnPersonOrderByNameAsc(String name, String personUrn, Pageable pageable);

    @Query(value = "select distinct(name), urn, (select memberships.role from memberships " +
            "where memberships.person_id = ?1 and memberships.team_id = teams.id) as role " +
            "from teams as teams left outer join memberships on memberships.team_id = teams.id " +
            "where upper(name) like ?2 and (teams.viewable = 1 or memberships.person_id = ?3)", nativeQuery = true)
    List<Object[]> autocomplete(Long personId, String query, Long memberId);
}
