package teams.shibboleth;

import org.junit.Before;
import org.junit.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.authentication.AuthenticationManager;
import teams.domain.Person;
import teams.repository.PersonRepository;

import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class ShibbolethPreAuthenticatedProcessingFilterTest {

    private PersonRepository personRepository;

    private ShibbolethPreAuthenticatedProcessingFilter subject;

    @Before
    public void before() throws Exception {
        personRepository = mock(PersonRepository.class);
        subject = new ShibbolethPreAuthenticatedProcessingFilter(mock(AuthenticationManager.class), personRepository,
                "urn:collab:org:surf.nl");
    }

    @Test
    public void getPreAuthenticatedPrincipalNotValid() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        Person person = Person.class.cast(subject.getPreAuthenticatedPrincipal(request));
        assertNull(person);
    }

    @Test
    public void getPreAuthenticatedPrincipalAlreadyExists() throws Exception {
        Person person = new Person("urn", "John Doe", "mail", false);

        when(personRepository.findByUrn("urn")).thenReturn(Optional.empty());
        when(personRepository.save(any(Person.class))).thenReturn(person);
        Person principal = Person.class.cast(subject.getPreAuthenticatedPrincipal(populateServletRequest()));
        assertEquals(person, principal);
    }

    @Test
    public void getPreAuthenticatedPrincipalDoesNotExists() throws Exception {
        Person person = new Person("urn", "Name", "mail", false);
        Person principal = doGetPreAuthenticatedPrincipal(person);
        assertEquals(person, principal);
    }

    @Test
    public void getPreAuthenticatedPrincipalDoesChanged() throws Exception {
        Person person = new Person("urn", "Name", "mail", true);

        when(personRepository.save(any(Person.class))).thenReturn(person);

        Person principal = doGetPreAuthenticatedPrincipal(person);
        assertEquals(person, principal);
    }

    private Person doGetPreAuthenticatedPrincipal(Person person) {
        MockHttpServletRequest request = populateServletRequest();

        when(personRepository.findByUrn("urn")).thenReturn(Optional.of(person));
        return Person.class.cast(subject.getPreAuthenticatedPrincipal(request));


    }

    private MockHttpServletRequest populateServletRequest() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("name-id", "urn");
        request.addHeader("uid", "Name");
        request.addHeader("Shib-InetOrgPerson-mail", "mail");
        request.addHeader("is-member-of", "urn:collab:org:surf.nl");
        return request;
    }
}