package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import teams.api.validations.TeamValidator;
import teams.domain.*;
import teams.exception.ResourceNotFoundException;
import teams.repository.PersonRepository;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import static java.util.stream.Collectors.toList;

@RestController
public class SpDashboardController extends ApiController implements TeamValidator {

    private final PersonRepository personRepository;
    private final Map<String, String> productConfig;
    private final String spDashboardPersonUrn;
    private final String spDashboardPersonEmail;
    private final String spDashboardPersonName;

    @Autowired
    public SpDashboardController(PersonRepository personRepository,
                                 @Qualifier("productConfig") Map<String, String> productConfig,
                                 @Value("${sp_dashboard.person-urn}") String spDashboardPersonUrn,
                                 @Value("${sp_dashboard.email}") String spDashboardPersonEmail,
                                 @Value("${sp_dashboard.name}") String spDashboardPersonName) {
        this.personRepository = personRepository;
        this.productConfig = productConfig;
        this.spDashboardPersonUrn = spDashboardPersonUrn;
        this.spDashboardPersonEmail = spDashboardPersonEmail;
        this.spDashboardPersonName = spDashboardPersonName;
    }

    @GetMapping("api/spdashboard/teams/{urn:.+}")
    public Team teamByUrn(@PathVariable("urn") String urn) {
        Team team = teamRepository.findByUrn(urn).orElseThrow(() -> new ResourceNotFoundException(String.format("Team with urn %s does not exists", urn)));
        team.setUrn(urn);
        team.getInvitations()
                //lazy load messages
                .forEach(invitation -> invitation.getInvitationMessages().forEach(InvitationMessage::getMessage));
        return team;
    }

    @PostMapping("api/spdashboard/teams")
    public Team createTeam(@Validated @RequestBody NewTeamProperties teamProperties) throws IOException, MessagingException {
        return doCreateTeam(teamProperties, this.federatedUser());
    }

    @PutMapping("api/spdashboard/memberships")
    public ResponseEntity changeMembership(@Validated @RequestBody MembershipProperties membershipProperties) {
        Membership membership = membershipRepository.findOne(membershipProperties.getId());

        Role futureRole = membershipProperties.getRole();
        log.info("Changing current {} membership of {} in team {} to {} by {}",
                membership.getRole(), membership.getPerson().getUrn(), membership.getTeam().getUrn(), futureRole, "SP Dashboard");

        membership.setRole(futureRole);
        membershipRepository.save(membership);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("api/spdashboard/invites")
    public ResponseEntity invites(@Validated @RequestBody ClientInvitation clientInvitation) {
        Person person = this.federatedUser().getPerson();

        Team team = teamById(clientInvitation.getTeamId(), false);

        List<String> emails = clientInvitation.getEmails();
        List<Invitation> invitations = emails.stream().map(email -> new Invitation(
                team,
                email,
                clientInvitation.getIntendedRole(),
                clientInvitation.getLanguage(),
                clientInvitation.getExpiryDate()).addInvitationMessage(person, clientInvitation.getMessage()))
                .collect(toList());
        log.info("Saving {} invitations for emails: {}", invitations.size(), String.join(",", emails));
        saveAndSendInvitation(invitations, team, person, this.federatedUser());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("api/spdashboard/invites")
    public ResponseEntity resend(@Validated @RequestBody ClientResendInvitation resendInvitation) throws IOException, MessagingException {
        Long invitationId = resendInvitation.getId();
        Invitation invitation = invitationRepository.findOne(invitationId);
        invitation.addInvitationMessage(this.federatedUser().getPerson(), resendInvitation.getMessage());
        log.info("Resending mail to {}", invitation.getEmail());
        invitationRepository.save(invitation);

        mailBox.sendInviteMail(invitation, this.federatedUser());

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private FederatedUser federatedUser() {
        Person person = personRepository.findByUrnIgnoreCase(spDashboardPersonUrn).orElseGet(() ->
                personRepository.save(new Person(spDashboardPersonUrn, spDashboardPersonName, spDashboardPersonEmail, false, false)));
        return new FederatedUser(person, productConfig.get("productName"), productConfig);
    }


    @DeleteMapping("api/spdashboard/teams/{id}")
    public ResponseEntity deleteTeam(@PathVariable("id") Long id) {
        Team team = teamRepository.findOne(id);

        log.info("Deleting team {}", team.getName());

        teamRepository.delete(team);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("api/spdashboard/memberships/{membershipId}")
    public ResponseEntity deleteMembership(@PathVariable("membershipId") Long membershipId) {
        Membership membership = membershipRepository.findOne(membershipId);

        log.info("Deleting membership {} from team {}", membership.getPerson().getUrn(), membership.getTeam().getUrn());

        membershipRepository.delete(membership);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


}
