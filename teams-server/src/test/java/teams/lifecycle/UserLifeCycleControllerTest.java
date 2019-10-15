package teams.lifecycle;

import io.restassured.http.Header;
import org.junit.Test;
import teams.AbstractApplicationTest;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static java.util.stream.Collectors.toMap;
import static org.junit.Assert.assertEquals;

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
        LifeCycleResult result = doDeprovision(true, this.personUrn);
        assertLifeCycleResult(result);
    }

    @Test
    public void deprovision() {
        LifeCycleResult result = doDeprovision(false, this.personUrn);
        assertLifeCycleResult(result);

        result = doDeprovision(false, this.personUrn);
        assertEquals(0, result.getData().size());
    }

    @Test
    public void deprovisionNonExistentUser() {
        LifeCycleResult result = doDeprovision(false, "nope.nope");
        assertEquals(0, result.getData().size());
    }

    @Test
    public void contentNegotion() {
        LifeCycleResult result = given()
                .auth()
                .preemptive()
                .basic("life", "secret")
                .header(new Header("Accept", "application/json"))
                .when()
                .delete("deprovision/nope.h")
                .as(LifeCycleResult.class);
        assertEquals(0, result.getData().size());
    }

    private LifeCycleResult doDeprovision(boolean dryRun, String personUrn) {
        return given()
                .auth()
                .preemptive()
                .basic("life", "secret")
                .when()
                .delete("deprovision/{user}" + (dryRun ? "/dry-run" : ""), personUrn)
                .as(LifeCycleResult.class);
    }

    private void assertLifeCycleResult(LifeCycleResult result) {
        Map<String, String> map = result.getData().stream().collect(toMap(attr -> attr.getName(), attr -> attr.getValue()));
        assertEquals(6, map.size());
        assertEquals(map.get("email"), "unhappy@domain.net");
        assertEquals(map.get("joinRequest"), "orphans");
        assertEquals(map.get("lastLoginDate").substring(0, 10), "2018-05-17");
        assertEquals(map.get("membership"), "orphans");
        assertEquals(map.get("name"), "Unhappy User");
        assertEquals(map.get("urn"), "urn:collab:person:example.com:unhappy");
    }

}