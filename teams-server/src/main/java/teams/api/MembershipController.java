package teams.api;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.MembershipValidator;
import teams.domain.*;
import teams.exception.ResourceNotFoundException;

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
        Long id = membershipProperties.getId();
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found:" + id));
        assertNotNull(Membership.class.getSimpleName(), membership, id);
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

    @PutMapping("api/teams/memberships/expiry-date")
    public Membership changeExpiryDate(@Validated @RequestBody MembershipExpiryDate membershipExpiryDate, FederatedUser federatedUser) {
        Long id = membershipExpiryDate.getId();
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found:" + id));
        assertNotNull(Membership.class.getSimpleName(), membership, id);
        Team team = membership.getTeam();
        Person person = membership.getPerson();

        Role roleOfLoggedInPerson = membership(team, federatedUser.getUrn()).getRole();
        roleForChangingExpiryDate(roleOfLoggedInPerson);

        membership.setExpiryDate(membershipExpiryDate.getExpiryDate());
        membershipRepository.save(membership);

        log.info("Changed membership expiry date {} of {} in team {} to {} by {}",
                membership.getExpiryDate(), person.getUrn(), team.getUrn(), membershipExpiryDate.getExpiryDate(), federatedUser.getUrn());

        return membership;
    }

    @DeleteMapping("api/teams/memberships/{id}")
    public void deleteMembership(@PathVariable("id") Long id, FederatedUser federatedUser) {
        Membership membership = membershipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membership not found:" + id));

        assertNotNull(Membership.class.getSimpleName(), membership, id);

        Team team = membership.getTeam();
        Person person = membership.getPerson();

        Role roleOfLoggedInPerson = membership(team, federatedUser.getUrn()).getRole();
        Role roleOfMembershipToBeDeleted = membership(team, person.getUrn()).getRole();

        onlyAdminsAndManagersCanRemoveMemberships(roleOfLoggedInPerson, person, federatedUser, roleOfMembershipToBeDeleted);
        oneAdminIsRequired(team, person, Role.MEMBER);

        //http://stackoverflow.com/a/16901857
        team.getMemberships().remove(membership);
        membershipRepository.delete(membership);

        log.info("Deleted current {} membership of {} in team {} by {}",
                membership.getRole(), person.getUrn(), team.getUrn(), federatedUser.getUrn());
    }
}
