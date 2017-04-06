package teams.api;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.Invitation;
import teams.domain.InvitationMessage;
import teams.domain.Language;
import teams.domain.Role;
import teams.domain.Team;

import java.util.Set;
import java.util.stream.StreamSupport;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItems;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class InvitationControllerTest extends AbstractApplicationTest {

    @Test
    public void invitation() throws Exception {
        Team team = team("nl:surfnet:diensten:giants");
        Invitation invitationProperties = new Invitation(team, "test@test.org", Role.ADMIN, Language.Dutch);
        invitationProperties.addInvitationMessage(person("urn:collab:person:surfnet.nl:mdoe"), "Please join");

        given()
            .header(CONTENT_TYPE, "application/json")
            .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
            .header("accept-language", "nl")
            .body(invitationProperties)
            .when()
            .post("api/teams/invitations")
            .then()
            .statusCode(SC_OK);

        Invitation invitation = StreamSupport.stream(invitationRepository.findAll().spliterator(), false)
            .filter(i -> i.getTeam().getUrn().equals(team.getUrn())).findFirst().get();

        assertTrue(invitation.getInvitationHash().length() > 150);

        Set<InvitationMessage> invitationMessages = invitation.getInvitationMessages();
        assertEquals(1, invitationMessages.size());
        InvitationMessage invitationMessage = invitationMessages.iterator().next();
        invitationMessage.getMessage().equals("Please join");
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
            .body("memberships.urnPerson", hasItems(
                "urn:collab:person:surfnet.nl:jdoe", "urn:collab:person:surfnet.nl:unknown"));
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

}