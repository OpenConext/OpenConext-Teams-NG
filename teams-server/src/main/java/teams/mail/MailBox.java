package teams.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import teams.domain.JoinRequest;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

public class MailBox {

    @Autowired
    private JavaMailSender mailSender;

    private String emailFrom;

    private MailTemplateEngine templateEngine = new MailTemplateEngine();

    public MailBox(String emailFrom) {
        this.emailFrom = emailFrom;
    }

    public void sendJoinRequestMail(JoinRequest joinRequest) {
        Map<String, Object> variables = new HashMap<>();
//        variables.put("user", user);
//        variables.put("confirmationHash", baseUrl + "/hypotheken/homecatcher/userProfile/c/4/7?key=" + user.getConfirmationHash());

        sendMail("mail/" + "some", "TODO", joinRequest.getPerson().getEmail(), variables);
    }

    private void sendMail(String templateName, String subject, String to, Map<String, Object> variables) {
        variables.put("current_date", LocalDate.now());

        String html = templateEngine.mailTemplate(templateName, variables);

        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, false);
            helper.setSubject(subject);
            helper.setTo(to);
            setText(html, helper);
            helper.setFrom(emailFrom);
            doSendMail(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    protected void setText(String html, MimeMessageHelper helper) throws MessagingException {
        helper.setText(html, true);
    }

    protected void doSendMail(MimeMessage message) {
        new Thread(() -> mailSender.send(message)).start();
    }

}
