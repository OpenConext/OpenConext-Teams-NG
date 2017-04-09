package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.ClientInvitation;
import teams.domain.ClientResendInvitation;
import teams.domain.FederatedUser;
import teams.domain.Invitation;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.ResourceNotFoundException;
import teams.mail.MailBox;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@RestController
public class InvitationController extends ApiController implements MembershipValidator, InvitationValidator {

    @Autowired
    private MailBox mailBox;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("api/teams/invitations")
    public void invitation(HttpServletRequest request,
                           @Validated @RequestBody ClientInvitation clientInvitation,
                           FederatedUser federatedUser) throws IOException, MessagingException {
        Team team = teamByUrn(clientInvitation.getTeamUrn());
        Person person = federatedUser.getPerson();

        membershipRequired(team, person);
        privateTeamDoesNotAllowMembers(team, person);
        Role role = determineFutureRole(team, person, clientInvitation.getIntendedRole());

        Invitation invitation = new Invitation(
            team,
            clientInvitation.getEmail(),
            role,
            resolveLanguage(request));
        invitation.addInvitationMessage(person, clientInvitation.getMessage());

        invitationRepository.save(invitation);
        mailBox.sendInviteMail(invitation);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("api/teams/invitations/{id}")
    public void delete(@PathVariable("id") Long id,
                       FederatedUser federatedUser) throws IOException, MessagingException {
        Invitation invitation = invitationRepository.findOne(id);

        assertNotNull(invitation, id);
        mustBeTeamAdminOrManager(invitation, federatedUser);

        invitationRepository.delete(invitation);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("api/teams/invitations")
    public void resend(@Validated @RequestBody ClientResendInvitation resendInvitation,
                       FederatedUser federatedUser) throws IOException, MessagingException {
        Invitation invitation = invitationRepository.findOne(resendInvitation.getInvitationId());

        assertNotNull(invitation, resendInvitation.getInvitationId());
        mustBeTeamAdminOrManager(invitation, federatedUser);

        invitation.addInvitationMessage(federatedUser.getPerson(), resendInvitation.getMessage());

        invitationRepository.save(invitation);

        mailBox.sendInviteMail(invitation);
    }


    @GetMapping("api/teams/invitations/accept")
    public Team accept(@RequestParam("key") String key, FederatedUser federatedUser) throws IOException, MessagingException {
        Person person = federatedUser.getPerson();
        Invitation invitation = doAcceptOrDeny(key, true, person);
        Team team = invitation.getTeam();
        Role role = person.isGuest() ? Role.MEMBER : invitation.getIntendedRole();
        new Membership(role, team, person);

        Team savedTeam = teamRepository.save(team);
        return savedTeam;
    }

    @GetMapping("api/teams/invitations/deny")
    public Invitation deny(@RequestParam("key") String key, FederatedUser federatedUser) throws IOException, MessagingException {
        return doAcceptOrDeny(key, false, federatedUser.getPerson());
    }

    private Invitation doAcceptOrDeny(String key, boolean accepted, Person person) {
        Invitation invitation = invitationRepository.findFirstByInvitationHash(key).orElseThrow(() ->
            new ResourceNotFoundException(String.format("Invitation %s not found", key))
        );
        validateInvitation(invitation, person);
        invitation.accepted(accepted);
        return invitationRepository.save(invitation);
    }
}
