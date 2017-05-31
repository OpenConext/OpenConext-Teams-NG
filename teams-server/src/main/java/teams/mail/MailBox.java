package teams.mail;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.MustacheFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import teams.domain.Invitation;
import teams.domain.JoinRequest;
import teams.domain.Language;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MailBox {

    private static final String TITLE = "title";

    private JavaMailSender mailSender;
    private String baseUrl;
    private String emailFrom;
    private String productName;
    private MailParameters mailParameters;

    private final MustacheFactory mustacheFactory = new DefaultMustacheFactory();

    public MailBox(JavaMailSender mailSender, String emailFrom, String baseUrl, String productName, boolean openConextMail) {
        this.mailSender = mailSender;
        this.emailFrom = emailFrom;
        this.baseUrl = baseUrl;
        this.productName = productName;
        this.mailParameters = new MailParameters(openConextMail);
    }

    public void sendInviteMail(Invitation invitation) throws MessagingException, IOException {
        String languageCode = invitation.getLanguage().getLanguageCode();
        String title = String.format("%s %s ",
                languageCode.equals(Language.DUTCH.getLanguageCode()) ? "Uitnodiging voor" : "Invitation for",
                invitation.getTeam().getName());

        Map<String, Object> variables = new HashMap<>();
        variables.put(TITLE, title);
        variables.put("invitation", invitation);
        variables.put("invitationMessage", invitation.getLatestInvitationMessage());
        variables.put("baseUrl", baseUrl);
        variables.put("mailParameters", mailParameters);
        sendMail(
                String.format("mail_templates/invitation_%s.html", languageCode),
                title,
                variables,
                invitation.getEmail());
    }

    public void sendJoinRequestMail(JoinRequest joinRequest, List<String> admins) throws MessagingException, IOException {
        Map<String, Object> variables = new HashMap<>();
        variables.put(TITLE, productName);
        variables.put("joinRequest", joinRequest);
        variables.put("baseUrl", baseUrl);
        variables.put("mailParameters", mailParameters);
        sendMail(
                "mail_templates/join_request.html",
                String.format("Membership request for %s", joinRequest.getTeam().getName()),
                variables,
                admins.toArray(new String[admins.size()]));
    }

    public void sendJoinRequestAccepted(JoinRequest joinRequest) throws IOException, MessagingException {
        doSendJoinRequestAcceptedOrRejected(joinRequest, "Your request has been accepted", "join_request_accepted.html");
    }

    public void sendJoinRequestRejected(JoinRequest joinRequest) throws IOException, MessagingException {
        doSendJoinRequestAcceptedOrRejected(joinRequest, "Your request has been declined", "join_request_declined.html");
    }

    private void doSendJoinRequestAcceptedOrRejected(JoinRequest joinRequest, String subject, String emailTemplate) throws MessagingException, IOException {
        Map<String, Object> variables = new HashMap<>();
        variables.put(TITLE, productName);
        variables.put("joinRequest", joinRequest);
        variables.put("baseUrl", this.baseUrl);
        variables.put("mailParameters", mailParameters);
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
