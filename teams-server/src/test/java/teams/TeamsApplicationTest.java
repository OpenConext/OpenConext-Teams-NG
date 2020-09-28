package teams;

import org.junit.Test;

public class TeamsApplicationTest {

    @Test
    public void main() throws Exception {
        TeamsApplication.main(new String[]{"--server.port=8067"});
    }

}