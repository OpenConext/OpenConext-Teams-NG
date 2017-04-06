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
import teams.domain.Language;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import static com.icegreen.greenmail.util.GreenMailUtil.getBody;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, value = {"spring.profiles.active=prod"})
public class MailBoxTest extends AbstractApplicationTest {

    private static final String EMAIL = "test@test.org";

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
    }


    private String mailBody() throws InterruptedException, MessagingException {
        //we send async
        Thread.sleep(500);

        MimeMessage mimeMessage = greenMail.getReceivedMessages()[0];
        assertEquals(EMAIL, mimeMessage.getRecipients(Message.RecipientType.TO)[0].toString());
        return getBody(mimeMessage);
    }

}