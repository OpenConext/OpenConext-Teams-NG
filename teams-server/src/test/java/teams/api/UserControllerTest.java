package teams.api;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Value;
import teams.AbstractApplicationTest;
import teams.exception.IllegalSearchParamException;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_BAD_REQUEST;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.*;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class UserControllerTest extends AbstractApplicationTest {

    @Value("${teams.group-name-context}")
    private String groupNameContext;

    @Test
    public void currentUser() throws Exception {
        given()
                .when()
                .get("api/teams/users/me")
                .then()
                .statusCode(SC_OK)
                .body("authorities.authority", hasItems("ROLE_ADMIN", "ROLE_USER"))
                .body("groupNameContext", equalTo(groupNameContext))
                .body("externalTeams.size()", equalTo(10));

        given()
                .header("name-id", "not-provisioned")
                .when()
                .get("api/teams/users/me")
                .then()
                .statusCode(SC_OK)
                .body("urn", equalTo("not-provisioned"));
    }

    @Test
    public void autocomplete() throws Exception {
        given()
                .when()
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .param("query", "john")
                .get("api/teams/users")
                .then()
                .statusCode(SC_OK)
                .body("size()", is(2))
                .body("name", hasItems("John Doe"))
                .body("email", hasItems("john.doe@example.org", "junior@domain.net"));
    }

    @Test
    public void teamAutocompleteIllegalArgument() throws Exception {
        given()
                .param("query", "E ")
                .when()
                .get("api/teams/users")
                .then()
                .statusCode(SC_BAD_REQUEST)
                .body("exception", equalTo(IllegalSearchParamException.class.getName()));
    }

    @Test
    public void logout() throws Exception {
        given()
                .when()
                .delete("api/teams/users/logout")
                .then()
                .statusCode(SC_OK);
    }

    @Test
    public void error() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .when()
                .body(Collections.singletonMap("error", "message"))
                .post("api/teams/error")
                .then()
                .statusCode(SC_OK);
    }
}