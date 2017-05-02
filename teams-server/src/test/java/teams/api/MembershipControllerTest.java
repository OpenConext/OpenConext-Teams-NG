package teams.api;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.Membership;
import teams.domain.Role;
import teams.exception.NotAllowedException;

import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.*;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class MembershipControllerTest extends AbstractApplicationTest {

    @Test
    public void membership() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .get("api/teams/membership/{teamId}", 1L)
                .then()
                .statusCode(SC_OK)
                .body("role", equalTo("ADMIN"));
    }

    @Test
    public void noMembership() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:no-member")
                .get("api/teams/membership/{teamId}", 1L)
                .then()
                .statusCode(SC_BAD_REQUEST)
                .body("exception",equalTo(NotAllowedException.class.getName()));
    }

    @Test
    public void changeMembership() throws Exception {
        Membership body = new Membership(
                Role.ADMIN,
                team("nl:surfnet:diensten:giants"),
                person("urn:collab:person:surfnet.nl:tdoe"));

        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .body(body)
                .when()
                .put("api/teams/membership")
                .then()
                .statusCode(SC_OK);

        Membership membership = membershipRepository.findByUrnTeamAndUrnPerson(body.getUrnTeam(), body.getUrnPerson()).get();
        assertEquals(Role.ADMIN, membership.getRole());
    }

    @Test
    public void changeMembershipNotExist() throws Exception {
        Membership body = new Membership(
                Role.ADMIN,
                team("nope"),
                person("urn:collab:person:surfnet.nl:tdoe"));

        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .body(body)
                .when()
                .put("api/teams/membership")
                .then()
                .statusCode(SC_NOT_FOUND);
    }

    @Test
    public void deleteMembership() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .when()
                .delete("api/teams/membership/{id}", 6)
                .then()
                .statusCode(SC_OK);

        Optional<Membership> membershipOptional = membershipRepository.findByUrnTeamAndUrnPerson(
                "nl:surfnet:diensten:giants", "urn:collab:person:surfnet.nl:tdoe");
        assertFalse(membershipOptional.isPresent());
    }

    @Test
    public void deleteMembershipNotExists() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .when()
                .delete("api/teams/membership/{id}", 999)
                .then()
                .statusCode(SC_NOT_FOUND);
    }

}