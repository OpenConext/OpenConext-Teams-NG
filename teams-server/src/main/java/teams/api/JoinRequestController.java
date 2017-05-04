package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.JoinRequestValidator;
import teams.api.validations.MembershipValidator;
import teams.domain.*;
import teams.mail.MailBox;
import teams.repository.JoinRequestRepository;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.List;

@RestController
public class JoinRequestController extends ApiController implements MembershipValidator, JoinRequestValidator {

    @PostMapping("api/teams/join-requests")
    public JoinRequest join(@Validated @RequestBody ClientJoinRequest clientJoinRequest, FederatedUser federatedUser) throws MessagingException, IOException {
        Team team = teamById(clientJoinRequest.getTeamId(), true);
        Person person = federatedUser.getPerson();

        List<String> admins = admins(team);

        membershipNotAllowed(team, person);
        privateTeamDoesNotAllowMembers(team, person);

        JoinRequest joinRequest = new JoinRequest(person, team, clientJoinRequest.getMessage());
        joinRequestRepository.save(joinRequest);

        mailBox.sendJoinRequestMail(joinRequest, admins);

        LOG.info("Created joinRequest for team {} and person {}", team.getUrn(), person.getUrn());

        return joinRequest;
    }

    @DeleteMapping("api/teams/join-requests/{id}")
    public void delete(@PathVariable("id") Long id, FederatedUser federatedUser) {
        JoinRequest joinRequest = joinRequestRepository.findOne(id);
        assertNotNull(JoinRequest.class.getSimpleName(), joinRequest, id);

        validateJoinRequest(joinRequest, federatedUser);

        LOG.info("Deleted joinRequest for team {} and person {}", joinRequest.getTeam().getUrn(), federatedUser.getUrn());
        joinRequestRepository.delete(joinRequest);
    }

}
