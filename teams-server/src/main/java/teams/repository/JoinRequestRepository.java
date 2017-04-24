package teams.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import teams.domain.JoinRequest;
import teams.domain.Person;
import teams.domain.Team;

import java.util.List;

@Repository
public interface JoinRequestRepository extends CrudRepository<JoinRequest, Long> {

    List<JoinRequest> findByPerson(Person person);

    List<JoinRequest> findByTeam(Team team);

    List<JoinRequest> findByTeamIdIn(List<Long> ids);
}
