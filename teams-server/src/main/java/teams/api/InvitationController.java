package teams.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.FederatedUser;

@RestController
public class InvitationController {

    @GetMapping("api/teams/invitations")
    public void invitation(FederatedUser federatedUser) {

    }

}
