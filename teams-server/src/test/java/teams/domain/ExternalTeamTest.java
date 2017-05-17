package teams.domain;

import org.junit.Test;
import teams.Seed;

import java.util.HashSet;
import java.util.Set;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class ExternalTeamTest implements Seed{
    @Test
    public void equals() throws Exception {
        Set<ExternalTeam> set = new HashSet<>();

        ExternalTeam externalTeam = externalTeam("identifier_1");
        set.add(externalTeam);
        set.add( externalTeam("identifier_1"));

        assertFalse(externalTeam.equals(null));
        assertFalse(externalTeam.equals("nope"));

        assertTrue(externalTeam.equals(externalTeam));
    }

}