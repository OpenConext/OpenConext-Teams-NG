package teams.repository;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.Membership;
import teams.domain.Role;


import java.util.Optional;

import static org.junit.Assert.assertEquals;

public class MembershipRepositoryTest extends AbstractApplicationTest {

  @Test
  public void findByTeamUrnAndPersonUrn() throws Exception {
    Optional<Membership> membershipOptional = membershipRepository.findByUrnTeamAndUrnPerson("nl:surfnet:diensten:riders", "urn:collab:person:surfnet.nl:jdoe");
    assertEquals(Role.ADMIN, membershipOptional.get().getRole());
  }

}
