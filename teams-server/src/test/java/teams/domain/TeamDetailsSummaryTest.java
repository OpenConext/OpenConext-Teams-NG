package teams.domain;

import org.junit.Test;
import teams.Seed;

import static org.junit.Assert.*;

public class TeamDetailsSummaryTest implements Seed{

    private TeamDetailsSummary summary = new TeamDetailsSummary(team(), federatedUser());

    @Test
    public void getMemberships() throws Exception {
        assertEquals(0, summary.getMemberships().size());
    }

}