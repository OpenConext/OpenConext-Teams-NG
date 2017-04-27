package teams.repository;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.Person;

import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;

public class PersonRepositoryTest extends AbstractApplicationTest {

    @Test
    public void findByUrn() throws Exception {
        Optional<Person> personOptional = personRepository.findByUrn("urn:collab:person:surfnet.nl:jdoe");
        assertEquals("John Doe", personOptional.get().getName());
    }

    @Test
    public void findByNameStartingWithIgnoreCase() throws Exception {
        List<Person> persons = personRepository.findFirst10ByNameStartingWithOrEmailStartingWithAllIgnoreCase("JOHN", "JOHN");
        assertEquals(2, persons.size());
    }

    @Test
    public void findByEmailStartingWithIgnoreCase() throws Exception {
        List<Person> persons = personRepository.findFirst10ByNameStartingWithOrEmailStartingWithAllIgnoreCase("RONA", "RONA");
        assertEquals(1, persons.size());
    }
}
