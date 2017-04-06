package teams.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import teams.domain.Invitation;
import teams.domain.Person;
import teams.domain.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends PagingAndSortingRepository<Invitation, Long> {

    List<Invitation> findByInvitationMessagesPerson(Person person);

    List<Invitation> findByTeam(Team team);

    Optional<Invitation> findFirstByInvitationHash(String invitationHash);
}
