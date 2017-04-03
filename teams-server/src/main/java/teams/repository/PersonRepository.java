package teams.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import teams.domain.Person;

import java.util.Optional;

@Repository
public interface PersonRepository extends PagingAndSortingRepository<Person, Long> {

    Optional<Person> findByUrn(String urn);

}
