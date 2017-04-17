package teams.api;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.ClientInvitation;
import teams.domain.ClientResendInvitation;
import teams.domain.Invitation;
import teams.domain.InvitationMessage;
import teams.domain.Role;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Set;
import java.util.stream.StreamSupport;

import static io.restassured.RestAssured.given;
import static java.util.stream.Collectors.toList;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItems;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class InvitationControllerTest extends AbstractApplicationTest {

    @Test
    public void invitationNl() throws Exception {
        doInvitation("nl");
    }

    @Test
    public void invitationEn() throws Exception {
        doInvitation("en");
    }

    private void doInvitation(String languageCode) throws UnsupportedEncodingException {
        ClientInvitation clientInvitation = new ClientInvitation(
            2L, Role.ADMIN, "test@test.org", "Please join");
        given()
            .header(CONTENT_TYPE, "application/json")
            .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
            .header("accept-language", languageCode)
            .body(clientInvitation)
            .when()
            .post("api/teams/invitations")
            .then()
            .statusCode(SC_OK);

        List<Invitation> collect = StreamSupport.stream(invitationRepository.findAll().spliterator(), false).collect(toList());
        Invitation invitation = StreamSupport.stream(invitationRepository.findAll().spliterator(), false)
            .filter(i -> i.getTeam().getId().equals(clientInvitation.getTeamId())).findFirst().get();

        assertTrue(invitation.getInvitationHash().length() > 150);

        Set<InvitationMessage> invitationMessages = invitation.getInvitationMessages();
        assertEquals(1, invitationMessages.size());
        InvitationMessage invitationMessage = invitationMessages.iterator().next();
        invitationMessage.getMessage().equals("Please join");
    }

    @Test
    public void resend() throws Exception {
        ClientResendInvitation resendInvitation = new ClientResendInvitation(1L, "Second invitation");

        given()
            .header(CONTENT_TYPE, "application/json")
            .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
            .header("accept-language", "nl")
            .body(resendInvitation)
            .when()
            .put("api/teams/invitations")
            .then()
            .statusCode(SC_OK);

        Invitation invitation = invitationRepository.findOne(resendInvitation.getInvitationId());
        assertEquals(2, invitation.getInvitationMessages().size());
    }

    @Test
    public void accept() throws Exception {
        given()
            .header(CONTENT_TYPE, "application/json")
            .header("name-id", "urn:collab:person:surfnet.nl:unknown")
            .queryParam("key", "secret")
            .when()
            .get("api/teams/invitations/accept")
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
            .queryParam("key", "secret")
            .when()
            .get("api/teams/invitations/accept")
            .then()
            .statusCode(SC_OK)
            .body("memberships.role", hasItems("MEMBER", "ADMIN"));
    }

    @Test
    public void deny() throws Exception {
        given()
            .header(CONTENT_TYPE, "application/json")
            .header("name-id", "urn:collab:person:surfnet.nl:unknown")
            .queryParam("key", "secret")
            .when()
            .get("api/teams/invitations/deny")
            .then()
            .statusCode(SC_OK)
            .body("declined", equalTo(true));
    }

    @Test
    public void denyInvalidKey() throws Exception {
        given()
            .header(CONTENT_TYPE, "application/json")
            .queryParam("key", "nope")
            .when()
            .get("api/teams/invitations/deny")
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