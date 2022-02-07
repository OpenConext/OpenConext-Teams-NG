package teams.api;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.jupiter.api.Assertions.assertEquals;


@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class RedirectControllerTest {

    @LocalServerPort
    private int serverPort;

    @BeforeEach
    public void before() throws Exception {
        RestAssured.port = serverPort;
    }


    @Test
    void health() {
        given()
                .get("health")
                .then()
                .body("status", equalTo("UP"));
    }

    @Test
    void info() {
        Map info = given()
                .contentType(ContentType.JSON)
                .get("info")
                .as(Map.class);
        assertEquals(0, info.size());
    }
}