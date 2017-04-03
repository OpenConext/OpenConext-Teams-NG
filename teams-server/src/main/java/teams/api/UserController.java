package teams.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.FederatedUser;

@RestController
public class UserController {

    @GetMapping("api/teams/users/me")
    public FederatedUser person(FederatedUser federatedUser) {
        return federatedUser;
    }

}
