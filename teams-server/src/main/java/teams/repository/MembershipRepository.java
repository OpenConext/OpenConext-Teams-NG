package teams.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import teams.domain.Membership;


import java.util.Optional;

@Repository
public interface MembershipRepository extends PagingAndSortingRepository<Membership, Long> {

  Optional<Membership> findByUrnTeamAndUrnPerson(String teamUrn, String personUrn);
}
