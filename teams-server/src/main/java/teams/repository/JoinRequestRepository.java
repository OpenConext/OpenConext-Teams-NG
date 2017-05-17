package teams.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import teams.domain.JoinRequest;
import teams.domain.Person;

import java.util.List;

@Repository
public interface JoinRequestRepository extends CrudRepository<JoinRequest, Long> {

    @EntityGraph(value = "findByPerson", type = EntityGraph.EntityGraphType.LOAD,
            attributePaths = "team")
    List<JoinRequest> findByPerson(Person person);

    @Query(value = "select i.team.id, count(i.id) from teams.domain.JoinRequest i where i.team.id in :teamIds group by i.team")
    List<Object[]> countJoinRequestsByTeamId(@Param("teamIds") List<Long> teamIds);

}
