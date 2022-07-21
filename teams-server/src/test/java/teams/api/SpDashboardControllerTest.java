package teams.api;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import teams.AbstractApplicationTest;
import teams.Scheduler;
import teams.domain.*;
import teams.exception.ResourceNotFoundException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.StreamSupport;

import static io.restassured.RestAssured.given;
import static java.util.stream.Collectors.toList;
import static org.apache.http.HttpStatus.SC_CREATED;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

public class SpDashboardControllerTest extends AbstractApplicationTest {

    @Value("${sp_dashboard.person-urn}")
    private String spDashboardUser;

    @Autowired
    private Scheduler scheduler;

    @Test
    public void createTeam() {
        String urn = "demo:openconext:org:new_team_name";
        given()
                .auth().preemptive().basic("spdashboard", "secret")
                .body(new NewTeamProperties("new team name", "Team champions ", null, true, true,false,
                        Collections.singletonMap("test@test.com", "ADMIN"), Role.ADMIN.name(), "Please..", Language.DUTCH))
                .header(CONTENT_TYPE, "application/json")
                .when()
                .post("api/spdashboard/teams")
                .then()
                .statusCode(SC_OK)
                .body("urn", equalTo(urn));

        Team team = teamRepository.findByUrn(urn).get();
        assertEquals(0, team.getMemberships().size());

        Set<Invitation> invitations = team.getInvitations();
        assertEquals(1, invitations.size());

        Invitation invitation = invitations.iterator().next();
        assertEquals("test@test.com", invitation.getEmail());
        assertEquals(Role.ADMIN, invitation.getIntendedRole());
    }

    @Test
    public void changeMembership() {
        MembershipProperties body = new MembershipProperties(6L, Role.ADMIN);

        given()
                .header(CONTENT_TYPE, "application/json")
                .auth().preemptive().basic("spdashboard", "secret")
                .body(body)
                .when()
                .put("api/spdashboard/memberships")
                .then()
                .statusCode(SC_CREATED);

        Membership membership = membershipRepository.findById(6L).get();
        assertEquals(Role.ADMIN, membership.getRole());
    }

    @Test
    public void resend() {
        ClientResendInvitation resendInvitation = new ClientResendInvitation(1L, "Second invitation");

        given()
                .header(CONTENT_TYPE, "application/json")
                .auth().preemptive().basic("spdashboard", "secret")
                .body(resendInvitation)
                .when()
                .put("api/spdashboard/invites")
                .then()
                .statusCode(SC_CREATED);

        Invitation invitation = invitationRepository.findById(resendInvitation.getId()).get();
        assertEquals(2, invitation.getInvitationMessages().size());
    }

    @Test
    public void deleteMembership() throws Exception {
        given()
                .header(CONTENT_TYPE, "application/json")
                .auth().preemptive().basic("spdashboard", "secret")
                .when()
                .delete("api/spdashboard/memberships/{id}", 6)
                .then()
                .statusCode(SC_CREATED);

        Optional<Membership> membershipOptional = membershipRepository.findByUrnTeamAndUrnPerson(
                "demo:openconext:org:giants", "urn:collab:person:surfnet.nl:tdoe");
        assertFalse(membershipOptional.isPresent());
    }

    @Test
    public void teamByFullUrn() {
        String urn = "demo:openconext:org:riders";
        Map team = given()
                .header(CONTENT_TYPE, "application/json")
                .auth().preemptive().basic("spdashboard", "secret")
                .when()
                .get("api/spdashboard/teams/{urn}", urn)
                .as(Map.class);
        assertEquals(urn, team.get("urn"));
        assertEquals(3, ((List) team.get("memberships")).size());
        assertEquals(1, ((List) team.get("invitations")).size());
    }

    @Test
    public void teamByFullUrnInternal() {
        String urn = "demo:openconext:org:riders";
        Map team = given()
                .header(CONTENT_TYPE, "application/json")
                .auth().preemptive().basic("spdashboard", "secret")
                .when()
                .get("internal/teams/{urn}", urn)
                .as(Map.class);
        assertEquals(urn, team.get("urn"));
        assertEquals(3, ((List) team.get("memberships")).size());
        assertEquals(1, ((List) team.get("invitations")).size());
    }

    @Test
    public void teamByFullUrn404() {
        String urn = "urn:collab:group:demo.openconext.org:demo:openconext:org:nope";
        given()
                .header(CONTENT_TYPE, "application/json")
                .auth().preemptive().basic("spdashboard", "secret")
                .when()
                .get("api/spdashboard/teams/{urn}", urn)
                .then()
                .statusCode(404);
    }

    @Test
    public void invitations() {
        ClientInvitation clientInvitation = new ClientInvitation(
                2L, Role.ADMIN, Arrays.asList("test@test.org", "test2@test.org"),
                Instant.now().plus(365, ChronoUnit.DAYS), "Please join", null, Language.ENGLISH);
        given()
                .header(CONTENT_TYPE, "application/json")
                .auth().preemptive().basic("spdashboard", "secret")
                .body(clientInvitation)
                .when()
                .post("api/spdashboard/invites")
                .then()
                .statusCode(SC_CREATED);

        List<Invitation> invitations = StreamSupport.stream(invitationRepository.findAll().spliterator(), false)
                .filter(i -> i.getTeam().getId().equals(clientInvitation.getTeamId()) && i.getInvitationHash().length() > 150)
                .collect(toList());
        assertEquals(2, invitations.size());

        Invitation invitation = invitations.get(0);
        assertEquals(Language.ENGLISH, invitation.getLanguage());

        Set<InvitationMessage> invitationMessages = invitation.getInvitationMessages();
        assertEquals(1, invitationMessages.size());
        InvitationMessage invitationMessage = invitationMessages.iterator().next();
        invitationMessage.getMessage().equals("Please join");
    }

    @Test
    public void deleteTeam() {
        given()
                .header(CONTENT_TYPE, "application/json")
                .auth().preemptive().basic("spdashboard", "secret")
                .when()
                .delete("api/spdashboard/teams/{id}", 1)
                .then()
                .statusCode(SC_CREATED);

        assertFalse(teamRepository.findByUrn("demo:openconext:org:riders").isPresent());
    }

    @Test
    public void testRemoveOrphanPersons() {
        //First ensure the dashboard user is created
        given()
                .auth().preemptive().basic("spdashboard", "secret")
                .body(new NewTeamProperties("new team name", "Team champions ", null, true, true,false,
                        Collections.singletonMap("test@test.com", "ADMIN"), Role.ADMIN.name(), "Please..", Language.DUTCH))
                .header(CONTENT_TYPE, "application/json")
                .when()
                .post("api/spdashboard/teams")
                .then()
                .statusCode(SC_OK);

        Person dashboardUser = personRepository.findByUrnIgnoreCase(spDashboardUser).orElseThrow(() -> new ResourceNotFoundException("N/A"));
        Instant thePast = Instant.now().minus(15, ChronoUnit.DAYS);
        dashboardUser.setLastLoginDate(thePast);
        personRepository.save(dashboardUser);

        int removed = scheduler.removeOrphanPersons();
        assertEquals(0, removed);
    }



}