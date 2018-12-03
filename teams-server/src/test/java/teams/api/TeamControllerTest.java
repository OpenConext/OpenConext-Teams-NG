package teams.api;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.*;
import teams.exception.DuplicateTeamNameException;
import teams.exception.IllegalMembershipException;
import teams.exception.IllegalSearchParamException;
import teams.exception.NotAllowedException;

import java.util.Map;
import java.util.Set;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.*;
import static org.hamcrest.Matchers.*;
import static org.junit.Assert.*;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class TeamControllerTest extends AbstractApplicationTest {

    @Test
    public void myTeams() throws Exception {
        given()
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .when()
                .get("api/teams/my-teams")
                .then()
                .statusCode(SC_OK)
                .body("teamSummaries.name", hasItems("giants", "gliders", "riders"))
                .body("teamSummaries.joinRequestsCount", hasItems(2, 0, 0))
                .body("teamSummaries.invitationsCount", hasItems(1, 1, 0))
                .body("teamSummaries.role", hasItems("MANAGER", "MEMBER", "ADMIN"))
                .body("myJoinRequests.size()", equalTo(1))
                .body("myJoinRequests.teamName", hasItems("masters"))
                .body("myJoinRequests.teamDescription", hasItems("we are masters"));
    }

    @Test
    public void myTeamsWithJoinRequest() throws Exception {
        given()
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .when()
                .get("api/teams/my-teams")
                .then()
                .statusCode(SC_OK)
                .body("myJoinRequests.size()", equalTo(1))
                .body("myJoinRequests.teamName", hasItems("riders"))
                .body("myJoinRequests.teamDescription", hasItems("we are riders"));
    }

    @Test
    public void teamById() throws Exception {
        given()
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .when()
                .get("api/teams/teams/{id}", 1L)
                .then()
                .statusCode(SC_OK)
                .body("memberships.person.name", hasItems("John Doe"))
                .body("invitations.intendedRole", hasItems("MANAGER"))
                .body("joinRequests.message", hasItems("Please let me join"))
                .body("externalTeams.name", hasItems("name1", "name2"));
    }

    @Test
    public void privateTeamById() throws Exception {
        given()
                .when()
                .get("api/teams/teams/{id}", 6L)
                .then()
                .statusCode(SC_BAD_REQUEST)
                .body("message", isEmptyOrNullString());
    }

    @Test
    public void teamByUrnNotExistent() throws Exception {
        given()
                .when()
                .get("api/teams/teams/{id}", -1L)
                .then()
                .statusCode(SC_NOT_FOUND);
    }

    @Test
    public void teamByUrnNoMemberships() throws Exception {
        given()
                .header("name-id", "not-a-member")
                .when()
                .get("api/teams/teams/{id}", 1L)
                .then()
                .statusCode(SC_OK)
                .body("description", equalTo("we are riders"))
                .body("memberships", isEmptyOrNullString())
                .body("role", isEmptyOrNullString())
                .body("admins.name", hasItems("John Doe"))
                .body("admins.email", hasItems("john.doe@example.org"));
    }

    @Test
    public void teamExistsByNameFalse() throws Exception {
        boolean exists = given()
                .param("name", "nope")
                .when()
                .get("api/teams/team-exists-by-name")
                .as(Boolean.class);
        assertEquals(false, exists);
    }

    @Test
    public void teamExistsByNameError() throws Exception {
        given()
                .param("name", "malpura")
                .when()
                .get("api/teams/team-exists-by-name")
                .then()
                .statusCode(SC_INTERNAL_SERVER_ERROR);
    }

    @Test
    public void teamExistsByNameTrue() throws Exception {
        boolean exists = given()
                .param("name", "RIdErS")
                .when()
                .get("api/teams/team-exists-by-name")
                .as(Boolean.class);
        assertEquals(true, exists);
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
                .body("size()", is(3))
                .body("id", hasItems(1, 3, 4))
                .body("name", hasItems("riders", "gliders", "masters"))
                .body("role", hasItems("ADMIN", null, "ADMIN"));
    }

    @Test
    public void teamAutocompleteIllegalArgument() throws Exception {
        given()
                .header("name-id", "urn:collab:person:surfnet.nl:tdoe")
                .param("query", "E ")
                .when()
                .get("api/teams/teams")
                .then()
                .statusCode(SC_BAD_REQUEST)
                .body("exception", equalTo(IllegalSearchParamException.class.getName()));
    }

    @Test
    public void createTeam() throws Exception {
        String urn = "demo:openconext:org:new_team_name";
        given()
                .body(new NewTeamProperties("new team name", "Team champions ", null, true,
                        null, null, Language.DUTCH))
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
    public void createTeamWithAdminInvitation() throws Exception {
        String urn = "demo:openconext:org:new_team_name";
        String email = "second_admin@test.org";
        String invitationMessage = "Please join";

        given()
                .body(new NewTeamProperties("new team name", "Team champions ", null, true,
                        email, invitationMessage, Language.DUTCH))
                .header(CONTENT_TYPE, "application/json")
                .when()
                .post("api/teams/teams")
                .then()
                .statusCode(SC_OK)
                .body("urn", equalTo(urn))
                .body("invitations.size()", equalTo(1))
                .body("invitations[0].email", equalTo(email))
                .body("invitations[0].intendedRole", equalTo("ADMIN"))
                .body("invitations[0].language", equalTo("DUTCH"))
                .body("invitations[0].invitationMessages.size()", equalTo(1))
                .body("invitations[0].invitationMessages[0].message", equalTo(invitationMessage));
    }

    @Test
    public void createTeamInvalidTeamName() throws Exception {
        given()
                .body(new Team("urn", "invalid $", null, true, null))
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
                .body(new Team("urn", "riders", null, true, null))
                .header(CONTENT_TYPE, "application/json")
                .when()
                .post("api/teams/teams")
                .then()
                .statusCode(SC_BAD_REQUEST)
                .body("exception", equalTo(DuplicateTeamNameException.class.getName()));
    }

    @Test
    public void createTeamAsGuest() throws Exception {
        given()
                .body(new Team("urn", "valid", null, true, null))
                .header(CONTENT_TYPE, "application/json")
                .header("is-member-of", "guest-org")
                .when()
                .post("api/teams/teams")
                .then()
                .statusCode(SC_FORBIDDEN)
                .body("message", nullValue());
    }

    @Test
    public void updateTeam() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .body(new TeamProperties(1L, "changed", "personalNote", false, true))
                .when()
                .put("api/teams/teams")
                .then()
                .statusCode(SC_OK);

        Team team = teamRepository.findByUrn("demo:openconext:org:riders").get();
        assertEquals("changed", team.getDescription());
        assertEquals("personalNote", team.getPersonalNote());
        //name is immutable
        assertEquals("riders", team.getName());
        assertFalse(team.isViewable());
        assertTrue(team.isPublicLinkDisabled());
    }

    @Test
    public void updateTeamAsGuest() throws Exception {
        given()
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .header("is-member-of", "guest-org")
                .header(CONTENT_TYPE, "application/json")
                .body(new TeamProperties(2L, null, null, true, false))
                .when()
                .put("api/teams/teams")
                .then()
                .statusCode(SC_FORBIDDEN);
    }

    @Test
    public void updateTeamWithMemberRole() throws Exception {
        given()
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .header(CONTENT_TYPE, "application/json")
                .body(new TeamProperties(2L, null, null, true, false))
                .when()
                .put("api/teams/teams")
                .then()
                .statusCode(SC_BAD_REQUEST)
                .body("exception", equalTo(IllegalMembershipException.class.getName()));
    }

    @Test
    public void updateTeamWithoutBeingMember() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .body(new TeamProperties(2L, null, null, true, false))
                .when()
                .put("api/teams/teams")
                .then()
                .statusCode(SC_BAD_REQUEST)
                .body("exception", equalTo(NotAllowedException.class.getName()));
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

        assertFalse(teamRepository.findByUrn("demo:openconext:org:riders").isPresent());
    }

}