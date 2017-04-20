package teams.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import teams.domain.ExternalTeam;

import java.util.List;

@Repository
public interface ExternalTeamRepository extends CrudRepository<ExternalTeam, Long> {

    List<ExternalTeam> findByIdentifierIn(List<String> identifiers);

    List<ExternalTeam> findByTeamsUrn(String urn);

}
