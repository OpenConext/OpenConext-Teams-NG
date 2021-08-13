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

    @Value("${security.user.name}")
    protected String user;

    @Value("${security.user.password}")
    protected String password;

    @Test
    public void findByLocalGroupId() {
        start("group/demo:openconext:org:giants")
                .body("displayName", equalTo("giants"));
    }

    @Test
    public void findByFullyQualifiedGroupId() {
        start("group/urn:collab:group:demo.openconext.org:demo:openconext:org:giants")
                .body("displayName", equalTo("giants"));
    }

    @Test
    public void findByLocalGroupIdNonExistent() {
        start("group/demo:openconext:org:nope", SC_NOT_FOUND);
    }

    @Test
    public void linkedLocalTeamsGroup() {
        String[] params = {"externalGroupIds", "urn:collab:group:example.org:name1,urn:collab:group:example.org:name2"};
        start("linked-locals", Optional.of(params), SC_OK)
                .body("size()", equalTo(2))
                .body("displayName", hasItems("riders", "giants"));
    }

    @Test
    public void linkedExternalGroupIds() {
        String[] params = {"teamId", "demo:openconext:org:riders"};
        start("linked-externals", Optional.of(params), SC_OK)
                .body("size()", equalTo(2))
                .body("", hasItems("urn:collab:group:example.org:name1", "urn:collab:group:example.org:name2"));
    }

    @Test
    public void getMembers() {
        start("members/demo:openconext:org:giants")
                .body("size()", equalTo(3))
                .body("name", hasItems("Tracey Doe", "Mary Doe", "John Doe"));
    }

    @Test
    public void getMembersWithFullyQualifiedGroupName() throws Exception {
        start("members/urn:collab:group:demo.openconext.org:demo:openconext:org:giants")
                .body("size()", equalTo(3))
                .body("name", hasItems("Tracey Doe", "Mary Doe", "John Doe"));
    }

    @Test
    public void getAllGroups() {
        start("groups")
                .body("size()", equalTo(8))
                .body("displayName", hasItems("riders", "giants", "gliders", "masters", "wolves"));
    }

    @Test
    public void getGroupsForMember() {
        start("user/urn:collab:person:surfnet.nl:tdoe/groups")
                .body("size()", equalTo(2))
                .body("displayName", hasItems("giants", "gliders"))
                .body("membership", hasItems("admin", "admin"));
    }

    @Test
    public void getGroupsForMemberCaseInsentive() {
        start("user/urn:collab:person:surfnet.nl:TDOE/groups")
                .body("size()", equalTo(2))
                .body("displayName", hasItems("giants", "gliders"))
                .body("membership", hasItems("admin", "admin"));
    }

    @Test
    public void getGroupsForMemberAndTeamUrn() {
        start("user/urn:collab:person:surfnet.nl:tdoe/groups/demo:openconext:org:gliders")
                //four properties, not elements
                .body("size()", equalTo(4))
                .body("displayName", equalTo("gliders"))
                .body("membership", equalTo("admin"));
    }

    @Test
    public void getGroupsForMemberAndTeamUrnNotExists() {
        start("user/urn:collab:person:surfnet.nl:nope/groups/demo:openconext:org:nope", SC_NOT_FOUND);
    }

    private ValidatableResponse start(String path) {
        return start(path, Optional.empty(), SC_OK);
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
