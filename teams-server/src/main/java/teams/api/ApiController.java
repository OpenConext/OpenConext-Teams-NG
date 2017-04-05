package teams.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Team;
import teams.exception.NotAllowedException;
import teams.exception.ResourceNotFoundException;
import teams.repository.ExternalTeamRepository;
import teams.repository.MembershipRepository;
import teams.repository.PersonRepository;
import teams.repository.TeamRepository;

import static java.lang.String.format;


public abstract class ApiController {

    protected final Logger LOG = LoggerFactory.getLogger(getClass());

    @Autowired
    protected TeamRepository teamRepository;

    @Autowired
    protected PersonRepository personRepository;

    @Autowired
    protected MembershipRepository membershipRepository;

    @Autowired
    protected ExternalTeamRepository externalTeamRepository;

    protected Team teamByUrn(String urn) {
        return teamRepository.findByUrn(urn)
            .orElseThrow(() -> new ResourceNotFoundException(format("Team %s does not exist", urn)));
    }

    protected Person personByUrn(String urn) {
        return personRepository.findByUrn(urn)
            .orElseThrow(() -> new ResourceNotFoundException(format("Person %s does not exist", urn)));
    }

    protected Membership membershipByUrns(String teamUrn, String personUrn) {
        return membershipRepository.findByUrnTeamAndUrnPerson(teamUrn, personUrn)
            .orElseThrow(() -> new ResourceNotFoundException(
                format("Membership for team %s and person %s does not exist", teamUrn, personUrn)));
    }

    protected Membership membership(Team team, String urn) {
        return team.member(urn)
            .orElseThrow(() -> new NotAllowedException(format
                ("Member %s is not a member of team %s.",urn, team.getUrn())));
    }

}
