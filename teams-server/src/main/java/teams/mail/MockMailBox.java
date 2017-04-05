package teams.mail;

import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.util.FileCopyUtils;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.File;
import java.io.IOException;

public class MockMailBox extends MailBox {

    public MockMailBox() {
        super("test@surfnet.nl");
    }

    @Override
    protected void doSendMail(MimeMessage message) {
        //nope
    }

    @Override
    protected void setText(String html, MimeMessageHelper helper) throws MessagingException {
        try {
            String osName = System.getProperty("os.name").toLowerCase();
            if (osName.contains("mac os x")) {
                openInBrowser(html);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void openInBrowser(String html) throws IOException {
        File tempFile = File.createTempFile("javamail", ".html");
        FileCopyUtils.copy(html.getBytes(), tempFile);
        Runtime.getRuntime().exec("open " + tempFile.getAbsolutePath());
    }
}