package teams.lifecycle;

import org.junit.Test;
import teams.AbstractApplicationTest;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toMap;
import static org.junit.Assert.*;

public class UserLifeCycleControllerTest extends AbstractApplicationTest {

    private String personUrn = "urn:collab:person:example.com:unhappy";

    @Test
    public void preview() {
        LifeCycleResult result = given()
                .auth()
                .preemptive()
                .basic("life", "secret")
                .when()
                .get("deprovision/{user}", personUrn)
                .as(LifeCycleResult.class);
        assertLifeCycleResult(result);
    }

    @Test
    public void previewUnauthenticated() {
        given()
                .auth()
                .preemptive()
                .basic("life", "nope")
                .when()
                .get("deprovision/{user}", personUrn)
                .then()
                .statusCode(403);
    }

    @Test
    public void dryRun() {
        LifeCycleResult result = doDeprovision(true);
        assertLifeCycleResult(result);
    }

    @Test
    public void deprovision() {
        LifeCycleResult result = doDeprovision(false);
        assertLifeCycleResult(result);

        result = doDeprovision(false);
        assertEquals(0, result.getData().size());
    }

    private LifeCycleResult doDeprovision(boolean dryRun) {
        return given()
                .auth()
                .preemptive()
                .basic("life", "secret")
                .when()
                .delete("deprovision/{user}" + (dryRun ? "/dry-run" : ""), this.personUrn)
                .as(LifeCycleResult.class);
    }

    private void assertLifeCycleResult(LifeCycleResult result) {
        Map<String, String> map = result.getData().stream().collect(toMap(attr -> attr.getName(), attr -> attr.getValue()));
        assertEquals(6 ,map.size());
        assertEquals(map.get("email"), "unhappy@domain.net");
        assertEquals(map.get("joinRequest"), "orphans");
        assertEquals(map.get("lastLoginDate"), "2018-05-17T07:32:12Z");
        assertEquals(map.get("membership"), "orphans");
        assertEquals(map.get("name"), "Unhappy User");
        assertEquals(map.get("urn"), "urn:collab:person:example.com:unhappy");
    }

}