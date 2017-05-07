package teams.api;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.ClientJoinRequest;
import teams.domain.JoinRequest;
import teams.domain.Membership;
import teams.domain.Role;

import java.util.List;
import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_BAD_REQUEST;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.*;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class JoinRequestControllerTest extends AbstractApplicationTest {
    @Test
    public void joinRequest() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .when()
                .get("api/teams/join-requests/{id}", 3L)
                .then()
                .statusCode(SC_OK)
                .body("person.email",equalTo("john.doe@example.org"))
                .body("message", equalTo("Please, please let me join"));
    }

    @Test
    public void joinRequestWrongPerson() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .when()
                .get("api/teams/join-requests/{id}", 3L)
                .then()
                .statusCode(SC_BAD_REQUEST);
    }

    @Test
    public void approveJoinRequest() {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .when()
                .put("api/teams/join-requests/approve/{id}", 1L)
                .then()
                .statusCode(SC_OK);

        Membership membership = membershipRepository.findByUrnTeamAndUrnPerson(
                "nl:surfnet:diensten:riders",
                "urn:collab:person:example.com:john.doe").get();
        assertEquals(Role.MEMBER, membership.getRole());
    }

    @Test
    public void rejectJoinRequest() {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .when()
                .put("api/teams/join-requests/reject/{id}", 1L)
                .then()
                .statusCode(SC_OK);

        Optional<Membership> membership = membershipRepository.findByUrnTeamAndUrnPerson(
                "nl:surfnet:diensten:riders",
                "urn:collab:person:example.com:john.doe");
        assertFalse(membership.isPresent());
    }


    @Test
    public void deleteJoinRequest() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .when()
                .delete("api/teams/join-requests/{id}", 3L)
                .then()
                .statusCode(SC_OK);

        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .when()
                .get("api/teams/join-requests/{id}", 3L)
                .then()
                .statusCode(SC_NOT_FOUND);
    }

    @Test
    public void deelteJoinRequestWrongPerson() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .when()
                .delete("api/teams/join-requests/{id}", 3L)
                .then()
                .statusCode(SC_BAD_REQUEST);

        assertEquals(3L, joinRequestRepository.count());
    }


    @Test
    public void join() throws Exception {
        JoinRequest joinRequest = doJoin(new ClientJoinRequest(
                1L, "Join request\n"));

        assertTrue(joinRequest.isContainsMessage());
        assertEquals("Join request<br/>", joinRequest.getHtmlMessage());

        assertEquals("urn:collab:person:surfnet.nl:tdoe", joinRequest.getPerson().getUrn());
        assertEquals("nl:surfnet:diensten:riders", joinRequest.getTeam().getUrn());
    }

    @Test
    public void joinEmptyMessage() throws Exception {
        JoinRequest joinRequest = doJoin(new ClientJoinRequest(
                1L, null));

        assertFalse(joinRequest.isContainsMessage());
        assertEquals("", joinRequest.getHtmlMessage());
    }

    private JoinRequest doJoin(ClientJoinRequest clientJoinRequest) {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:tdoe")
                .body(clientJoinRequest)
                .when()
                .post("api/teams/join-requests")
                .then()
                .statusCode(SC_OK);

        List<JoinRequest> joinRequests = joinRequestRepository.findByPerson(personRepository.findByUrnIgnoreCase("urn:collab:person:surfnet.nl:TDOE").get());
        assertEquals(1, joinRequests.size());

        return joinRequests.get(0);
    }

}