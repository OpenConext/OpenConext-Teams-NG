package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StreamUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.InvitationValidator;
import teams.api.validations.MembershipValidator;
import teams.domain.*;
import teams.exception.IllegalInviteException;
import teams.exception.ResourceNotFoundException;
import teams.mail.MailBox;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;

@RestController
public class InvitationController extends ApiController implements MembershipValidator, InvitationValidator {

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("api/teams/invitations")
    public List<Invitation> invitation(@Validated @RequestBody ClientInvitation clientInvitation,
                                       FederatedUser federatedUser) throws IOException, MessagingException {
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
                clientInvitation.getExpiryDate()).addInvitationMessage(person, clientInvitation.getMessage()))
                .collect(toList());

        return saveAndSendInvitation(invitations, team, person);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("api/teams/invitations/{id}")
    public void delete(@PathVariable("id") Long id,
                       FederatedUser federatedUser) throws IOException, MessagingException {
        Invitation invitation = invitationRepository.findOne(id);

        assertNotNull(Invitation.class.getSimpleName(), invitation, id);
        mustBeTeamAdminOrManager(invitation, federatedUser);

        invitationRepository.delete(invitation);

        LOG.info("Deleted invitation for team {} and person {}",
                invitation.getTeam().getUrn(), federatedUser.getUrn());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("api/teams/invitations")
    public void resend(@Validated @RequestBody ClientResendInvitation resendInvitation,
                       FederatedUser federatedUser) throws IOException, MessagingException {
        Long invitationId = resendInvitation.getInvitationId();
        Invitation invitation = invitationRepository.findOne(invitationId);

        assertNotNull(Invitation.class.getSimpleName(), invitation, invitationId);
        mustBeTeamAdminOrManager(invitation, federatedUser);

        invitation.addInvitationMessage(federatedUser.getPerson(), resendInvitation.getMessage());

        invitationRepository.save(invitation);

        mailBox.sendInviteMail(invitation);

        LOG.info("Resend invitation for team {} and person {}",
                invitation.getTeam().getUrn(), federatedUser.getUrn());
    }


    @GetMapping("api/teams/invitations/info")
    public InvitationInfo invitation(@RequestParam("key") String key, FederatedUser federatedUser) throws IOException, MessagingException {
        return new InvitationInfo(this.getInvitationByHash(key, federatedUser.getPerson()));
    }

    @GetMapping("api/teams/invitations/accept")
    public Team accept(@RequestParam("key") String key, FederatedUser federatedUser) throws IOException, MessagingException {
        Person person = federatedUser.getPerson();
        Invitation invitation = doAcceptOrDeny(key, true, person);
        Team team = invitation.getTeam();
        Role role = person.isGuest() ? Role.MEMBER : invitation.getIntendedRole();
        new Membership(role, team, person, invitation.getExpiryDate());

        return teamRepository.save(team);
    }

    @GetMapping("api/teams/invitations/deny")
    public Invitation deny(@RequestParam("key") String key, FederatedUser federatedUser) throws IOException, MessagingException {
        return doAcceptOrDeny(key, false, federatedUser.getPerson());
    }

    private Invitation doAcceptOrDeny(String key, boolean accepted, Person person) {
        Invitation invitation = getInvitationByHash(key, person);
        invitation.accepted(accepted);

        LOG.info("Invitation {} for team {} and person {}",
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
