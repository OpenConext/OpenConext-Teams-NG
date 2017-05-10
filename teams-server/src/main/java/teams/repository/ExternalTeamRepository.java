package teams.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import teams.domain.ExternalTeam;

import java.util.List;

@Repository
public interface ExternalTeamRepository extends CrudRepository<ExternalTeam, Long> {

    List<ExternalTeam> findByIdentifierIn(List<String> identifiers);

    List<ExternalTeam> findByTeamsUrn(String urn);

    @Query(value = "select et.identifier, t.id, t.name from teams.domain.ExternalTeam et " +
            "join et.teams t where et.identifier in :externalTeamIds")
    List<Object[]> findTeamsByExternalTeamIdentifiers(@Param("externalTeamIds") List<String> externalTeamIds);

}
