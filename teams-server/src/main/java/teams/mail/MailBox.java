package teams.mail;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.MustacheFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import teams.domain.FederatedUser;
import teams.domain.Invitation;
import teams.domain.JoinRequest;
import teams.domain.Language;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.io.StringWriter;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MailBox {

    private static final String TITLE = "title";
    private static final String BASE_URL = "baseUrl";
    private static final String FEDERATED_USER = "federatedUser";

    private final JavaMailSender mailSender;
    private final String baseUrl;
    private final String emailFrom;
    private final String productName;

    private final MustacheFactory mustacheFactory = new DefaultMustacheFactory();

    public MailBox(JavaMailSender mailSender, String emailFrom, String baseUrl, String productName) {
        this.mailSender = mailSender;
        this.emailFrom = emailFrom;
        this.baseUrl = baseUrl;
        this.productName = productName;
    }

    public void sendInviteMail(Invitation invitation, FederatedUser federatedUser) throws MessagingException, IOException {
        String languageCode = invitation.getLanguage().getLanguageCode();

        String title = String.format("%s %s ",
                languageCode.equals(Language.DUTCH.getLanguageCode()) ? "Uitnodiging voor" :
                        languageCode.equals(Language.ENGLISH.getLanguageCode()) ? "Invitation for" : "Convite para",
                invitation.getTeam().getName());

        Map<String, Object> variables = new HashMap<>();
        variables.put(TITLE, title);
        variables.put(FEDERATED_USER, federatedUser);
        variables.put("invitation", invitation);
        if (invitation.getMembershipExpiryDate() != null) {
            variables.put("membershipExpiryDate", new SimpleDateFormat("yyyy-MM-dd")
                    .format(Date.from(invitation.getMembershipExpiryDate())));
        }
        variables.put("invitationMessage", invitation.getLatestInvitationMessage());
        variables.put(BASE_URL, baseUrl);
        sendMail(
                String.format("mail_templates/invitation_%s.html", languageCode),
                title,
                variables,
                invitation.getEmail());
    }

    public void sendJoinRequestMail(JoinRequest joinRequest, List<String> admins, FederatedUser federatedUser) throws MessagingException, IOException {
        Map<String, Object> variables = new HashMap<>();
        variables.put(TITLE, productName);
        variables.put(FEDERATED_USER, federatedUser);
        variables.put("joinRequest", joinRequest);
        variables.put(BASE_URL, baseUrl);
        sendMail(
                "mail_templates/join_request.html",
                String.format("Membership request for %s", joinRequest.getTeam().getName()),
                variables,
                admins.toArray(new String[admins.size()]));
    }

    public void sendJoinRequestAccepted(JoinRequest joinRequest, FederatedUser federatedUser) throws IOException, MessagingException {
        doSendJoinRequestAcceptedOrRejected(joinRequest, "Your request has been accepted", "join_request_accepted.html", federatedUser);
    }

    public void sendJoinRequestRejected(JoinRequest joinRequest, FederatedUser federatedUser) throws IOException, MessagingException {
        doSendJoinRequestAcceptedOrRejected(joinRequest, "Your request has been declined", "join_request_declined.html", federatedUser);
    }

    private void doSendJoinRequestAcceptedOrRejected(JoinRequest joinRequest, String subject, String emailTemplate, FederatedUser federatedUser) throws MessagingException, IOException {
        Map<String, Object> variables = new HashMap<>();
        variables.put(TITLE, productName);
        variables.put(FEDERATED_USER, federatedUser);
        variables.put("joinRequest", joinRequest);
        variables.put(BASE_URL, this.baseUrl);
        sendMail(
                String.format("mail_templates/%s", emailTemplate),
                subject,
                variables,
                joinRequest.getPerson().getEmail());
    }

    private void sendMail(String templateName, String subject, Map<String, Object> variables, String... to) throws MessagingException, IOException {
        String html = this.mailTemplate(templateName, variables);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false);
        helper.setSubject(subject);
        helper.setTo(to);
        setText(html, helper);
        helper.setFrom(emailFrom);
        doSendMail(message);
    }

    protected void setText(String html, MimeMessageHelper helper) throws MessagingException, IOException {
        helper.setText(html, true);
    }

    protected void doSendMail(MimeMessage message) {
        new Thread(() -> mailSender.send(message)).start();
    }

    private String mailTemplate(String templateName, Map<String, Object> context) throws IOException {
        return mustacheFactory.compile(templateName).execute(new StringWriter(), context).toString();
    }

}
