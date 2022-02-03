package teams.shibboleth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.util.StringUtils;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.repository.MembershipRepository;
import teams.repository.PersonRepository;
import teams.security.SuperAdmin;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.text.Normalizer;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class ShibbolethPreAuthenticatedProcessingFilter extends AbstractPreAuthenticatedProcessingFilter {

    private static final Logger LOG = LoggerFactory.getLogger(ShibbolethPreAuthenticatedProcessingFilter.class);

    private final PersonRepository personRepository;
    private final MembershipRepository membershipRepository;
    private final String nonGuestsMemberOf;
    private final SuperAdmin superAdmin;

    public ShibbolethPreAuthenticatedProcessingFilter(AuthenticationManager authenticationManager,
                                                      PersonRepository personRepository,
                                                      MembershipRepository membershipRepository,
                                                      String nonGuestsMemberOf,
                                                      SuperAdmin superAdmin) {
        super();
        this.personRepository = personRepository;
        this.membershipRepository = membershipRepository;
        this.nonGuestsMemberOf = nonGuestsMemberOf;
        this.superAdmin = superAdmin;
        setAuthenticationManager(authenticationManager);
    }

    @Override
    protected Object getPreAuthenticatedPrincipal(HttpServletRequest request) {
        String nameId = getHeader("name-id", request);
        String name = getHeader("displayName", request);
        String email = getHeader("Shib-InetOrgPerson-mail", request);
        String memberOf = getHeader("is-member-of", request);
        name = normalize(name);

        Person person = new Person(nameId, name, email, !nonGuestsMemberOf.equals(memberOf), false);

        LOG.info("Person {} is attempting authentication", person);
        if (person.isValid()) {
            Person provisionedPerson = provision(person);
            boolean isMemberButNoOwner = superAdmin.getUrns().stream()
                    .map(urn -> membershipRepository.findByUrnTeamAndUrnPerson(urn, nameId))
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .anyMatch(membership -> membership.getRole() != null && !membership.getRole().equals(Role.OWNER));

            provisionedPerson.markAsSuperAdmin(isMemberButNoOwner);
            return provisionedPerson;
        } else {
            return null;
        }
    }

    protected String normalize(String name) {
        if (!StringUtils.hasText(name)) {
            return name;
        }
        //Due to the current mysql UTF-8 encoding we will normalize the displayName
        String normalized = Normalizer.normalize(name, Normalizer.Form.NFD);
        normalized = normalized.replaceAll("[^\\p{ASCII}]", "");
        return normalized;
    }

    @Override
    protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
        return "N/A";
    }

    private Person provision(Person person) {
        Optional<Person> personOptional = personRepository.findByUrnIgnoreCase(person.getUrn());
        personOptional.ifPresent(personFromDatabase -> {
            personFromDatabase.setGuest(person.isGuest());
            personFromDatabase.setEmail(person.getEmail());
            personFromDatabase.setName(person.getName());
            personFromDatabase.setLastLoginDate(Instant.now());

            LOG.info("Updating existing person after login {}", person);

            personRepository.save(personFromDatabase);
        });
        return personOptional.orElseGet(() -> personRepository.save(person));
    }

    private String getHeader(String name, HttpServletRequest request) {
        String header = request.getHeader(name);
        try {
            return org.springframework.util.StringUtils.hasText(header) ?
                    new String(header.getBytes("ISO8859-1"), "UTF-8") : header;
        } catch (UnsupportedEncodingException e) {
            throw new IllegalArgumentException(e);
        }
    }

}
