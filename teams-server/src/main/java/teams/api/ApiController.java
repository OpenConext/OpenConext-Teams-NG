package teams.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
import teams.domain.*;
import teams.exception.NotAllowedException;
import teams.exception.ResourceNotFoundException;
import teams.mail.MailBox;
import teams.repository.*;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Locale;

import static java.lang.String.format;
import static java.util.Arrays.asList;


public abstract class ApiController {

    protected final Logger LOG = LoggerFactory.getLogger(getClass());

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

    protected Team teamById(Long id) {
        Team team = teamRepository.findOne(id);
        assertNotNull("Team", team, id);
        return team;
    }

    protected ExternalTeam externalTeamById(Long id) {
        ExternalTeam externalTeam = externalTeamRepository.findOne(id);
        assertNotNull("ExternalTeam", externalTeam, id);
        return externalTeam;
    }

    protected Membership membershipByUrns(String teamUrn, String personUrn) {
        return membershipRepository.findByUrnTeamAndUrnPerson(teamUrn, personUrn)
                .orElseThrow(() -> new ResourceNotFoundException(
                        format("Membership for team %s and person %s does not exist", teamUrn, personUrn)));
    }

    protected Membership membership(Team team, String urn) {
        return team.member(urn)
                .orElseThrow(() -> new NotAllowedException(format
                        ("Member %s is not a member of team %s.", urn, team.getUrn())));
    }

    protected void assertNotNull(String entityName, Object entity, Long id) {
        if (entity == null) {
            throw new ResourceNotFoundException(String.format("%s %s does not exist", entityName, id));
        }
    }

    protected void saveAndSendInvitation(Invitation invitation, Team team, Person person) throws IOException, MessagingException {
        invitationRepository.save(invitation);

        LOG.info("Created invitation for team {} and person {}", team.getUrn(), person.getUrn());

        mailBox.sendInviteMail(invitation);

    }


}
