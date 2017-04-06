package teams.mail;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Map;

/*
 * Thread-safe
 */
public class MailTemplateEngine {

    private final MustacheFactory mf = new DefaultMustacheFactory();

    public String mailTemplate(String templateName, Map<String, Object> context) throws IOException {
        Mustache mustache = mf.compile(templateName);
        StringWriter writer = new StringWriter();
        mustache.execute(writer, context).flush();
        return writer.toString();
    }

}
