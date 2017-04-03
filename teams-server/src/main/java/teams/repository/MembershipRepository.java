package teams.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import teams.domain.Membership;


import java.util.Optional;

public interface MembershipRepository extends PagingAndSortingRepository<Membership, Long> {

  Optional<Membership> findByUrnTeamAndUrnPerson(String teamUrn, String personUrn);
}
