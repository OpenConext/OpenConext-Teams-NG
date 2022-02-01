package teams;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.audit.AuditAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.metrics.MetricsAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.trace.http.HttpTraceAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.freemarker.FreeMarkerAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {
        FreeMarkerAutoConfiguration.class,
        AuditAutoConfiguration.class,
        HttpTraceAutoConfiguration.class,
        MetricsAutoConfiguration.class})
@EnableScheduling
public class TeamsApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeamsApplication.class, args);
    }
}