package teams.shibboleth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.util.StringUtils;
import teams.domain.Person;
import teams.repository.PersonRepository;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.Optional;

public class ShibbolethPreAuthenticatedProcessingFilter extends AbstractPreAuthenticatedProcessingFilter {

    private static final Logger LOG = LoggerFactory.getLogger(ShibbolethPreAuthenticatedProcessingFilter.class);

    private final PersonRepository personRepository;
    private String nonGuestsMemberOf;

    public ShibbolethPreAuthenticatedProcessingFilter(AuthenticationManager authenticationManager,
                                                      PersonRepository personRepository,
                                                      String nonGuestsMemberOf) {
        super();
        this.personRepository = personRepository;
        this.nonGuestsMemberOf = nonGuestsMemberOf;
        setAuthenticationManager(authenticationManager);
    }

    @Override
    protected Object getPreAuthenticatedPrincipal(HttpServletRequest request) {
        String nameId = getHeader("name-id", request);
        String name = getHeader("displayName", request);
        String email = getHeader("Shib-InetOrgPerson-mail", request);
        String memberOf = getHeader("is-member-of", request);

        Person person = new Person(nameId, name, email, !nonGuestsMemberOf.equals(memberOf));

        LOG.info("Person {} is attempting authentication", person);
        //this is the Spring security contract. Returning null results in AuthenticationException 403
        return person.isValid() ? provision(person) : null;
    }

    @Override
    protected Object getPreAuthenticatedCredentials(HttpServletRequest request) {
        return "N/A";
    }

    private Person provision(Person person) {
        Optional<Person> personOptional = personRepository.findByUrnIgnoreCase(person.getUrn());
        personOptional.ifPresent(personFromDatabase -> {
            if (person.needsUpdate(personFromDatabase)) {
                personFromDatabase.setGuest(person.isGuest());
                personFromDatabase.setEmail(person.getEmail());
                personFromDatabase.setName(person.getName());

                LOG.info("Updating person after detecting change after login {}", person);

                personRepository.save(personFromDatabase);
            }
        });
        return personOptional.orElseGet(() -> personRepository.save(person));
    }

    private String getHeader(String name, HttpServletRequest request) {
        String header = request.getHeader(name);
        try {
            return StringUtils.hasText(header) ?
                    new String(header.getBytes("ISO8859-1"), "UTF-8") : header;
        } catch (UnsupportedEncodingException e) {
            throw new IllegalArgumentException(e);
        }
    }

}
