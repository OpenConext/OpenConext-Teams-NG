package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
import java.io.UnsupportedEncodingException;

@RestController
public class InvitationController extends ApiController implements MembershipValidator, InvitationValidator {

    @Autowired
    private MailBox mailBox;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("api/teams/invitations")
    public void invitation(HttpServletRequest request,
                           @Validated @RequestBody Invitation invitationProperties,
                           FederatedUser federatedUser) throws IOException, MessagingException {
        Team team = teamByUrn(invitationProperties.getTeam().getUrn());
        Person person = federatedUser.getPerson();

        membershipRequired(team, person);
        privateTeamDoesNotAllowMembers(team, person);

        Invitation invitation = new Invitation(
            team,
            invitationProperties.getEmail(),
            invitationProperties.getIntendedRole(),
            resolveLanguage(request));
        invitation.addInvitationMessage(person, invitationProperties.getLatestInvitationMessage().getMessage());

        invitationRepository.save(invitation);
        mailBox.sendInviteMail(invitation);
    }

    @GetMapping("api/teams/invitations/accept")
    public Team accept(@RequestParam("key") String key, FederatedUser federatedUser) {
        Invitation invitation = doAcceptOrDeny(key, true);
        Team team = invitation.getTeam();
        Person person = federatedUser.getPerson();
        Role role = person.isGuest() ? Role.MEMBER : invitation.getIntendedRole();
        new Membership(role, team, person);

        teamRepository.save(team);

        mailBox.sendInvitationAccepted(invitation);

        return team;
    }

    @GetMapping("api/teams/invitations/deny")
    public Invitation deny(@RequestParam("key") String key) {
        Invitation invitation = doAcceptOrDeny(key, false);
        mailBox.sendInvitationDenied(invitation);
        return invitation;
    }

    private Invitation doAcceptOrDeny(@RequestParam("key") String key, boolean accepted) {
        Invitation invitation = invitationRepository.findFirstByInvitationHash(key).orElseThrow(() ->
            new ResourceNotFoundException(String.format("Invitation %s not found", key))
        );
        validateInvitation(invitation);
        invitation.accepted(accepted);
        return invitationRepository.save(invitation);
    }
}
