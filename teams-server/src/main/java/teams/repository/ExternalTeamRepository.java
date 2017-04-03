package teams.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import teams.domain.ExternalTeam;
import teams.domain.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExternalTeamRepository extends PagingAndSortingRepository<ExternalTeam, Long> {

    List<ExternalTeam> findByIdentifierIn(List<String> identifiers);

    List<ExternalTeam> findByTeamsUrn(String urn);

}
