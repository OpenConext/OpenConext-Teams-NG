package teams.api;

import org.junit.Test;
import teams.AbstractApplicationTest;
import teams.domain.Membership;
import teams.domain.MembershipExpiryDate;
import teams.domain.MembershipProperties;
import teams.domain.Role;
import teams.exception.NotAllowedException;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.*;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class MembershipControllerTest extends AbstractApplicationTest {

    @Test
    public void membership() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:jdoe")
                .get("api/teams/memberships/{teamId}", 1L)
                .then()
                .statusCode(SC_OK)
                .body("role", equalTo("ADMIN"));
    }

    @Test
    public void noMembership() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:no-member")
                .get("api/teams/memberships/{teamId}", 1L)
                .then()
                .statusCode(SC_BAD_REQUEST)
                .body("exception", equalTo(NotAllowedException.class.getName()));
    }

    @Test
    public void changeMembership() throws Exception {
        MembershipProperties body = new MembershipProperties(6L, Role.ADMIN);

        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .body(body)
                .when()
                .put("api/teams/memberships")
                .then()
                .statusCode(SC_OK);

        Membership membership = membershipRepository.findByUrnTeamAndUrnPerson(
                "demo:openconext:org:giants", "urn:collab:person:surfnet.nl:tdoe").get();
        assertEquals(Role.ADMIN, membership.getRole());
    }

    @Test
    public void changeMembershipNotExist() throws Exception {
        MembershipProperties body = new MembershipProperties(99L, Role.ADMIN);

        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .body(body)
                .when()
                .put("api/teams/memberships")
                .then()
                .statusCode(SC_NOT_FOUND);
    }

    @Test
    public void deleteMembership() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .when()
                .delete("api/teams/memberships/{id}", 6)
                .then()
                .statusCode(SC_OK);

        Optional<Membership> membershipOptional = membershipRepository.findByUrnTeamAndUrnPerson(
                "demo:openconext:org:giants", "urn:collab:person:surfnet.nl:tdoe");
        assertFalse(membershipOptional.isPresent());
    }

    @Test
    public void deleteMembershipNotExists() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .when()
                .delete("api/teams/memberships/{id}", 999)
                .then()
                .statusCode(SC_NOT_FOUND);
    }

    @Test
    public void changeExpiryDate() {
        Instant expiryDate = Instant.now().plus(30, ChronoUnit.DAYS);
        MembershipExpiryDate body = new MembershipExpiryDate(6L, expiryDate);

        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .body(body)
                .when()
                .put("api/teams/memberships/expiry-date")
                .then()
                .statusCode(SC_OK);

        Membership membership = membershipRepository.findByUrnTeamAndUrnPerson(
                "demo:openconext:org:giants", "urn:collab:person:surfnet.nl:tdoe").get();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        assertEquals(format.format(Date.from(expiryDate)), format.format(Date.from(membership.getExpiryDate())));
    }

    @Test
    public void changeExpiryDateNotExist() throws Exception {
        MembershipExpiryDate body = new MembershipExpiryDate(99L, null);

        given()
                .header(CONTENT_TYPE, "application/json")
                .header("name-id", "urn:collab:person:surfnet.nl:mdoe")
                .body(body)
                .when()
                .put("api/teams/memberships/expiry-date")
                .then()
                .statusCode(SC_NOT_FOUND);
    }


}