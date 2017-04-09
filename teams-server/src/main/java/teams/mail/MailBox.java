package teams.mail;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import teams.domain.Invitation;
import teams.domain.JoinRequest;
import teams.domain.Language;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class MailBox {

    private JavaMailSender mailSender;
    private String baseUrl;
    private String emailFrom;
    private String teamsWhiteLabel;

    private MailTemplateEngine templateEngine = new MailTemplateEngine();

    public MailBox(JavaMailSender mailSender, String emailFrom, String baseUrl, String teamsWhiteLabel) {
        this.mailSender = mailSender;
        this.emailFrom = emailFrom;
        this.baseUrl = baseUrl;
        this.teamsWhiteLabel = teamsWhiteLabel;
    }

    public void sendInviteMail(Invitation invitation) throws MessagingException, IOException {
        String languageCode = invitation.getLanguage().getLanguageCode();
        String title = String.format("%s %s ",
            languageCode.equals(Language.Dutch.getLanguageCode()) ? "Uitnodiging voor" : "Invitation for",
            invitation.getTeam().getName());

        Map<String, Object> variables = new HashMap<>();
        variables.put("title", title);
        variables.put("invitation", invitation);
        variables.put("invitationMessage", invitation.getLatestInvitationMessage());
        variables.put("baseUrl", baseUrl);
        sendMail(
            String.format("mail_templates/invitation_%s.html", languageCode),
            title,
            invitation.getEmail(),
            variables);
    }

    public void sendJoinRequestMail(JoinRequest joinRequest) throws MessagingException, IOException {
        Map<String, Object> variables = new HashMap<>();
        variables.put("title", teamsWhiteLabel);
        variables.put("joinRequest", joinRequest);
        sendMail(
            "mail_templates/join_request.html",
            String.format("Membership request for %s", joinRequest.getTeamName()),
            joinRequest.getPerson().getEmail(),
            variables);
    }

    public void sendJoinRequestAccepted(JoinRequest joinRequest) throws IOException, MessagingException {
        doSendJoinRequestAcceptedOrDenied(joinRequest, "Your request has been accepted", "join_request_accepted.html");
    }

    public void sendJoinRequestDenied(JoinRequest joinRequest) throws IOException, MessagingException {
        doSendJoinRequestAcceptedOrDenied(joinRequest, "Your request has been declined", "join_request_declined.html");
    }

    private void doSendJoinRequestAcceptedOrDenied(JoinRequest joinRequest, String subject, String emailTemplate) throws MessagingException, IOException {
        Map<String, Object> variables = new HashMap<>();
        variables.put("title", teamsWhiteLabel);
        variables.put("joinRequest", joinRequest);
        sendMail(
            String.format("mail_templates/%s", emailTemplate),
            subject,
            joinRequest.getPerson().getEmail(),
            variables);
    }

    private void sendMail(String templateName, String subject, String to, Map<String, Object> variables) throws MessagingException, IOException {
        String html = templateEngine.mailTemplate(templateName, variables);

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

}
