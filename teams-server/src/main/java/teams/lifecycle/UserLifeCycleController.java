package teams.lifecycle;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.*;
import teams.repository.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class UserLifeCycleController {

    private static final Logger LOG = LoggerFactory.getLogger(UserLifeCycleController.class);

    private JoinRequestRepository joinRequestRepository;
    private MembershipRepository membershipRepository;
    private PersonRepository personRepository;
    private TeamRepository teamRepository;
    private InvitationRepository invitationRepository;

    @Autowired
    public UserLifeCycleController(InvitationRepository invitationRepository,
                                   JoinRequestRepository joinRequestRepository,
                                   MembershipRepository membershipRepository,
                                   PersonRepository personRepository,
                                   TeamRepository teamRepository) {
        this.invitationRepository = invitationRepository;
        this.joinRequestRepository = joinRequestRepository;
        this.membershipRepository = membershipRepository;
        this.personRepository = personRepository;
        this.teamRepository = teamRepository;
    }

    @RequestMapping(method = RequestMethod.GET, value = "/deprovision/{userId:.+}")
    public LifeCycleResult preview(@PathVariable String userId, Authentication authentication) {
        LOG.info("Request for lifecycle preview for {} by {}", userId, authentication.getPrincipal());

        return doDryRun(userId, true);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/deprovision/{userId:.+}/dry-run")
    public LifeCycleResult dryRun(@PathVariable String userId, Authentication authentication) {
        LOG.info("Request for lifecycle dry-run for {} by {}", userId, authentication.getPrincipal());

        return doDryRun(userId, true);
    }

    @RequestMapping(method = RequestMethod.DELETE, value = "/deprovision/{userId:.+}")
    @Transactional
    public LifeCycleResult deprovision(@PathVariable String userId, Authentication authentication) {
        LOG.info("Request for lifecycle deprovision for {} by {}", userId, authentication.getPrincipal());

        return doDryRun(userId, false);
    }

    private LifeCycleResult doDryRun(String userId, boolean dryRun) {
        LifeCycleResult result = new LifeCycleResult();
        Optional<Person> personOptional = this.personRepository.findByUrnIgnoreCase(userId);
        if (!personOptional.isPresent()) {
            //database integrity constraints enforce we don't have information about this user
            return result;
        }
        Person person = personOptional.get();
        Set<Attribute> attributes = new HashSet<>();
        attributes.add(new Attribute("email", person.getEmail()));
        attributes.add(new Attribute("name", person.getName()));
        attributes.add(new Attribute("urn", person.getUrn()));
        attributes.add(new Attribute("lastLoginDate", person.getLastLoginDate().toString()));
        Set<JoinRequest> joinRequests = person.getJoinRequests();
        joinRequests.forEach(joinRequest -> attributes.add(new Attribute("joinRequest", joinRequest.getTeam().getName())));
        Set<Membership> memberships = person.getMemberships();
        memberships.forEach(membership -> attributes.add(new Attribute("membership", membership.getTeam().getName())));
        if (!dryRun) {
            joinRequests.forEach(joinRequest -> joinRequestRepository.delete(joinRequest));
            memberships.forEach(membership -> {
                membershipRepository.delete(membership);
                Team team = membership.getTeam();
                int membershipCount = team.getMembershipCount();
                if (membershipCount == 1) {
                    Set<Invitation> invitations = team.getInvitations();
                    invitations.forEach(invitation -> invitationRepository.delete(invitation));

                    teamRepository.delete(team);
                }
            });
            personRepository.delete(person);
        }
        result.setData(new ArrayList<>(attributes).stream()
                .filter(attr -> StringUtils.hasText(attr.getValue()))
                .sorted(Comparator.comparing(Attribute::getName))
                .collect(Collectors.toList()));
        return result;
    }

}
