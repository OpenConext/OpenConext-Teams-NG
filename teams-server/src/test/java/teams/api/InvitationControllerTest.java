package teams.api;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.*;
import teams.exception.NotAllowedException;

import java.io.UnsupportedEncodingException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.StreamSupport;

import static io.restassured.RestAssured.given;
import static java.util.stream.Collectors.toList;
import static org.apache.http.HttpStatus.*;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class InvitationControllerTest extends AbstractApplicationTest {

    @Test
    public void invitationCanOnlyBeRetrievedByNonMember() {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:rdoe")
                .when()
                .get("api/teams/invitations/{id}", 1L)
                .then()
                .statusCode(SC_BAD_REQUEST)
                .body("exception", equalTo(NotAllowedException.class.getName()));
    }

    @Test
    public void invitation() {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .when()
                .get("api/teams/invitations/{id}", 1L)
                .then()
                .statusCode(SC_OK)
                .body("email", equalTo("test@example.com"))
                .body("invitationMessages.size()", equalTo(1));
    }

    @Test
    public void invitationNl() throws Exception {
        doInvitation(Language.DUTCH);
    }

    @Test
    public void invitationEn() throws Exception {
        doInvitation(Language.ENGLISH);
    }

    private void doInvitation(Language language) throws UnsupportedEncodingException {
        ClientInvitation clientInvitation = new ClientInvitation(
                2L, Role.ADMIN, Arrays.asList("test@test.org", "test2@test.org"),
                Instant.now().plus(365, ChronoUnit.DAYS), null, "Please join", null, language);
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .body(clientInvitation)
                .when()
                .post("api/teams/invitations")
                .then()
                .statusCode(SC_OK);

        List<Invitation> invitations = StreamSupport.stream(invitationRepository.findAll().spliterator(), false)
                .filter(i -> i.getTeam().getId().equals(clientInvitation.getTeamId()) && i.getInvitationHash().length() > 150)
                .collect(toList());
        assertEquals(2, invitations.size());

        Invitation invitation = invitations.get(0);
        assertEquals(language, invitation.getLanguage());

        Set<InvitationMessage> invitationMessages = invitation.getInvitationMessages();
        assertEquals(1, invitationMessages.size());
        InvitationMessage invitationMessage = invitationMessages.iterator().next();
        invitationMessage.getMessage().equals("Please join");
    }

    @Test
    public void invitationInfo() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:unknown")
                .when()
                .get("api/teams/invitations/info/{key}", "secret")
                .then()
                .statusCode(SC_OK)
                .body("latestInvitationMessage.message", equalTo("Please join"))
                .body("inviter", equalTo("Ronald Doe"))
                .body("teamId", equalTo(1))
                .body("teamName", equalTo("riders"))
                .body("accepted", equalTo(false))
                .body("declined", equalTo(false))
                .body("expiryDate", notNullValue())
                .body("expired", equalTo(false))
                .body("teamDescription", equalTo("we are riders"))
                .body("invitationEmail", equalTo("test@example.com"))
                .body("intendedRole", equalTo("MANAGER"));
    }

    @Test
    public void invitationInfoNotFound() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:unknown")
                .when()
                .get("api/teams/invitations/info/{key}", "nope")
                .then()
                .statusCode(SC_NOT_FOUND);
    }

    @Test
    public void resend() throws Exception {
        ClientResendInvitation resendInvitation = new ClientResendInvitation(1L, "Second invitation");

        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .body(resendInvitation)
                .when()
                .put("api/teams/invitations")
                .then()
                .statusCode(SC_OK);

        Invitation invitation = invitationRepository.findById(resendInvitation.getId()).get();
        assertEquals(2, invitation.getInvitationMessages().size());
    }

    @Test
    public void accept() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:unknown")
                .when()
                .put("api/teams/invitations/accept/{key}", "secret")
                .then()
                .statusCode(SC_OK)
                .body("memberships.role", hasItems("MANAGER", "ADMIN"))
                .body("memberships.urnPerson", hasItems(
                        "urn:collab:person:surfnet.nl:jdoe", "urn:collab:person:surfnet.nl:unknown"));
    }

    @Test
    public void acceptWithDowngradeToMemberBecauseOfGuestStatus() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:unknown")
                .header("is-member-of", "guest")
                .when()
                .put("api/teams/invitations/accept/{key}", "secret")
                .then()
                .statusCode(SC_OK)
                .body("memberships.role", hasItems("MEMBER", "ADMIN"));
    }

    @Test
    public void deny() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:unknown")
                .when()
                .put("api/teams/invitations/deny/{key}", "secret")
                .then()
                .statusCode(SC_OK)
                .body("declined", equalTo(true));
    }

    @Test
    public void denyInvalidKey() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .when()
                .put("api/teams/invitations/deny/{key}", "nope")
                .then()
                .statusCode(SC_NOT_FOUND);
    }

    @Test
    public void delete() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .when()
                .delete("api/teams/invitations/{id}", 1)
                .then()
                .statusCode(SC_OK);

        assertFalse(invitationRepository.findFirstByInvitationHash("secret").isPresent());
    }

}