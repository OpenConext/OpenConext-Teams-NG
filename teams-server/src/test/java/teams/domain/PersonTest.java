package teams.domain;

import org.junit.Test;
import teams.Seed;

import static org.junit.Assert.*;

public class PersonTest  {
    @Test
    public void isValid() throws Exception {
        assertTrue(new Person("urn", "name", "email", true).isValid());

        assertFalse(new Person(null, "name", "email", true).isValid());
        assertFalse(new Person("urn", null, "email", true).isValid());
        assertFalse(new Person("urn", "name", null, true).isValid());
    }

}