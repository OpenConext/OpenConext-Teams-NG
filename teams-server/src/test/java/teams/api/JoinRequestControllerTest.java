package teams.api;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.ClientJoinRequest;
import teams.domain.JoinRequest;

import java.util.List;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.*;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class JoinRequestControllerTest extends AbstractApplicationTest {

    @Test
    public void join() throws Exception {
        JoinRequest joinRequest = doJoin(new ClientJoinRequest(
            "nl:surfnet:diensten:riders", "Join request\n"));

        assertTrue(joinRequest.isContainsMessage());
        assertEquals("Join request<br/>", joinRequest.getHtmlMessage());

        assertEquals("urn:collab:person:surfnet.nl:tdoe", joinRequest.getPerson().getUrn());
        assertEquals("nl:surfnet:diensten:riders", joinRequest.getTeam().getUrn());
    }

    @Test
    public void joinEmptyMessage() throws Exception {
        JoinRequest joinRequest = doJoin(new ClientJoinRequest(
            "nl:surfnet:diensten:riders", null));

        assertFalse(joinRequest.isContainsMessage());
        assertEquals("", joinRequest.getHtmlMessage());
    }

    private JoinRequest doJoin(ClientJoinRequest clientJoinRequest) {
        given()
            .header(CONTENT_TYPE, "application/json")
            .header("name-id", "urn:collab:person:surfnet.nl:tdoe")
            .body(clientJoinRequest)
            .when()
            .post("api/teams/join")
            .then()
            .statusCode(SC_OK);

        List<JoinRequest> joinRequests = joinRequestRepository.findByPerson(personRepository.findByUrn("urn:collab:person:surfnet.nl:tdoe").get());
        assertEquals(1, joinRequests.size());

        return joinRequests.get(0);
    }

}