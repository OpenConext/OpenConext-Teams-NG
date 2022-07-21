package teams.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;
import teams.api.validations.TeamValidator;
import teams.domain.*;
import teams.exception.DuplicateTeamNameException;
import teams.exception.NotAllowedException;
import teams.exception.ResourceNotFoundException;
import teams.mail.MailBox;
import teams.repository.*;

import javax.mail.MessagingException;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.stream.StreamSupport;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;


public abstract class ApiController implements TeamValidator {

    protected final Logger log = LoggerFactory.getLogger(getClass());

    @Value("${teams.default-stem-name}")
    private String defaultStemName;

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

    public static final String ADMIN_HEADER = "X-ADMIN-HEADER";

    protected Team teamById(Long id, boolean includePersons) {
        Team team = includePersons ? teamRepository.findFirstById(id) : teamRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Team not found:" + id));
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

    protected List<Invitation> saveAndSendInvitation(List<Invitation> invitations, Team team, Person person, FederatedUser federatedUser) {
        Iterable<Invitation> saved = invitationRepository.saveAll(invitations);
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

    protected String constructUrn(String name) {
        return format("%s:%s", defaultStemName,
                name.toLowerCase().trim().replaceAll("[ ']", "_"));
    }

    protected void teamNameDuplicated(String name, List<Object> urns) {
        if (!urns.isEmpty()) {
            throw new DuplicateTeamNameException(format("Team with name %s already exists", name));
        }
    }

    public Team doCreateTeam(NewTeamProperties teamProperties, FederatedUser federatedUser) {
        String name = teamProperties.getName();
        validateTeamName(name);

        String urn = constructUrn(name);
        List<Object> urns = teamRepository.existsByUrn(urn);
        List<Object> names = teamRepository.existsByHistoryName(name.toLowerCase());
        urns.addAll(names);

        teamNameDuplicated(name, urns);

        Team team = new Team(urn, name, teamProperties.getDescription(), teamProperties.isViewable(), teamProperties.getPersonalNote());
        team.setPublicLinkDisabled(teamProperties.isPublicLinkDisabled());
        Person person = federatedUser.getPerson();
        Team savedTeam = teamRepository.save(team);

        log.info("Team {} created by {}", urn, federatedUser.getUrn());

        if (!CollectionUtils.isEmpty(teamProperties.getEmails())) {
            teamProperties.getEmails().forEach((email, role) -> {
                Invitation invitation = new Invitation(
                        team,
                        email,
                        Role.valueOf(role),
                        teamProperties.getLanguage(),
                        null);
                invitation.addInvitationMessage(person, teamProperties.getInvitationMessage());
                Invitation saved = saveAndSendInvitation(Collections.singletonList(invitation), team, person, federatedUser).get(0);
                savedTeam.getInvitations().add(saved);

            });
        }

        return team;
    }


}
