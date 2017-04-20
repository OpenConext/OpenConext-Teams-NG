package teams.api;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Value;
import teams.AbstractApplicationTest;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.isEmptyOrNullString;

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
                .body(isEmptyOrNullString())
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

}