package teams.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import teams.NotAllowedException;
import teams.ResourceNotFoundException;
import teams.domain.FederatedUser;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.domain.TeamSummary;
import teams.repository.MembershipRepository;
import teams.repository.PersonRepository;
import teams.repository.TeamRepository;
import teams.shibboleth.ShibbolethPreAuthenticatedProcessingFilter;

import java.util.List;
import java.util.Optional;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;


public abstract class ApiController {

    protected final Logger LOG = LoggerFactory.getLogger(getClass());

    @Autowired
    protected TeamRepository teamRepository;

    @Autowired
    protected PersonRepository personRepository;

    @Autowired
    protected MembershipRepository membershipRepository;

    protected Team teamByUrn(String urn) {
        return teamRepository.findByUrn(urn)
            .orElseThrow(() -> new ResourceNotFoundException(format("Team {} does not exist", urn)));
    }

    protected Person personByUrn(String urn) {
        return personRepository.findByUrn(urn)
            .orElseThrow(() -> new ResourceNotFoundException(format("Person {} does not exist", urn)));
    }

    protected Membership membership(Team team, String urn) {
        return team.member(urn)
            .orElseThrow(() -> new NotAllowedException(format("Member {} is not a member of team {}.")));
    }

}
