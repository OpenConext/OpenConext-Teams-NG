package teams.api;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.Membership;
import teams.domain.Role;

import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class MembershipControllerTest extends AbstractApplicationTest {

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