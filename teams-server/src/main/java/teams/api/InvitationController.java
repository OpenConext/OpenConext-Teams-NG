package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
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
import teams.exception.InvitationAlreadyAcceptedException;
import teams.exception.InvitationAlreadyDeclinedException;
import teams.exception.InvitationExpiredException;
import teams.exception.ResourceNotFoundException;
import teams.mail.MailBox;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;

@RestController
public class InvitationController extends ApiController implements MembershipValidator{

    @Autowired
    private MailBox mailBox;

    @PostMapping("api/teams/invitations")
    public void invitation(HttpServletRequest request,
                     @Validated @RequestBody Invitation invitationProperties,
                     FederatedUser federatedUser) throws UnsupportedEncodingException {
        Team team = teamByUrn(invitationProperties.getTeam().getUrn());
        Person person = personByUrn(federatedUser.getUrn());

        membershipNotAllowed(team, person);
        privateTeamDoesNotAllowMembers(team, person);

        Invitation invitation = new Invitation(
            team,
            invitationProperties.getEmail(),
            invitationProperties.getIntendedRole(),
            resolveLanguage(request));
        invitation.getInvitationMessages().add(invitationProperties.getLatestInvitationMessage());

        invitationRepository.save(invitation);
        mailBox.sendInviteMail(invitation);
    }

    @GetMapping("api/teams/invitations/accept")
    public Team accept(@RequestParam("key") String key, FederatedUser federatedUser) {
        Invitation invitation = doAcceptOrDeny(key, true);
        invitationRepository.save(invitation);

        Team team = invitation.getTeam();
        Person person = invitation.getLatestInvitationMessage().getPerson();
        Role role = person.isGuest() ? Role.MEMBER : invitation.getIntendedRole();
        Membership membership = new Membership(role, team, person);

        team.getMemberships().add(membership);
        teamRepository.save(team);
        return team;
    }

    @GetMapping("api/teams/invitations/deny")
    public void deny(@RequestParam("key") String key) {
        Invitation invitation = doAcceptOrDeny(key, false);
        invitationRepository.save(invitation);
    }

    private Invitation doAcceptOrDeny(@RequestParam("key") String key, boolean accepted) {
        Invitation invitation = invitationRepository.findFirstByInvitationHash(key).orElseThrow(() ->
            new ResourceNotFoundException(String.format("Invitation %s not found", key))
        );
        if (invitation.hasExpired()) {
            throw new InvitationExpiredException();
        }
        if (invitation.isAccepted()) {
            throw new InvitationAlreadyAcceptedException();
        }
        if (invitation.isDeclined()) {
            throw new InvitationAlreadyDeclinedException();
        }
        invitation.accepted(accepted);
        return invitation;
    }
}
