package teams.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import teams.domain.Membership;

import javax.persistence.OptimisticLockException;
import java.util.Optional;
@Repository
public interface MembershipRepository extends CrudRepository<Membership, Long> {

    Optional<Membership> findByUrnTeamAndUrnPerson(String teamUrn, String personUrn);

    @Transactional(noRollbackFor = OptimisticLockException.class)
    @Modifying
    @Query(value = "DELETE FROM memberships WHERE expiry_date is not null and expiry_date < (NOW() - INTERVAL :retentionDays DAY)", nativeQuery = true)
    int deleteExpiredMemberships(@Param("retentionDays") long retentionDays);


}
