package teams.lifecycle;

import org.junit.Test;
import teams.AbstractApplicationTest;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

import static io.restassured.RestAssured.given;
import static java.util.stream.Collectors.toList;
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
        LifeCycleResult expected = getExpectedLifeCycleResult();

        assertEquals(expected, result);
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
        LifeCycleResult expected = getExpectedLifeCycleResult();

        assertEquals(expected, result);
    }

    @Test
    public void deprovision() {
        LifeCycleResult result = doDeprovision(false);
        LifeCycleResult expected = getExpectedLifeCycleResult();

        assertEquals(expected, result);

        result = doDeprovision(false);
        expected = new LifeCycleResult();

        assertEquals(expected, result);
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

    private LifeCycleResult getExpectedLifeCycleResult() {
        LifeCycleResult expected = new LifeCycleResult();
        List<Attribute> attributes = Arrays.asList(
                new Attribute("email", "unhappy@domain.net"),
                new Attribute("joinRequest", "orphans"),
                new Attribute("lastLoginDate", "2018-05-17T07:32:12Z"),
                new Attribute("membership", "orphans"),
                new Attribute("name", "Unhappy User"),
                new Attribute("urn", "urn:collab:person:example.com:unhappy"))
                .stream()
                .sorted(Comparator.comparing(Attribute::getName))
                .collect(toList());
        expected.setData(attributes);
        return expected;
    }

}