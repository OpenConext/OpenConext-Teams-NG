package teams.api;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.JoinRequestValidator;
import teams.api.validations.MembershipValidator;
import teams.domain.*;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
public class JoinRequestController extends ApiController implements MembershipValidator, JoinRequestValidator {

    @GetMapping("api/teams/join-requests/{id}")
    public JoinRequest joinRequest(@PathVariable("id") Long id, FederatedUser federatedUser) {
        JoinRequest joinRequest = notNullGetJoinRequest(id);
        validateJoinRequest(joinRequest, federatedUser);
        return joinRequest;
    }

    @PostMapping("api/teams/join-requests")
    public JoinRequest join(@Validated @RequestBody ClientJoinRequest clientJoinRequest, FederatedUser federatedUser) throws MessagingException, IOException {
        Team team = teamById(clientJoinRequest.getTeamId(), true);
        Person person = federatedUser.getPerson();

        List<JoinRequest> existingJoinRequestForTheSameTeam = team.getJoinRequests().stream()
                .filter(existingJoinRequest -> existingJoinRequest.getPerson().getId().equals(person.getId()))
                .collect(toList());

        List<String> admins = admins(team);

        membershipNotAllowed(team, person);
        privateTeamDoesNotAllowMembers(team, person);

        JoinRequest joinRequest = new JoinRequest(person, team, clientJoinRequest.getMessage());
        joinRequestRepository.save(joinRequest);

        joinRequestRepository.delete(existingJoinRequestForTheSameTeam);

        mailBox.sendJoinRequestMail(joinRequest, admins);

        log.info("Created joinRequest for team {} and person {}", team.getUrn(), person.getUrn());

        return joinRequest;
    }

    @PutMapping("api/teams/join-requests/approve")
    public Membership approve(@Validated @RequestBody IdHolder idHolder, FederatedUser federatedUser) throws MessagingException, IOException {
        JoinRequest joinRequest = notNullGetJoinRequestValidateMembership(idHolder.getId(), federatedUser);

        Person person = joinRequest.getPerson();
        Team team = joinRequest.getTeam();

        membershipNotAllowed(team, person);

        Membership newMembership = new Membership(Role.MEMBER, team, person);
        membershipRepository.save(newMembership);

        mailBox.sendJoinRequestAccepted(joinRequest);
        joinRequestRepository.delete(joinRequest);

        log.info("Approved joinRequest for team {} and person {} by {}",
                team.getUrn(), person.getUrn(), federatedUser.getUrn());

        return newMembership;
    }

    @DeleteMapping("api/teams/join-requests/reject/{id}")
    public void reject(@PathVariable("id") Long id, FederatedUser federatedUser) throws MessagingException, IOException {
        JoinRequest joinRequest = notNullGetJoinRequestValidateMembership(id, federatedUser);

        mailBox.sendJoinRequestRejected(joinRequest);
        joinRequestRepository.delete(joinRequest);

        log.info("Rejected joinRequest for team {} and person {} by {}",
                joinRequest.getTeam().getUrn(), joinRequest.getPerson().getUrn(), federatedUser.getUrn());
    }

    @DeleteMapping("api/teams/join-requests/{id}")
    public void delete(@PathVariable("id") Long id, FederatedUser federatedUser) {
        JoinRequest joinRequest = notNullGetJoinRequest(id);

        validateJoinRequest(joinRequest, federatedUser);

        log.info("Deleted joinRequest for team {} and person {}", joinRequest.getTeam().getUrn(), federatedUser.getUrn());
        joinRequestRepository.delete(joinRequest);
    }

    private JoinRequest notNullGetJoinRequest(Long id) {
        JoinRequest joinRequest = joinRequestRepository.findOne(id);
        assertNotNull(JoinRequest.class.getSimpleName(), joinRequest, id);
        return joinRequest;
    }

    private JoinRequest notNullGetJoinRequestValidateMembership(Long id, FederatedUser federatedUser) {
        JoinRequest joinRequest = notNullGetJoinRequest(id);

        Membership membership = membership(joinRequest.getTeam(), federatedUser.getUrn());
        membersCanNotApproveJoinRequests(membership.getRole());
        return joinRequest;
    }



}
