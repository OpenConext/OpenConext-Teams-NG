package teams.api;

import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;
import teams.AbstractApplicationTest;
import teams.domain.Membership;
import teams.domain.Role;
import teams.domain.Team;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_OK;
import static org.junit.Assert.*;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

@ActiveProfiles("dev")
public class MembershipControllerTest extends AbstractApplicationTest {

    @Test
    public void changeMembership() throws Exception {
        Membership body = new Membership("nl:surfnet:diensten:giants", "urn:collab:person:surfnet.nl:tdoe", Role.ADMIN);

        given()
            .header(CONTENT_TYPE, "application/json")
            .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
            .body(body)
            .when()
            .put("api/teams/role")
            .then()
            .statusCode(SC_OK);

        Membership membership = membershipRepository.findByUrnTeamAndUrnPerson(body.getUrnTeam(), body.getUrnPerson()).get();
        assertEquals(Role.ADMIN , membership.getRole());
    }

}