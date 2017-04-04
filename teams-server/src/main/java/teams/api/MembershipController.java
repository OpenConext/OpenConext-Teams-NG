package teams.api;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.FederatedUser;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;


@RestController
public class MembershipController extends ApiController implements MembershipValidator{

    @PutMapping("api/teams/role")
    public void changeMembership(@Validated @RequestBody Membership membershipProperties, FederatedUser federatedUser) {
        Membership membership = membershipByUrns(membershipProperties.getUrnTeam(), membershipProperties.getUrnPerson());
        Team team = membership.getTeam();
        Person person = membership.getPerson();

        Role roleOfLoggedInPerson = membership(team, federatedUser.getUrn()).getRole();
        Role futureRole = membershipProperties.getRole();

        membersCanNotDoAnything(roleOfLoggedInPerson);
        canNotUpgradeToMoreImportantThenYourself(roleOfLoggedInPerson, futureRole);
        oneAdminIsRequired(team, person, futureRole);

        LOG.info("Changing current {} membership of {} in team {} to {} by {}",
            membership.getRole(), person.getUrn(), team.getUrn(), futureRole, federatedUser.getUrn());

        membership.setRole(futureRole);
        membershipRepository.save(membership);
    }
}
