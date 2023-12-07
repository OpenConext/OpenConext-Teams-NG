package teams.api;

import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.springframework.http.HttpHeaders;
import teams.AbstractApplicationTest;
import teams.WireMockExtension;

import java.util.List;
import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@SuppressWarnings("unchecked")
class InviteControllerTest extends AbstractApplicationTest {

    @RegisterExtension
    WireMockExtension mockServer = new WireMockExtension(8888);

    @SneakyThrows
    @BeforeEach
    void beforeEach() {
        super.before();
    }

    @SneakyThrows
    @Test
    void migrateTeam() {
        String body = super.objectMapper.writeValueAsString(Map.of("status", 201));
        stubFor(put(
                urlEqualTo("/api/teams"))
                .willReturn(aResponse()
                        .withBody(body)
                        .withHeader(HttpHeaders.CONTENT_TYPE, APPLICATION_JSON_VALUE)
                        .withHeader(HttpHeaders.CONNECTION, "close")
                        .withStatus(201)));

        assertTrue(super.teamRepository.findById(2L).isPresent());

        given()
                .header("name-id", "urn:collab:person:surfnet.nl:super_admin")
                .contentType(ContentType.JSON)
                .body(Map.of("id", 2))
                .when()
                .put("/api/teams/invite-app/migrate")
                .then()
                .statusCode(201);
    }

    @SneakyThrows
    @Test
    void migrateTeamExternal() {
        String body = super.objectMapper.writeValueAsString(Map.of("status", 201));
        stubFor(put(
                urlEqualTo("/api/teams"))
                .willReturn(aResponse()
                        .withBody(body)
                        .withHeader(HttpHeaders.CONTENT_TYPE, APPLICATION_JSON_VALUE)
                        .withHeader(HttpHeaders.CONNECTION, "close")
                        .withStatus(201)));

        assertTrue(super.teamRepository.findById(2L).isPresent());

        given()
                .auth()
                .preemptive()
                .basic("teams", "secret")
                .contentType(ContentType.JSON)
                .body(Map.of("id", 2))
                .when()
                .put("/api/v1/external/invite-app/migrate")
                .then()
                .statusCode(201);
    }

    @Test
    void teamDetails() {
        Map map = given()
                .header("name-id", "urn:collab:person:surfnet.nl:super_admin")
                .when()
                .pathParams("id", String.valueOf(2))
                .get("/api/teams/invite-app/{id}")
                .as(new TypeRef<>() {
                });
        assertEquals(2, ((List) map.get("applications")).size());
    }

    @Test
    void teamDetailsExternal() {
        Map map = given()
                .auth()
                .preemptive()
                .basic("teams", "secret")
                .when()
                .pathParams("id", String.valueOf(2))
                .get("/api/v1/external/invite-app/{id}")
                .as(new TypeRef<>() {
                });
        assertEquals(2, ((List) map.get("applications")).size());
    }

}