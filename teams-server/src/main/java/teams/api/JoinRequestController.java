package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.FederatedUser;
import teams.domain.JoinRequest;
import teams.domain.Person;
import teams.domain.Team;
import teams.exception.IllegalJoinRequestException;
import teams.mail.MailBox;
import teams.repository.JoinRequestRepository;

@RestController
public class JoinRequestController extends ApiController {

    @Autowired
    private JoinRequestRepository joinRequestRepository;

    @Autowired
    private MailBox mailBox;

    @PostMapping("api/teams/join")
    public void join(@Validated @RequestBody JoinRequest joinRequestProperties, FederatedUser federatedUser) {
        Team team = teamByUrn(joinRequestProperties.getTeam().getUrn());
        Person person = personByUrn(federatedUser.getUrn());

        if (team.getMemberships().stream().anyMatch(membership -> membership.getUrnPerson().equals(person.getUrn()))) {
            throw new IllegalJoinRequestException(String.format("Person %s is already a member of team %s", person.getUrn(), team.getUrn()));
        }

        if (!team.isViewable()) {
            throw new IllegalJoinRequestException(String.format("Person %s can not join private team %s", person.getUrn(), team.getUrn()));
        }

        JoinRequest joinRequest = new JoinRequest(person, team, joinRequestProperties.getMessage());
        joinRequestRepository.save(joinRequest);

        mailBox.sendJoinRequestMail(joinRequest);
    }

}
