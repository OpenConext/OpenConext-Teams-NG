package teams.api.validations;

import org.junit.Test;

import static org.junit.Assert.assertTrue;

public class HashGeneratorTest implements HashGenerator {

    @Test
    public void testGenerateHash() throws Exception {
        String hash = generateHash(32, "UTF-8");
        int length = hash.length();
        assertTrue(length > 32 && length < 60);
    }

    @Test(expected = RuntimeException.class)
    public void testGenerateHashException() throws Exception {
        generateHash(32, "nope");
    }
}