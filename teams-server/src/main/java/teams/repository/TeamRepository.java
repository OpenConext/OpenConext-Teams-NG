package teams.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import teams.domain.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends PagingAndSortingRepository<Team, Long> {

    @EntityGraph(value = "Team.memberships", type = EntityGraph.EntityGraphType.LOAD)
    Optional<Team> findByUrn(String urn);

    @EntityGraph(value = "Team.memberships", type = EntityGraph.EntityGraphType.LOAD)
    Page<Team> findByMembershipsUrnPersonOrderByNameAsc(String personUrn, Pageable pageable);

    @EntityGraph(value = "Team.memberships", type = EntityGraph.EntityGraphType.LOAD)
    Page<Team> findByNameContainingIgnoreCaseAndMembershipsUrnPersonOrderByNameAsc(String name, String personUrn, Pageable pageable);

    @Query(value = "select distinct(name), urn, (select memberships.role where memberships.urn_person = ?1) as role " +
        "from teams as teams left outer join memberships on memberships.team_id = teams.id " +
        "where upper(name) like ?2 and (teams.viewable = 1 or memberships.urn_person = ?3)", nativeQuery = true)
    List<Object[]> autocomplete(String personUrn, String query, String memberUrn);
}
