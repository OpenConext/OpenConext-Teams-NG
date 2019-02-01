package teams.repository;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.junit.Assert.assertEquals;

public class MembershipRepositoryTest extends AbstractApplicationTest {

    @Test
    public void findByTeamUrnAndPersonUrn() throws Exception {
        Optional<Membership> membershipOptional = membershipRepository.findByUrnTeamAndUrnPerson("demo:openconext:org:riders", "urn:collab:person:surfnet.nl:jdoe");
        assertEquals(Role.ADMIN, membershipOptional.get().getRole());
    }

    @Test
    public void deleteExpiredMemberships() throws Exception {
        Team team = teamRepository.findOne(1L);
        Person person = personRepository.findOne(6L);
        Instant thePast = Instant.now().minus(15, ChronoUnit.DAYS);
        membershipRepository.save(new Membership(Role.ADMIN, team, person, thePast, MembershipOrigin.INITIAL_ADMIN, "John Doe"));
        int deleted = membershipRepository.deleteExpiredMemberships(0L);
        assertEquals(1, deleted);
    }

}
