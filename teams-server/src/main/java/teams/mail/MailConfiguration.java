package teams.mail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

@Configuration
@EnableConfigurationProperties(MailProperties.class)
public class MailConfiguration {

    @Value("${email.from}")
    private String emailFrom;

    @Value("${email.base-url}")
    private String baseUrl;

    @Value("${teams.product-name}")
    private String productName;

    @Autowired
    private JavaMailSender mailSender;

    @Bean
    public MailBox mailSenderProd() {
        return new MailBox(mailSender, emailFrom, baseUrl, productName);
    }

}
