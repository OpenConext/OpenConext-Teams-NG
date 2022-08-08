package teams.api.validations;

import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;
import teams.Seed;
import teams.api.InvitationController;
import teams.domain.*;
import teams.exception.*;

import java.io.UnsupportedEncodingException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class InvitationValidatorTest implements Seed {

    private InvitationValidator subject = new InvitationController();

    @Test(expected = InvitationExpiredException.class)
    public void invitationExpired() throws Exception {
        Invitation invitation = invitation(false, false);
        ReflectionTestUtils.setField(invitation, "timestamp", 1000);
        subject.validateInvitation(invitation, person());
    }

    @Test(expected = InvitationAlreadyAcceptedException.class)
    public void invitationAlreadyAccepted() throws Exception {
        subject.validateInvitation(invitation(true, false), person());
    }

    @Test(expected = InvitationAlreadyAcceptedException.class)
    public void invitationPersonAlreadyMember() throws Exception {
        Invitation invitation = invitation(false, false);
        Person person = person();
        membership(Role.ADMIN, invitation.getTeam(), person);
        subject.validateInvitation(invitation, person);
    }

    @Test(expected = InvitationAlreadyDeclinedException.class)
    public void invitationAlreadyDeclined() throws Exception {
        subject.validateInvitation(invitation(false, true), person());
    }

    @Test
    public void membershipRequired() throws Exception {
        Team team = team();
        Person person = person("urn");
        membership(Role.ADMIN, team, person);

        subject.membershipRequired(team, person);
    }

    @Test(expected = IllegalInviteException.class)
    public void membershipRequiredException() throws Exception {
        Team team = team();
        Person person = person("urn");
        subject.membershipRequired(team, person);
    }

    @Test(expected = NotAllowedException.class)
    public void mustBeTeamAdminOrManagerNoMember() throws UnsupportedEncodingException {
        Invitation invitation = invitation(false, false);
        invitation.addInvitationMessage(person("urn"), "Please join");
        subject.mustBeTeamAdminOrManager(invitation,
                new FederatedUser(person("urn"), "urn:collab:group:demo.openconext.org:",
                        "OpenConext", Collections.emptyList(), Collections.emptyMap(), new HashMap<>()));
    }

    @Test(expected = NotAllowedException.class)
    public void mustBeTeamAdminOrManager() throws UnsupportedEncodingException {
        Invitation invitation = invitation(false, false);
        FederatedUser federatedUser =
                new FederatedUser(person("urn"), "urn:collab:group:demo.openconext.org:",
                        "OpenConext", Collections.emptyList(), Collections.emptyMap(), new HashMap<>());
        membership(Role.MEMBER, invitation.getTeam(), federatedUser.getPerson());
        invitation.addInvitationMessage(person("urn"), "Please join");

        subject.mustBeTeamAdminOrManager(invitation, federatedUser);
    }

    @Test(expected = IllegalInviteException.class)
    public void determineFutureRoleNoMembership() throws Exception {
        subject.determineFutureRole(team(), person(), Role.ADMIN);
    }

    @Test
    public void determineFutureRoleManager() throws Exception {
        doDetermineFutureRole(Role.MANAGER, Role.MEMBER);
    }

    @Test
    public void determineFutureRoleAdmin() throws Exception {
        doDetermineFutureRole(Role.ADMIN, Role.ADMIN);
    }

    @Test(expected = IllegalInviteException.class)
    public void determineFutureRoleMember() throws Exception {
        doDetermineFutureRole(Role.MEMBER, Role.ADMIN);
    }

    @Test(expected = IllegalInviteException.class)
    public void validateClientInvitationException() throws Exception {
        subject.validateClientInvitation(clientInvitation(Collections.emptyList(), null));
    }

    @Test
    public void validateClientInvitationEmails() throws Exception {
        subject.validateClientInvitation(clientInvitation(Collections.singletonList("test@org"), null));
    }

    @Test
    public void validateClientInvitationFile() throws Exception {
        subject.validateClientInvitation(clientInvitation(Collections.emptyList(), "test@org , test2@org"));
    }

    @Test(expected = IllegalInviteException.class)
    public void validateClientInvitationFileExpiryDatePast() throws Exception {
        subject.validateClientInvitation(
                clientInvitation(Collections.emptyList(), "test@org , test2@org", Instant.now().minus(5, ChronoUnit.DAYS)));
    }

    @Test
    public void validateClientInvitationFileExpiryDateFuture() throws Exception {
        subject.validateClientInvitation(
                clientInvitation(Collections.emptyList(), "test@org , test2@org", Instant.now().plus(5, ChronoUnit.DAYS)));
    }

    @Test
    public void emailsEmails() throws Exception {
        List<String> emails = subject.emails(clientInvitation(Collections.singletonList("test@org"), null));
        assertEquals(1, emails.size());
    }

    @Test
    public void emailsFile() throws Exception {
        List<String> emails = subject.emails(clientInvitation(new ArrayList<>(), "test@org , test2@org"));
        assertEquals(2, emails.size());
    }

    @Test
    public void emailsFileWithLineFeed() throws Exception {
        List<String> emails = subject.emails(clientInvitation(new ArrayList<>(), "a@a\n\rb@b\rc@c\nd@d"));
        assertEquals(4, emails.size());
    }

    private void doDetermineFutureRole(Role role, Role intendedRole) {
        Team team = team();
        Person person = person();
        new Membership(role, team, person, MembershipOrigin.INITIAL_ADMIN, "John Doe");
        assertEquals(intendedRole, subject.determineFutureRole(team, person, Role.ADMIN));
    }

    private Invitation invitation(boolean accepted, boolean declined) throws UnsupportedEncodingException {
        Invitation invitation = new Invitation(team(), "jdoe@example.com", Role.ADMIN, Language.DUTCH, null, null);
        ReflectionTestUtils.setField(invitation, "accepted", accepted);
        ReflectionTestUtils.setField(invitation, "declined", declined);
        return invitation;
    }

}