package teams.shibboleth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import teams.domain.Person;
import teams.repository.PersonRepository;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

public class ShibbolethPreAuthenticatedProcessingFilter extends AbstractPreAuthenticatedProcessingFilter {

    private final static Logger LOG = LoggerFactory.getLogger(ShibbolethPreAuthenticatedProcessingFilter.class);

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
    protected Object getPreAuthenticatedPrincipal(final HttpServletRequest request) {
        String nameId = request.getHeader("name-id");
        String name = request.getHeader("displayName");
        String email = request.getHeader("Shib-InetOrgPerson-mail");
        String memberOf = request.getHeader("is-member-of");

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
        Optional<Person> personOptional = personRepository.findByUrn(person.getUrn());
        if (personOptional.isPresent()) {
            Person personFromDatabase = personOptional.get();
            if (person.needsUpdate(personFromDatabase)) {
                personFromDatabase.setGuest(person.isGuest());
                personFromDatabase.setEmail(person.getEmail());
                personFromDatabase.setName(person.getName());

                LOG.info("Updating person after detecting change after login {}", person);

                return personRepository.save(personFromDatabase);
            }
            return personFromDatabase;
        } else {
            return personRepository.save(person);
        }
    }

}
