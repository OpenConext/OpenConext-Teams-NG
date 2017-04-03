package teams.api;

import io.restassured.specification.RequestSpecification;
import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;
import teams.AbstractApplicationTest;
import teams.domain.Person;

import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItems;
import static org.junit.Assert.*;

@ActiveProfiles("dev")
public class UserControllerTest extends AbstractApplicationTest {

    @Test
    public void person() throws Exception {
        given()
            .when()
            .get("api/teams/users/me")
            .then()
            .statusCode(SC_OK)
            .body("authorities.authority", hasItems("ROLE_ADMIN", "ROLE_USER"));

        given()
            .param("name-id", "not-provisioned")
            .when()
            .get("api/teams/users/me")
            .then()
            .statusCode(SC_OK)
            .body("urn", equalTo("not-provisioned"));
    }

}