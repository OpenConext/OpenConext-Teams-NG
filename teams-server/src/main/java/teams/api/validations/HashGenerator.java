package teams.api.validations;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Random;

public interface HashGenerator {

    default String generateHash() {
        Random secureRandom = new SecureRandom();
        byte[] aesKey = new byte[128];
        secureRandom.nextBytes(aesKey);
        String base64 = Base64.getEncoder().encodeToString(aesKey);
        try {
            return URLEncoder.encode(base64, "UTF-8").replaceAll("%", "");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }


}
