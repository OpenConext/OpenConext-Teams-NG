package teams.api;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.Membership;

import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertTrue;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class PublicLinkControllerTest extends AbstractApplicationTest {

    private static final String PUBLIC_LINK_SECRET = "wZiomLDTk3CU2FR9bRy1IFCfYSqt5AFwSAs74M1EuIQs3D";
    private static final String PUBLIC_LINK_SECRET_DISABLED = "ErtOpeSiYdEluAMd53CXs4TnN3RyrHUIHdaxImw3q1A3D";

    @Test
    public void publicLinkNotFound() {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:rdoe")
                .when()
                .get("api/teams/public-links/{publicLink}", "nope")
                .then()
                .statusCode(SC_NOT_FOUND);
    }

    @Test
    public void publicLink() {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:rdoe")
                .when()
                .get("api/teams/public-links/{publicLink}", PUBLIC_LINK_SECRET)
                .then()
                .statusCode(SC_OK)
                //{"id":1,"name":"riders","description":"we are riders","alreadyMember":true}
                .body("name", equalTo("riders"))
                .body("alreadyMember", equalTo(true));
    }

    @Test
    public void accept() throws Exception {
        String personUrn = "urn:collab:person:surfnet.nl:unknown";
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", personUrn)
                .when()
                .put("api/teams/public-links/{publicLink}", PUBLIC_LINK_SECRET)
                .then()
                .statusCode(SC_OK);
        Optional<Membership> membership = membershipRepository.findByUrnTeamAndUrnPerson("nl:surfnet:diensten:riders", personUrn);
        assertTrue(membership.isPresent());
    }

    @Test
    public void acceptNotFound() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .when()
                .put("api/teams/public-links/{publicLink}", "nope")
                .then()
                .statusCode(SC_NOT_FOUND);
    }
}