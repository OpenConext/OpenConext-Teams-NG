package teams.api;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.FederatedUser;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;


@RestController
public class MembershipController extends ApiController implements MembershipValidator {

    @PutMapping("api/teams/role")
    public void changeMembership(@Validated @RequestBody Membership membershipProperties, FederatedUser federatedUser) {
        Membership membership = membershipByUrns(membershipProperties.getUrnTeam(), membershipProperties.getUrnPerson());
        Team team = membership.getTeam();
        Person person = membership.getPerson();

        Role roleOfLoggedInPerson = membership(team, federatedUser.getUrn()).getRole();
        Role futureRole = membershipProperties.getRole();

        membersCanNotChangeRoles(roleOfLoggedInPerson);
        canNotUpgradeToMoreImportantThenYourself(roleOfLoggedInPerson, futureRole);
        oneAdminIsRequired(team, person, futureRole);

        LOG.info("Changing current {} membership of {} in team {} to {} by {}",
            membership.getRole(), person.getUrn(), team.getUrn(), futureRole, federatedUser.getUrn());

        membership.setRole(futureRole);
        membershipRepository.save(membership);
    }


    @DeleteMapping("api/teams/role")
    public void deleteMembership(@Validated @RequestBody Membership membershipProperties, FederatedUser federatedUser) {
        Membership membership = membershipByUrns(membershipProperties.getUrnTeam(), membershipProperties.getUrnPerson());
        Team team = membership.getTeam();
        Person person = membership.getPerson();

        Role roleOfLoggedInPerson = membership(team, federatedUser.getUrn()).getRole();

        membersCanNotRemoveOthers(roleOfLoggedInPerson, person, federatedUser);
        oneAdminIsRequired(team, person, Role.MEMBER);

        LOG.info("Deleting current {} membership of {} in team {} by {}",
            membership.getRole(), person.getUrn(), team.getUrn(), federatedUser.getUrn());

        //http://stackoverflow.com/a/16901857
        team.getMemberships().remove(membership);
        membershipRepository.delete(membership);
    }
}
