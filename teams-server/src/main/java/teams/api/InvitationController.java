package teams.api;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.InvitationValidator;
import teams.api.validations.MembershipValidator;
import teams.domain.*;
import teams.exception.ResourceNotFoundException;

import javax.mail.MessagingException;
import java.io.IOException;
import java.time.Instant;
import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
public class InvitationController extends ApiController implements MembershipValidator, InvitationValidator {

    @GetMapping("api/teams/invitations/{id}")
    public Invitation invitation(@PathVariable("id") Long id, FederatedUser federatedUser) {
        Invitation invitation = invitationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Invitation not found:" + id));

        mustBeTeamAdminOrManager(invitation, federatedUser);

        return invitation;
    }

    @PostMapping("api/teams/invitations")
    public List<Invitation> invite(@Validated @RequestBody ClientInvitation clientInvitation,
                                   FederatedUser federatedUser) throws IOException {
        Team team = teamById(clientInvitation.getTeamId(), false);
        Person person = federatedUser.getPerson();

        membershipRequired(team, person);
        Role role = determineFutureRole(team, person, clientInvitation.getIntendedRole());

        validateClientInvitation(clientInvitation);

        List<String> emails = emails(clientInvitation);
        List<Invitation> invitations = emails.stream().map(email -> new Invitation(
                        team,
                        email,
                        role,
                        clientInvitation.getLanguage(),
                        clientInvitation.getExpiryDate(),
                        clientInvitation.getMembershipExpiryDate()).addInvitationMessage(person, clientInvitation.getMessage()))
                .collect(toList());

        log.info("Saving {} invitations for emails: {}", invitations.size(), String.join(",", emails));

        return saveAndSendInvitation(invitations, team, person, federatedUser);
    }

    @DeleteMapping("api/teams/invitations/{id}")
    public void delete(@PathVariable("id") Long id,
                       FederatedUser federatedUser) throws IOException, MessagingException {
        Invitation invitation = invitationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Invitation not found:" + id));

        mustBeTeamAdminOrManager(invitation, federatedUser);

        invitationRepository.delete(invitation);

        log.info("Deleted invitation for team {} and person {}",
                invitation.getTeam().getUrn(), federatedUser.getUrn());
    }

    @PutMapping("api/teams/invitations")
    public Invitation resend(@Validated @RequestBody ClientResendInvitation resendInvitation,
                             FederatedUser federatedUser) throws IOException, MessagingException {
        Long invitationId = resendInvitation.getId();
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found:" + invitationId));

        mustBeTeamAdminOrManager(invitation, federatedUser);

        invitation.addInvitationMessage(federatedUser.getPerson(), resendInvitation.getMessage());

        invitationRepository.save(invitation);

        mailBox.sendInviteMail(invitation, federatedUser);

        log.info("Resend invitation for team {} and person {}",
                invitation.getTeam().getUrn(), federatedUser.getUrn());

        return invitation;
    }


    @GetMapping("api/teams/invitations/info/{key}")
    public InvitationInfo invitationInfo(@PathVariable("key") String key, FederatedUser federatedUser) {
        Invitation invitation = invitationRepository.findFirstByInvitationHash(key).orElseThrow(() -> {
            log.info("Invitation not found with hash '%s' for user '%s'", key, federatedUser.getPerson().getEmail());
            return new ResourceNotFoundException(String.format("Invitation %s not found", key));

        });
        return new InvitationInfo(invitation, federatedUser);
    }

    @PutMapping("api/teams/invitations/accept/{key}")
    public Team accept(@PathVariable("key") String key, FederatedUser federatedUser) throws IOException, MessagingException {
        Person person = federatedUser.getPerson();
        Invitation invitation = doAcceptOrDeny(key, true, person);
        Team team = invitation.getTeam();
        Instant expiryDate = invitation.getMembershipExpiryDate();
        new Membership(invitation.getIntendedRole(), team, person, expiryDate, MembershipOrigin.INVITATION_ACCEPTED,
                invitation.getFirstInviter().map(inviter -> inviter.getName()).orElse(person.getName()));

        // rare race condition when join requests and invitations overlap
        List<JoinRequest> joinRequests = joinRequestRepository.findByPersonAndTeam(person, team);
        joinRequestRepository.deleteAll(joinRequests);

        return teamRepository.save(team);
    }

    @PutMapping("api/teams/invitations/deny/{key}")
    public Invitation deny(@PathVariable("key") String key, FederatedUser federatedUser) {
        return doAcceptOrDeny(key, false, federatedUser.getPerson());
    }

    private Invitation doAcceptOrDeny(String key, boolean accepted, Person person) {
        Invitation invitation = getInvitationByHash(key, person);
        invitation.accepted(accepted);

        log.info("Invitation {} for team {} and person {}",
                accepted ? "Accepted" : "Denied", invitation.getTeam().getUrn(), person.getUrn());

        return invitationRepository.save(invitation);
    }

    private Invitation getInvitationByHash(String key, Person person) {
        Invitation invitation = invitationRepository.findFirstByInvitationHash(key).orElseThrow(() ->
                new ResourceNotFoundException(String.format("Invitation %s not found", key))
        );
        validateInvitation(invitation, person);
        return invitation;
    }
}
