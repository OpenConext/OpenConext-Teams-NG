package teams.mail;

import com.icegreen.greenmail.junit.GreenMailRule;
import com.icegreen.greenmail.store.FolderException;
import com.icegreen.greenmail.util.ServerSetupTest;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import teams.AbstractApplicationTest;
import teams.domain.Invitation;
import teams.domain.JoinRequest;
import teams.domain.Language;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;

import static com.icegreen.greenmail.util.GreenMailUtil.getBody;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, value = {"spring.profiles.active=prod"})
public class MailBoxTest extends AbstractApplicationTest {

    private static final String EMAIL = "test@test.org";
    private static final String TEAM_DESCRIPTION = "name";

    @Autowired
    private MailBox mailBox;

    @Rule
    public final GreenMailRule greenMail = new GreenMailRule(ServerSetupTest.SMTP);

    @Before
    public void before() throws FolderException {
        greenMail.purgeEmailFromAllMailboxes();
    }

    @Test
    public void sendInviteMail() throws Exception {
        Team team = new Team("urn", "Champions", "description", true);
        Person person = new Person("urn", "John Doe", EMAIL, false);

        Invitation invitation = new Invitation(team, EMAIL, Role.ADMIN, Language.Dutch);
        invitation.addInvitationMessage(person, "Please join");

        mailBox.sendInviteMail(invitation);

        String body = mailBody();
        assertTrue(body.contains("Uitnodiging voor Champions"));
        assertTrue(body.contains("<strong>Persoonlijk bericht van John Doe:</strong><br>\"Please join\""));
        assertTrue(body.contains("<span><a href=\"http://localhost:8080/invitations/accept?key="));
    }

    @Test
    public void sendJoinRequestMail() throws Exception {
        JoinRequest joinRequest = joinRequest();
        mailBox.sendJoinRequestMail(joinRequest);

        String body = mailBody();
        assertTrue(body.contains(String.format("\"%s\"", joinRequest.getTeam().getHtmlDescription())));
        assertTrue(body.contains(String.format("\"%s\"", joinRequest.getHtmlMessage())));
        assertTrue(body.contains(String.format("<a href=\"mailto:%s\">%s</a> would like to join team",
            EMAIL, joinRequest.getPerson().getName())));
    }

    @Test
    public void sendJoinRequestAcceptedMail() throws Exception {
        mailBox.sendJoinRequestAccepted(joinRequest());
        validateJoinRequestStatusMail("accepted");
    }

    @Test
    public void sendJoinRequestDeclinedMail() throws Exception {
        mailBox.sendJoinRequestDenied(joinRequest());
        validateJoinRequestStatusMail("declined");
    }

    private void validateJoinRequestStatusMail(String status) throws IOException, MessagingException, InterruptedException {
        String body = mailBody();
        assertTrue(body.contains(String.format("Your <strong>request</strong> to join team %s has been <strong>%s</strong>", "name", status)));
    }

    private String mailBody() throws InterruptedException, MessagingException {
        //we send async
        Thread.sleep(1000);

        MimeMessage mimeMessage = greenMail.getReceivedMessages()[0];
        assertEquals(EMAIL, mimeMessage.getRecipients(Message.RecipientType.TO)[0].toString());
        return getBody(mimeMessage);
    }

    private JoinRequest joinRequest() {
        Person person = new Person("urn", "John Doe", EMAIL, false);
        Team team = new Team("urn", "name", TEAM_DESCRIPTION, true);
        return new JoinRequest(person, team, "Let me join");
    }
}