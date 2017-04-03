package teams.shibboleth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.web.authentication.preauth.AbstractPreAuthenticatedProcessingFilter;
import org.springframework.util.Assert;
import teams.domain.Person;
import teams.repository.PersonRepository;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

public class ShibbolethPreAuthenticatedProcessingFilter extends AbstractPreAuthenticatedProcessingFilter {

    private final static Logger LOG = LoggerFactory.getLogger(ShibbolethPreAuthenticatedProcessingFilter.class);

    private final PersonRepository personRepository;

    public ShibbolethPreAuthenticatedProcessingFilter(AuthenticationManager authenticationManager,
                                                      PersonRepository personRepository) {
        super();
        this.personRepository = personRepository;
        setAuthenticationManager(authenticationManager);
    }

    @Override
    protected Object getPreAuthenticatedPrincipal(final HttpServletRequest request) {
        String nameId = request.getHeader("name-id");
        String name = request.getHeader("uid");
        String email = request.getHeader("Shib-InetOrgPerson-mail");
        String memberOf = request.getHeader("is-member-of");

        Person person = new Person(nameId, name, email, !"urn:collab:org:surf.nl".equals(memberOf));

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
            boolean needsUpdate = false;
            Person personFromDatabase = personOptional.get();
            if (person.isGuest() != personFromDatabase.isGuest()) {
                personFromDatabase.setGuest(person.isGuest());
                needsUpdate = true;
            }
            if (personFromDatabase.getEmail().equals("UNKNOWN_ATTRIBUTE")) {
                personFromDatabase.setEmail(person.getEmail());
                personFromDatabase.setName(person.getName());
                needsUpdate = true;
            }
            if (needsUpdate) {
                LOG.info(String.format("Updating person {}", person));
                personRepository.save(personFromDatabase);

            }
        } else {
            personRepository.save(person);
        }
        return person;
    }

}
