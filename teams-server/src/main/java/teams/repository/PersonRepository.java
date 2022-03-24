package teams.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import teams.domain.Person;

import javax.persistence.OptimisticLockException;
import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends CrudRepository<Person, Long> {

    Optional<Person> findByUrnIgnoreCase(String urn);

    List<Person> findFirst10ByNameContainingOrEmailContainingAllIgnoreCase(String name, String email);

    @Transactional(noRollbackFor = OptimisticLockException.class)
    @Modifying
    @Query(value = "DELETE FROM persons WHERE persons.last_login_date < (NOW() - INTERVAL :retentionDays DAY) " +
            "AND NOT EXISTS (SELECT * FROM memberships WHERE persons.id = memberships.person_id) " +
            "AND NOT EXISTS (SELECT * FROM invitation_message WHERE persons.id = invitation_message.person_id) " +
            "AND persons.urn NOT IN :urns ",
            nativeQuery = true)
    int deleteOrphanPersons(@Param("retentionDays") long retentionDays, @Param("urns") List<String> urns);

}
