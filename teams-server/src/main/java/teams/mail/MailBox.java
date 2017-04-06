package teams.mail;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import teams.domain.Invitation;
import teams.domain.JoinRequest;
import teams.domain.Language;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

public class MailBox {

    private JavaMailSender mailSender;
    private String baseUrl;
    private String emailFrom;

    private MailTemplateEngine templateEngine = new MailTemplateEngine();
    private String teamsWhiteLabel;

    public MailBox(JavaMailSender mailSender, String emailFrom, String baseUrl, String teamsWhiteLabel) {
        this.mailSender = mailSender;
        this.emailFrom = emailFrom;
        this.baseUrl = baseUrl;
        this.teamsWhiteLabel = teamsWhiteLabel;
    }

    public void sendInviteMail(Invitation invitation) throws MessagingException {
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
            String.format("mail_templates/invitation_mail_%s.html", languageCode),
            title,
            invitation.getEmail(),
            variables);
    }

    public void sendJoinRequestMail(JoinRequest joinRequest) throws MessagingException {
        Map<String, Object> variables = new HashMap<>();
        variables.put("title", teamsWhiteLabel);
//        variables.put("user", user);
//        variables.put("confirmationHash", baseUrl + "/hypotheken/homecatcher/userProfile/c/4/7?key=" + user.getConfirmationHash());

        sendMail("mail/" + "some", "TODO", joinRequest.getPerson().getEmail(), variables);
    }

    public void sendInvitationAccepted(Invitation invitation) {

    }

    public void sendInvitationDenied(Invitation invitation) {

    }

    private void sendMail(String templateName, String subject, String to, Map<String, Object> variables) throws MessagingException {
        variables.put("current_date", LocalDate.now());

        String html = templateEngine.mailTemplate(templateName, variables);

        MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false);
            helper.setSubject(subject);
            helper.setTo(to);
            setText(html, helper);
            helper.setFrom(emailFrom);
            doSendMail(message);
    }

    protected void setText(String html, MimeMessageHelper helper) throws MessagingException {
        helper.setText(html, true);
    }

    protected void doSendMail(MimeMessage message) {
        new Thread(() -> mailSender.send(message)).start();
    }

}
