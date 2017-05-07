package teams.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import teams.domain.Person;
import teams.domain.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends CrudRepository<Person, Long> {

    Optional<Person> findByUrnIgnoreCase(String urn);

    List<Person> findFirst10ByNameStartingWithOrEmailStartingWithAllIgnoreCase(String name, String email);

}
