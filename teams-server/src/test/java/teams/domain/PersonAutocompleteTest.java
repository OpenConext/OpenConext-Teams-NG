package teams.domain;

import org.junit.Test;

import static org.junit.Assert.*;

public class PersonAutocompleteTest {
    @Test
    public void equals() throws Exception {
        PersonAutocomplete personAutocomplete = new PersonAutocomplete("name", "a@a");

        assertFalse(personAutocomplete.equals(null));
        assertFalse(personAutocomplete.equals("nope"));
        assertFalse(personAutocomplete.equals(new PersonAutocomplete("name", "nope@a")));

        assertTrue(personAutocomplete.equals(new PersonAutocomplete("name", "a@a")));
        assertTrue(personAutocomplete.equals(personAutocomplete));
    }

}