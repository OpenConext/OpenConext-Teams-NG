package teams.api;

import org.junit.Test;
import org.springframework.test.context.ActiveProfiles;
import teams.AbstractApplicationTest;
import teams.domain.Membership;
import teams.domain.Role;
import teams.domain.Team;

import java.util.List;
import java.util.Set;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_BAD_REQUEST;
import static org.apache.http.HttpStatus.SC_FORBIDDEN;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.isEmptyOrNullString;
import static org.hamcrest.Matchers.startsWith;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class TeamControllerTest extends AbstractApplicationTest {

    @Test
    public void myTeams() throws Exception {
        given()
            .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
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
            .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
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
    public void teamByUrnNoMemberships() throws Exception {
        given()
            .header("name-id", "not-a-member")
            .when()
            .get("api/teams/teams/{urn}", "nl:surfnet:diensten:riders")
            .then()
            .statusCode(SC_OK)
            .body("description", equalTo("we are riders"))
            .body("memberships", isEmptyOrNullString())
            .body("role", isEmptyOrNullString());
    }

    @Test
    public void teamAutocomplete() throws Exception {
        given()
            .header("name-id", "urn:collab:person:surfnet.nl:tdoe")
            .param("query", "ERS")
            .when()
            .get("api/teams/teams")
            .then()
            .statusCode(SC_OK)
            .body("size()", is(2))
            .body("urn", hasItems("nl:surfnet:diensten:riders", "nl:surfnet:diensten:gliders"))
            .body("name", hasItems("riders", "gliders"))
            .body("role", hasItems("ADMIN", null));
    }

    @Test
    public void teamAutocompleteIllegalArgument() throws Exception {
        given()
            .header("name-id", "urn:collab:person:surfnet.nl:tdoe")
            .param("query", "ER")
            .when()
            .get("api/teams/teams")
            .then()
            .statusCode(SC_BAD_REQUEST)
            .body("message", equalTo("Minimal query length is 3"));
    }

    @Test
    public void createTeam() throws Exception {
        String urn = "nl:surfnet:diensten:team_champions";
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
    public void createTeamDuplicateTeamName() throws Exception {
        given()
            .body(new Team("urn", "riders", null, true))
            .header(CONTENT_TYPE, "application/json")
            .when()
            .post("api/teams/teams")
            .then()
            .statusCode(SC_BAD_REQUEST)
            .body("message", equalTo("Team with name riders already exists"));
    }

    @Test
    public void createTeamAsGuest() throws Exception {
        given()
            .body(new Team("urn", "valid", null, true))
            .header(CONTENT_TYPE, "application/json")
            .header("is-member-of", "guest-org")
            .when()
            .post("api/teams/teams")
            .then()
            .statusCode(SC_FORBIDDEN)
            .body("message", equalTo("Access is denied"));
    }

    @Test
    public void updateTeam() throws Exception {
        given()
            .header(CONTENT_TYPE, "application/json")
            .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
            .body(new Team("nl:surfnet:diensten:riders", "changed", "changed", false))
            .when()
            .put("api/teams/teams")
            .then()
            .statusCode(SC_OK);

        Team team = teamRepository.findByUrn("nl:surfnet:diensten:riders").get();
        assertEquals("changed", team.getDescription());
        //name is immutable
        assertEquals("riders", team.getName());
        assertFalse(team.isViewable());
    }

    @Test
    public void updateTeamAsGuest() throws Exception {
        given()
            .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
            .header("is-member-of", "guest-org")
            .header(CONTENT_TYPE, "application/json")
            .body(new Team("nl:surfnet:diensten:riders", "valid", null, true))
            .when()
            .put("api/teams/teams")
            .then()
            .statusCode(SC_FORBIDDEN)
            .body("message", equalTo("Access is denied"));
    }

    @Test
    public void updateTeamWithMemberRole() throws Exception {
        given()
            .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
            .header(CONTENT_TYPE, "application/json")
            .body(new Team("nl:surfnet:diensten:giants", "valid", null, true))
            .when()
            .put("api/teams/teams")
            .then()
            .statusCode(SC_BAD_REQUEST)
            .body("message", startsWith("Only ADMIN can update team"));
    }

    @Test
    public void updateTeamWithoutBeingMember() throws Exception {
        given()
            .header(CONTENT_TYPE, "application/json")
            .body(new Team("nl:surfnet:diensten:giants", "valid", null, true))
            .when()
            .put("api/teams/teams")
            .then()
            .statusCode(SC_BAD_REQUEST)
            .body("message", startsWith("Member urn:collab:person:example.com:john.doe is not a member of team nl:surfnet:diensten:giants"));
    }

    @Test
    public void deleteTeam() throws Exception {
        given()
            .header(CONTENT_TYPE, "application/json")
            .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
            .when()
            .delete("api/teams/teams/{id}", 1)
            .then()
            .statusCode(SC_OK);

        assertFalse(teamRepository.findByUrn("nl:surfnet:diensten:riders").isPresent());
    }


}