package teams.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import teams.domain.*;
import teams.exception.NotAllowedException;
import teams.exception.ResourceNotFoundException;
import teams.mail.MailBox;
import teams.repository.*;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.List;
import java.util.stream.StreamSupport;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;


public abstract class ApiController {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    @Autowired
    protected TeamRepository teamRepository;

    @Autowired
    protected MembershipRepository membershipRepository;

    @Autowired
    protected ExternalTeamRepository externalTeamRepository;

    @Autowired
    protected InvitationRepository invitationRepository;

    @Autowired
    protected JoinRequestRepository joinRequestRepository;

    @Autowired
    protected MailBox mailBox;

    protected Team teamById(Long id, boolean includePersons) {
        Team team = includePersons ? teamRepository.findFirstById(id) : teamRepository.findById(id);
        assertNotNull("Team", team, id);
        return team;
    }

    protected Membership membership(Team team, String urn) {
        return team.member(urn)
                .orElseThrow(() -> new NotAllowedException(format
                        ("Member %s is not a member of team %s.", urn, team.getUrn())));
    }

    protected void assertNotNull(String entityName, Object entity, Object id) {
        if (entity == null) {
            throw new ResourceNotFoundException(String.format("%s %s does not exist", entityName, id));
        }
    }

    protected List<Invitation> saveAndSendInvitation(List<Invitation> invitations, Team team, Person person, FederatedUser federatedUser) throws IOException, MessagingException {
        Iterable<Invitation> saved = invitationRepository.save(invitations);
        saved.forEach(invitation -> {
            try {
                mailBox.sendInviteMail(invitation, federatedUser);
                log.info("Created invitation by {} for team {} and person {} with email {}",
                        federatedUser.getPerson().getUrn(),
                        team.getUrn(),
                        person.getUrn(),
                        invitation.getEmail());
            } catch (MessagingException | IOException e) {
                throw new IllegalArgumentException(e);
            }
        });
        return StreamSupport.stream(saved.spliterator(), false).collect(toList());
    }


}
