package teams.api;

import io.restassured.http.ContentType;
import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;
import teams.AbstractApplicationTest;
import teams.domain.*;
import teams.exception.DuplicateTeamNameException;
import teams.exception.IllegalMembershipException;
import teams.exception.NotAllowedException;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.*;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
properties = "features.invite-migration-on=true")
public class TeamControllerInviteMigrationTest extends AbstractApplicationTest {

    @Test
    public void createTeamBadRequest() {
        given()
                .body(new NewTeamProperties("new team name", "Team champions ", null, true, true,false,
                        null, Role.ADMIN.name(), null, Language.DUTCH))
                .header(CONTENT_TYPE, "application/json")
                .when()
                .post("api/teams/teams")
                .then()
                .statusCode(SC_BAD_REQUEST);

    }

}
