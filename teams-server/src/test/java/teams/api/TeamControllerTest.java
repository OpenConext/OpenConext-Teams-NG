package teams.api;

import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;
import teams.AbstractApplicationTest;
import teams.domain.Membership;
import teams.domain.Role;
import teams.domain.Team;

import java.util.Set;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_BAD_REQUEST;
import static org.apache.http.HttpStatus.SC_FORBIDDEN;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.isEmptyOrNullString;
import static org.junit.Assert.assertEquals;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

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

    @Test
    public void teamByUrn() throws Exception {
        given()
            .param("name-id", "urn:collab:person:surfnet.nl:jdoe")
            .when()
            .get("api/teams/teams/{urn}", "nl:surfnet:diensten:giants")
            .then()
            .statusCode(SC_OK)
            .body("memberships.person.name", hasItems("Tracey Doe", "William Doe", "John Doe", "Mary Doe"));
    }

    @Test
    public void teamByUrnNotExistent() throws Exception {
        given()
            .when()
            .get("api/teams/teams/{urn}", "nope")
            .then()
            .statusCode(SC_NOT_FOUND);
    }

    @Test
    public void teamByUrnNotAllowed() throws Exception {
        given()
            .param("name-id", "not-a-member")
            .when()
            .get("api/teams/teams/{urn}", "nl:surfnet:diensten:riders")
            .then()
            .statusCode(SC_FORBIDDEN);
    }

    @Test
    public void teamSearch() throws Exception {
        given()
            .param("name-id", "urn:collab:person:surfnet.nl:tdoe")
            .param("query", "ERS")
            .when()
            .get("api/teams/teams")
            .then()
            .statusCode(SC_OK)
            .body("urn", hasItems("nl:surfnet:diensten:riders", "nl:surfnet:diensten:gliders"))
            .body("name", hasItems("riders", "gliders"))
            .body("role", hasItems("ADMIN", null));
    }

    @Test
    public void createTeam() throws Exception {
        String urn = "urn:collab:group:dev.surfteams.nl:team_champions";
        given()
            .body(new Team("urn", "Team champions ", null, true))
            .header(CONTENT_TYPE, "application/json")
            .when()
            .post("api/teams/teams")
            .then()
            .statusCode(SC_OK)
            .body("urn", equalTo(urn));

        Set<Membership> memberships = teamRepository.findByUrn(urn).get().getMemberships();
        assertEquals(1, memberships.size());

        Membership membership = memberships.iterator().next();
        assertEquals(Role.ADMIN, membership.getRole());
        assertEquals("urn:collab:person:example.com:john.doe", membership.getUrnPerson());
    }

    @Test
    public void createTeamInvalidTeamName() throws Exception {
        given()
            .body(new Team("urn", "invalid $", null, true))
            .header(CONTENT_TYPE, "application/json")
            .when()
            .post("api/teams/teams")
            .then()
            .statusCode(SC_BAD_REQUEST)
            .body("errors[0].defaultMessage", equalTo("must match \"[\\w \\-']{1,255}\""));
    }

    @Test
    public void createTeamAsGuest() throws Exception {
        given()
            .body(new Team("urn", "valid", null, true))
            .header(CONTENT_TYPE, "application/json")
            .when()
            .post("api/teams/teams?is-member-of=guest-org")
            .then()
            .statusCode(SC_FORBIDDEN)
            .body("message", equalTo("Access is denied"));
    }

}