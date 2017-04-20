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
import static org.junit.Assert.assertEquals;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class ExternalTeamControllerTest extends AbstractApplicationTest implements Mocks, Seed {

    private String teamUrn = "nl:surfnet:diensten:gliders";

    @Test
    public void linkTeamToExternalTeam() throws Exception {
        List<ExternalTeam> externalTeams = Arrays.asList(
                externalTeam("urn:collab:group:example.org:name1"),
                externalTeam("urn:collab:group:example.org:name6"),
                externalTeam("urn:collab:group:example.org:name7")
        );
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:tdoe")
                .body(new ExternalTeamProperties(3L, externalTeams))
                .when()
                .put("api/teams/external")
                .then()
                .statusCode(SC_OK)
                .body("externalTeams.identifier",
                        hasItems(externalTeams.stream().map(ExternalTeam::getIdentifier).toArray()));


        List<ExternalTeam> externalTeamsFromDB = externalTeamRepository.findByTeamsUrn(teamUrn);
        assertEquals(3, externalTeams.size());
        assertExternalTeam(
                externalTeamByIdentifier("urn:collab:group:example.org:name1", externalTeamsFromDB), 2);
        assertExternalTeam(
                externalTeamByIdentifier("urn:collab:group:example.org:name6", externalTeamsFromDB), 1);
        assertExternalTeam(
                externalTeamByIdentifier("urn:collab:group:example.org:name6", externalTeamsFromDB), 1);
    }

    @Test
    public void delinkTeamFromExternalTeam() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:tdoe")
                .when()
                .delete(String.format("api/teams/external/%s/%s", 2, 2))
                .then()
                .statusCode(SC_OK)
                .body("externalTeams.size()", equalTo(0));

        assertEquals(0, externalTeamRepository.findByTeamsUrn("nl:surfnet:diensten:giants").size());
    }

    private void assertExternalTeam(ExternalTeam externalTeam, int expectedTeamSize) {
        Set<Team> teams = externalTeam.getTeams();
        assertEquals(expectedTeamSize, teams.size());
        assertEquals(1, teams.stream().filter(team -> team.getUrn().equals(teamUrn)).count());
    }

    private ExternalTeam externalTeamByIdentifier(String identifier, List<ExternalTeam> externalTeams) {
        return externalTeams.stream().filter(externalTeam -> externalTeam.getIdentifier().equals(identifier))
                .findFirst().get();
    }
}
