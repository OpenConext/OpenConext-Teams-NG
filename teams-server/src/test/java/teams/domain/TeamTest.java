package teams.domain;

import org.junit.Test;
import teams.Seed;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.Assert.*;

public class TeamTest implements Seed {

    private Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    public void validName() throws Exception {
        List<ConstraintViolation<Team>> violations = teamViolations("Name - allowed's");
        assertTrue(violations.isEmpty());
    }

    @Test
    public void invalidName() throws Exception {
        List<ConstraintViolation<Team>> violations = teamViolations("^ ");
        assertEquals(1, violations.size());
        assertEquals("must match \"[\\w \\-']{1,255}\"", violations.get(0).getMessage());
    }

    @Test
    public void containsMessage() {
        Team team = new Team("urn", "name", " ", true, null);
        assertEquals("", team.getHtmlDescription());

        team.setDescription("Nice\n");
        assertEquals("Nice<br/>", team.getHtmlDescription());
    }

    @Test
    public void teamEquals() {
        Set<Team> set = new HashSet<>();

        Team team = team("identifier_1");
        set.add(team);
        set.add( team("identifier_1"));

        assertFalse(team.equals(null));
        assertFalse(team.equals("nope"));

        assertTrue(team.equals(team));

    }

    private List<ConstraintViolation<Team>> teamViolations(String name) {
        return new ArrayList<>(this.validator.validate(new Team("urn", name, "Description", true, null)));
    }

}