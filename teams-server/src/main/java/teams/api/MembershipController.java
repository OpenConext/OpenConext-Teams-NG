package teams.api;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.MembershipValidator;
import teams.domain.*;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;


@RestController
public class MembershipController extends ApiController implements MembershipValidator {

    @GetMapping("api/teams/membership/{teamId}")
    public Map<String, Role> membership(@PathVariable("teamId") Long teamId, FederatedUser federatedUser) {
        Membership membership = membership(teamById(teamId), federatedUser.getUrn());
        return Collections.singletonMap("role", membership.getRole());
    }

    @PutMapping("api/teams/membership")
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

        LOG.info("Changed membership for team {} and person {} from {} to {}",
                team.getUrn(), person.getUrn(), membership.getRole(), futureRole);
    }


    @DeleteMapping("api/teams/membership/{id}")
    public void deleteMembership(@PathVariable("id") Long id, FederatedUser federatedUser) {
        Membership membership = membershipRepository.findOne(id);

        assertNotNull(Membership.class.getSimpleName(), membership, id);

        Team team = membership.getTeam();
        Person person = membership.getPerson();

        Role roleOfLoggedInPerson = membership(team, federatedUser.getUrn()).getRole();

        onlyAdminsCanRemoveOthers(roleOfLoggedInPerson, person, federatedUser);
        oneAdminIsRequired(team, person, Role.MEMBER);

        //http://stackoverflow.com/a/16901857
        team.getMemberships().remove(membership);
        membershipRepository.delete(membership);

        LOG.info("Deleted current {} membership of {} in team {} by {}",
                membership.getRole(), person.getUrn(), team.getUrn(), federatedUser.getUrn());
    }
}
