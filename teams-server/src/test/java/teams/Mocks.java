package teams;

import org.apache.commons.io.IOUtils;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;

import static java.nio.charset.Charset.defaultCharset;

public interface Mocks {

    default String fromMocks(String fileName) throws IOException {
        return IOUtils.toString(new ClassPathResource("mocks/"+fileName).getInputStream(), defaultCharset());
    }

}
