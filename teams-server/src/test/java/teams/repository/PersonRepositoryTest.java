package teams.repository;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;

public class PersonRepositoryTest extends AbstractApplicationTest {

    @Test
    public void findByUrn() throws Exception {
        Optional<Person> personOptional = personRepository.findByUrnIgnoreCase("URN:collab:PERSON:surfnet.nl:JDOE");
        assertEquals("John Doe", personOptional.get().getName());
    }

    @Test
    public void findByNameContainingIgnoreCase() throws Exception {
        List<Person> persons = personRepository.findFirst10ByNameContainingOrEmailContainingAllIgnoreCase("OHN", "OHN");
        assertEquals(2, persons.size());
    }

    @Test
    public void findByEmailContainingIgnoreCase() throws Exception {
        List<Person> persons = personRepository.findFirst10ByNameContainingOrEmailContainingAllIgnoreCase("EXA", "EXA");
        assertEquals(5, persons.size());
    }

    @Test
    public void deleteExpiredMemberships() throws Exception {
        Person person = personRepository.findById(6L).get();
        Instant thePast = Instant.now().minus(15, ChronoUnit.DAYS);
        person.setLastLoginDate(thePast);
        personRepository.save(person);

        int deleted = personRepository.deleteOrphanPersons(1L);
        assertEquals(1, deleted);
    }
}
