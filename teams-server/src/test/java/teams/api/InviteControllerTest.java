package teams.api;

import com.github.tomakehurst.wiremock.junit.WireMockRule;
import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import org.junit.Rule;
import org.junit.Test;
import teams.AbstractApplicationTest;

import java.util.List;
import java.util.Map;

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SuppressWarnings("unchecked")
public class InviteControllerTest extends AbstractApplicationTest {

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(8888);

    @Test
    public void teamDetails() {
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
    public void teamDetailsExternal() {
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

    @Test
    public void migrateTeam() {
        stubFor(put(
                urlEqualTo("/api/teams"))
                .willReturn(aResponse().withStatus(200)));

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

    @Test
    public void migrateTeamExternal() {
        stubFor(put(
                urlEqualTo("/api/teams"))
                .willReturn(aResponse().withStatus(200)));

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
}