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
import teams.domain.*;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;

import static com.icegreen.greenmail.util.GreenMailUtil.getBody;
import static java.util.Collections.singletonList;
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
        Team team = new Team("urn", "Champions", "description", true, null);
        Person person = new Person("urn", "John Doe", EMAIL, false);

        Invitation invitation = new Invitation(team, EMAIL, Role.ADMIN, Language.Dutch, null);
        invitation.addInvitationMessage(person, "Please join");

        mailBox.sendInviteMail(invitation);

        String body = mailBody();
        assertTrue(body.contains("Uitnodiging voor Champions"));
        assertTrue(body.contains("<strong>Persoonlijk bericht van John Doe:</strong><br>\"Please join\""));
        assertTrue(body.contains("<span><a href=\"http://localhost:8001/invitation/accept/"));
    }

    @Test
    public void sendJoinRequestMail() throws Exception {
        JoinRequest joinRequest = joinRequest();
        mailBox.sendJoinRequestMail(joinRequest, singletonList(EMAIL));

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
        mailBox.sendJoinRequestRejected(joinRequest());
        validateJoinRequestStatusMail("declined");
    }

    private void validateJoinRequestStatusMail(String status) throws IOException, MessagingException, InterruptedException {
        assertTrue(mailBody().contains(String.format("has been <strong>%s</strong>", status)));
    }

    private String mailBody() throws InterruptedException, MessagingException {
        return this.doMailBody(0);
    }

    //we send async
    private String doMailBody(int retryCount) throws InterruptedException, MessagingException {
        MimeMessage[] receivedMessages = greenMail.getReceivedMessages();
        if (receivedMessages.length == 0) {
            if (retryCount < 50) {
                Thread.sleep(100);
                return doMailBody(retryCount + 1);
            } else {
                throw new IllegalStateException(String.format("Mailbox timed out after {} ms", retryCount * 100));
            }
        }
        MimeMessage mimeMessage = receivedMessages[0];
        assertEquals(EMAIL, mimeMessage.getRecipients(Message.RecipientType.TO)[0].toString());
        return getBody(mimeMessage);
    }

    private JoinRequest joinRequest() {
        Person person = new Person("urn", "John Doe", EMAIL, false);
        Team team = new Team("urn", "name", TEAM_DESCRIPTION, true, null);
        return new JoinRequest(person, team, "Let me join");
    }
}