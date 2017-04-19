package teams.api;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;
import teams.domain.Language;
import teams.domain.Membership;
import teams.domain.Team;
import teams.exception.NotAllowedException;
import teams.exception.ResourceNotFoundException;
import teams.repository.ExternalTeamRepository;
import teams.repository.InvitationRepository;
import teams.repository.MembershipRepository;
import teams.repository.TeamRepository;

import javax.servlet.http.HttpServletRequest;
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

    private AcceptHeaderLocaleResolver localeResolver;

    public ApiController() {
        localeResolver = new AcceptHeaderLocaleResolver();
        Locale nl = Locale.forLanguageTag("nl");
        localeResolver.setDefaultLocale(nl);
        localeResolver.getSupportedLocales().addAll(asList(Locale.ENGLISH, nl));
    }

    protected Team teamById(Long id) {
        Team team = teamRepository.findOne(id);
        if (team == null) {
            throw new ResourceNotFoundException(format("Team %s does not exist", id));
        }
        return team;
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

    protected Language resolveLanguage(HttpServletRequest request) {
        Locale locale = localeResolver.resolveLocale(request);
        return locale.getLanguage().equalsIgnoreCase("nl") ? Language.Dutch : Language.English;
    }

    protected void assertNotNull(String entityName, Object entity, Long id) {
        if (entity == null) {
            throw new ResourceNotFoundException(String.format("%s %s does not exist", entityName, id));
        }
    }


}
