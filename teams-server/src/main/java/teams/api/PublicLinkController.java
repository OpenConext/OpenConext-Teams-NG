package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import teams.api.validations.JoinRequestValidator;
import teams.api.validations.TeamValidator;
import teams.domain.*;
import teams.exception.ResourceNotFoundException;
import teams.repository.TeamRepository;

import javax.mail.MessagingException;
import java.io.IOException;

@RestController
public class PublicLinkController implements JoinRequestValidator, TeamValidator {

    @Autowired
    private TeamRepository teamRepository;

    @GetMapping("api/teams/public-links/{key}")
    public PublicLink publicLinkInfo(@PathVariable("publicLink") String publicLink, FederatedUser federatedUser) throws IOException, MessagingException {
        Team team = teamRepository.findByPublicLink(publicLink).orElseThrow(() ->
                new ResourceNotFoundException(String.format("PublicLink %s not found", publicLink))
        );
        return new PublicLink(team, federatedUser);
    }

    @PutMapping("api/teams/public-links/{key}")
    public Object accept(@PathVariable("publicLink") String publicLink, FederatedUser federatedUser) throws IOException, MessagingException {
        Person person = federatedUser.getPerson();
        Team team = teamRepository.findByPublicLink(publicLink).orElseThrow(() ->
                new ResourceNotFoundException(String.format("PublicLink %s not found", publicLink))
        );

        membershipNotAllowed(team, person);

        new Membership(Role.MEMBER, team, person, null);

        return lazyLoadTeam(teamRepository.save(team), Role.MEMBER, federatedUser);
    }

}
