package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.ClientJoinRequest;
import teams.domain.FederatedUser;
import teams.domain.JoinRequest;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalJoinRequestException;
import teams.mail.MailBox;
import teams.repository.JoinRequestRepository;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.List;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;

@RestController
public class JoinRequestController extends ApiController implements MembershipValidator {

    @Autowired
    private JoinRequestRepository joinRequestRepository;

    @Autowired
    private MailBox mailBox;

    @PostMapping("api/teams/join")
    public JoinRequest join(@Validated @RequestBody ClientJoinRequest clientJoinRequest, FederatedUser federatedUser) throws MessagingException, IOException {
        Team team = teamByUrn(clientJoinRequest.getTeamUrn());
        Person person = federatedUser.getPerson();

        List<String> admins = admins(team);

        membershipNotAllowed(team, person);
        privateTeamDoesNotAllowMembers(team, person);

        JoinRequest joinRequest = new JoinRequest(person, team, clientJoinRequest.getMessage());
        joinRequestRepository.save(joinRequest);

        mailBox.sendJoinRequestMail(joinRequest, admins);

        return joinRequest;
    }

}
