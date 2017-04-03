package teams.api;

import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;
import teams.AbstractApplicationTest;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.hasItems;

@ActiveProfiles("dev")
public class TeamControllerTest extends AbstractApplicationTest {
    @Test
    public void myTeams() throws Exception {
        given()
            .param("name-id", "urn:collab:person:surfnet.nl:jdoe")
            .when()
            .get("api/teams/teams/me")
            .then()
            .statusCode(SC_OK)
            .body("name", hasItems("giants", "gliders", "riders"))
            .body("role", hasItems("MANAGER", "MEMBER", "ADMIN"));

    }

}