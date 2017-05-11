package teams.api;

import org.junit.Test;
import org.springframework.boot.test.context.SpringBootTest;
import teams.AbstractApplicationTest;
import teams.Mocks;
import teams.Seed;
import teams.domain.ExternalTeam;
import teams.domain.ExternalTeamProperties;
import teams.domain.Team;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItems;
import static org.hamcrest.Matchers.isEmptyString;
import static org.junit.Assert.assertEquals;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ExternalTeamControllerTest extends AbstractApplicationTest implements Mocks, Seed {

    private String teamUrn = "nl:surfnet:diensten:gliders";

    @Test
    public void linkedTeams() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .when()
                .get("api/teams/external-teams/linked-teams")
                .then()
                .statusCode(SC_OK)
                .body("'urn:collab:group:example.org:name1'.name", hasItems("riders"))
                .body("'urn:collab:group:example.org:name2'.name", hasItems("riders", "giants"));
    }

    @Test
    public void linkTeamToExternalTeam() throws Exception {
        String externalTeamIdentifier = "urn:collab:group:example.org:name6";
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:tdoe")
                .body(new ExternalTeamProperties(3L, externalTeamIdentifier))
                .when()
                .put("api/teams/external-teams/link")
                .then()
                .statusCode(SC_OK)
                .body("externalTeams.identifier",
                        hasItems(externalTeamIdentifier));


        List<ExternalTeam> externalTeams = externalTeamRepository.findByTeamsUrn(teamUrn);
        assertEquals(1, externalTeams.size());

        Set<Team> teams = externalTeams.get(0).getTeams();
        assertEquals(1, teams.size());
        assertEquals(1, teams.iterator().next().getExternalTeams().size());
    }

    @Test
    public void delinkTeamFromExternalTeamOrphanExternalTeam() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:tdoe")
                .body(new ExternalTeamProperties(2L, "urn:collab:group:example.org:name2"))
                .when()
                .put("api/teams/external-teams/delink")
                .then()
                .statusCode(SC_OK)
                .body("externalTeams.size()", equalTo(0));

        assertEquals(0, externalTeamRepository.findByTeamsUrn("nl:surfnet:diensten:giants").size());
    }

    @Test
    public void delinkTeamFromExternalTeam() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .body(new ExternalTeamProperties(1L, "urn:collab:group:example.org:name2"))
                .when()
                .put("api/teams/external-teams/delink")
                .then()
                .statusCode(SC_OK)
                .body("externalTeams.size()", equalTo(1));

        assertEquals(1, externalTeamRepository.findByTeamsUrn("nl:surfnet:diensten:riders").size());
    }

}
