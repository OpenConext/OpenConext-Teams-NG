package teams.domain;

import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;
import teams.Seed;
import teams.exception.ResourceNotFoundException;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static teams.domain.Language.Dutch;
import static teams.domain.Role.ADMIN;

public class InvitationTest implements Seed {

    private Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    public void invitationHash() throws UnsupportedEncodingException {
        String invitationHash = invitation().getInvitationHash();
        int length = invitationHash.length();
        assertTrue(length > 170 && length < 200);
    }

    @Test(expected = ResourceNotFoundException.class)
    public void getLatestInvitationMessage() throws UnsupportedEncodingException {
        Invitation invitation = invitation();
        invitation.getInvitationMessages().clear();
        invitation.getLatestInvitationMessage();
    }

    @Test
    public void emailInvalid() throws UnsupportedEncodingException {
        List<ConstraintViolation<Invitation>> violations = violations("aa");
        assertEquals(1, violations.size());
        assertEquals("must match \"\\S+@\\S+\"", violations.get(0).getMessage());
    }

    @Test
    public void emailValid() throws UnsupportedEncodingException {
        List<ConstraintViolation<Invitation>> violations = violations("a@a.com");
        assertEquals(0, violations.size());
    }

    @Test
    public void daysValid() throws UnsupportedEncodingException {
        Invitation invitation = invitation("email");
        long fiveDaysAgo = LocalDateTime.now().minusDays(5).atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        ReflectionTestUtils.setField(invitation, "timestamp", fiveDaysAgo);
        long daysValid = invitation.daysValid();
        assertEquals(9, daysValid);
    }

    private Invitation invitation() throws UnsupportedEncodingException {
        return invitation("email@test.org");
    }

    private Invitation invitation(String email) throws UnsupportedEncodingException {
        Invitation invitation = new Invitation(team(), email, ADMIN, Dutch, null);
        invitation.addInvitationMessage(person(), "Please join");
        return invitation;
    }

    private List<ConstraintViolation<Invitation>> violations(String email) throws UnsupportedEncodingException {
        return new ArrayList<>(this.validator.validate(invitation(email)));
    }
}