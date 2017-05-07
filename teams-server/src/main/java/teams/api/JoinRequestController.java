package teams.api;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.JoinRequestValidator;
import teams.api.validations.MembershipValidator;
import teams.domain.*;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.List;

@RestController
public class JoinRequestController extends ApiController implements MembershipValidator, JoinRequestValidator {

    @GetMapping("api/teams/join-requests/{id}")
    public JoinRequest joinRequest(@PathVariable("id") Long id, FederatedUser federatedUser) {
        JoinRequest joinRequest = notNullGetJoinRequest(id, federatedUser);
        validateJoinRequest(joinRequest, federatedUser);
        return joinRequest;
    }

    @PostMapping("api/teams/join-requests")
    public JoinRequest join(@Validated @RequestBody ClientJoinRequest clientJoinRequest, FederatedUser federatedUser) throws MessagingException, IOException {
        Team team = teamById(clientJoinRequest.getTeamId(), true);
        Person person = federatedUser.getPerson();

        List<String> admins = admins(team);

        membershipNotAllowed(team, person);
        privateTeamDoesNotAllowMembers(team, person);

        JoinRequest joinRequest = new JoinRequest(person, team, clientJoinRequest.getMessage());
        joinRequestRepository.save(joinRequest);

        mailBox.sendJoinRequestMail(joinRequest, admins);

        LOG.info("Created joinRequest for team {} and person {}", team.getUrn(), person.getUrn());

        return joinRequest;
    }

    @PutMapping("api/teams/join-requests/approve/{id}")
    public JoinRequest approve(@PathVariable("id") Long id, FederatedUser federatedUser) throws MessagingException, IOException {
        JoinRequest joinRequest = notNullGetJoinRequestValidateMembership(id, federatedUser);

        Person person = joinRequest.getPerson();
        Team team = joinRequest.getTeam();

        membershipNotAllowed(team, person);

        Membership newMembership = new Membership(Role.MEMBER, team, person);
        membershipRepository.save(newMembership);

        mailBox.sendJoinRequestAccepted(joinRequest);
        joinRequestRepository.delete(joinRequest);

        LOG.info("Approved joinRequest for team {} and person {} by {}",
                team.getUrn(), person.getUrn(), federatedUser.getUrn());

        return joinRequest;
    }

    @PutMapping("api/teams/join-requests/reject/{id}")
    public JoinRequest reject(@PathVariable("id") Long id, FederatedUser federatedUser) throws MessagingException, IOException {
        JoinRequest joinRequest = notNullGetJoinRequestValidateMembership(id, federatedUser);

        mailBox.sendJoinRequestRejected(joinRequest);
        joinRequestRepository.delete(joinRequest);

        LOG.info("Rejected joinRequest for team {} and person {} by {}",
                joinRequest.getTeam().getUrn(), joinRequest.getPerson().getUrn(), federatedUser.getUrn());

        return joinRequest;
    }

    @DeleteMapping("api/teams/join-requests/{id}")
    public void delete(@PathVariable("id") Long id, FederatedUser federatedUser) {
        JoinRequest joinRequest = notNullGetJoinRequest(id, federatedUser);

        validateJoinRequest(joinRequest, federatedUser);

        LOG.info("Deleted joinRequest for team {} and person {}", joinRequest.getTeam().getUrn(), federatedUser.getUrn());
        joinRequestRepository.delete(joinRequest);
    }

    private JoinRequest notNullGetJoinRequest(Long id, FederatedUser federatedUser) {
        JoinRequest joinRequest = joinRequestRepository.findOne(id);
        assertNotNull(JoinRequest.class.getSimpleName(), joinRequest, id);
        return joinRequest;
    }

    private JoinRequest notNullGetJoinRequestValidateMembership(Long id, FederatedUser federatedUser) {
        JoinRequest joinRequest = notNullGetJoinRequest(id, federatedUser);

        Membership membership = membership(joinRequest.getTeam(), federatedUser.getUrn());
        membersCanNotApproveJoinRequests(membership.getRole());
        return joinRequest;
    }



}
