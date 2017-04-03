package teams.voot;

import io.restassured.response.ValidatableResponse;
import io.restassured.specification.RequestSpecification;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Value;
import teams.AbstractApplicationTest;

import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItems;

public class VootApiControllerTest extends AbstractApplicationTest {

    private String contextPath = "/api/voot/";

    @Value("${voot.api.user}")
    protected String user;

    @Value("${voot.api.password}")
    protected String password;

    @Test
    public void findByLocalGroupId() throws Exception {
        start("group/nl:surfnet:diensten:giants")
            .body("displayName", equalTo("giants"));
    }

    @Test
    public void findByLocalGroupIdNonExistent() throws Exception {
        start("group/nl:surfnet:diensten:nope", SC_NOT_FOUND);
    }

    @Test
    public void linkedLocalTeamsGroup() throws Exception {
        String[] params = {"externalGroupIds", "urn:collab:group:example.org:name1,urn:collab:group:example.org:name2"};
        start("linked-locals", Optional.of(params), SC_OK)
            .body("size()", equalTo(2))
            .body("displayName", hasItems("riders", "giants"));
    }

    @Test
    public void linkedExternalGroupIds() throws Exception {
        String[] params = {"teamId", "nl:surfnet:diensten:riders"};
        start("linked-externals", Optional.of(params), SC_OK)
            .body("size()", equalTo(2))
            .body("", hasItems("urn:collab:group:example.org:name1", "urn:collab:group:example.org:name2"));
    }

    @Test
    public void getMembers() throws Exception {
        start("members/nl:surfnet:diensten:giants")
            .body("size()", equalTo(4))
            .body("name", hasItems("Tracey Doe", "Mary Doe", "John Doe", "William Doe"));
    }

    @Test
    public void getAllGroups() throws Exception {
        start("groups")
            .body("size()", equalTo(3))
            .body("displayName", hasItems("riders", "giants", "gliders"));
    }

    @Test
    public void getGroupsForMember() throws Exception {
        start("user/urn:collab:person:surfnet.nl:tdoe/groups")
            .body("size()", equalTo(2))
            .body("displayName", hasItems("giants", "gliders"));
    }

    @Test
    public void getGroupsForMemberAndTeamUrn() throws Exception {
        start("/user/urn:collab:person:surfnet.nl:tdoe/groups/nl:surfnet:diensten:giants")
            //four properties, not elements
            .body("size()", equalTo(4))
            .body("displayName", equalTo("giants"));
    }

    @Test
    public void getGroupsForMemberAndTeamUrnNotExists() throws Exception {
        start("user/urn:collab:person:surfnet.nl:nope/groups/nl:surfnet:diensten:nope",  SC_NOT_FOUND);
    }

    private ValidatableResponse start(String path) {
        return start(path, Optional.empty(), 200);
    }

    private ValidatableResponse start(String path, int statusCode) {
        return start(path, Optional.empty(), statusCode);
    }

    private ValidatableResponse start(String path, Optional<String[]> paramsOptional, int statusCode) {
        RequestSpecification specification = given()
            .auth().preemptive().basic(user, password);
        paramsOptional.ifPresent(params -> specification.queryParam(params[0], params[1]));
        String fullPath = contextPath + path;
        return specification
            .when()
            .get(fullPath)
            .then()
            .statusCode(statusCode);
    }

}
