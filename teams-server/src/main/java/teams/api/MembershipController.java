package teams.api;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.MembershipValidator;
import teams.domain.*;

import java.util.Collections;
import java.util.Map;


@RestController
public class MembershipController extends ApiController implements MembershipValidator {

    @GetMapping("api/teams/memberships/{teamId}")
    public Map<String, Role> membership(@PathVariable("teamId") Long teamId, FederatedUser federatedUser) {
        Membership membership = membership(teamById(teamId, false), federatedUser.getUrn());
        return Collections.singletonMap("role", membership.getRole());
    }

    @PutMapping("api/teams/memberships")
    public Membership changeMembership(@Validated @RequestBody MembershipProperties membershipProperties, FederatedUser federatedUser) {
        Membership membership = membershipRepository.findOne(membershipProperties.getId());
        assertNotNull(Membership.class.getSimpleName(),membership, membershipProperties.getId());
        Team team = membership.getTeam();
        Person person = membership.getPerson();

        Role roleOfLoggedInPerson = membership(team, federatedUser.getUrn()).getRole();
        Role futureRole = membershipProperties.getRole();

        membersCanNotChangeRoles(roleOfLoggedInPerson);
        canNotUpgradeToMoreImportantThenYourself(roleOfLoggedInPerson, futureRole);
        oneAdminIsRequired(team, person, futureRole);

        log.info("Changing current {} membership of {} in team {} to {} by {}",
                membership.getRole(), person.getUrn(), team.getUrn(), futureRole, federatedUser.getUrn());

        membership.setRole(futureRole);
        membershipRepository.save(membership);

        log.info("Changed membership for team {} and person {} from {} to {}",
                team.getUrn(), person.getUrn(), membership.getRole(), futureRole);

        return membership;
    }


    @DeleteMapping("api/teams/memberships/{id}")
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

        log.info("Deleted current {} membership of {} in team {} by {}",
                membership.getRole(), person.getUrn(), team.getUrn(), federatedUser.getUrn());
    }
}
