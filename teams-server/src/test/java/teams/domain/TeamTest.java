package teams.domain;

import org.junit.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class TeamTest {

    private Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    public void validName() throws Exception {
        List<ConstraintViolation<Team>> violations = team("Name - allowed's");
        assertTrue(violations.isEmpty());
    }

    @Test
    public void invalidName() throws Exception {
        List<ConstraintViolation<Team>> violations = team("^");
        assertEquals(1, violations.size());
        assertEquals("must match \"[\\w \\-']{1,255}\"", violations.get(0).getMessage());
    }

    @Test
    public void containsMessage() {
        Team team = new Team("urn", "name", " ", true);
        assertEquals("", team.getHtmlDescription());

        team.setDescription("Nice\n");
        assertEquals("Nice<br/>", team.getHtmlDescription());
    }


    private List<ConstraintViolation<Team>> team(String name) {
        return new ArrayList<>(this.validator.validate(new Team("urn", name, "Description", true)));
    }

}