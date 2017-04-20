package teams.api.validations;

import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;
import teams.Seed;
import teams.api.ExternalTeamController;
import teams.domain.ExternalTeam;
import teams.domain.Team;
import teams.exception.IllegalLinkExternalTeamException;

import static java.util.Arrays.asList;

public class ExternalTeamValidatorTest implements Seed {

    private ExternalTeamValidator subject = new ExternalTeamController();

    @Test
    public void externalTeamNotLinked() {
        Team team = team();
        ExternalTeam externalTeam = new ExternalTeam();
        subject.externalTeamNotLinked(team, externalTeam);
    }

    @Test(expected = IllegalLinkExternalTeamException.class)
    public void externalTeamNotLinkedException() {
        Team team = teamLinkedWithExternalTeam();
        subject.externalTeamNotLinked(team, team.getExternalTeams().iterator().next());
    }

    public Team teamLinkedWithExternalTeam() {
        Team team = team();
        ExternalTeam externalTeam = new ExternalTeam();
        ReflectionTestUtils.setField(externalTeam, "identifier", "identifier");
        team.getExternalTeams().add(externalTeam);
        return team;
    }

    @Test
    public void externalTeamLinked() {
        Team team = teamLinkedWithExternalTeam();
        subject.externalTeamLinked(team, team.getExternalTeams().iterator().next());
    }

    @Test(expected = IllegalLinkExternalTeamException.class)
    public void externalTeamLinkedException() {
        Team team = team();
        ExternalTeam externalTeam = new ExternalTeam();
        subject.externalTeamLinked(team, externalTeam);
    }

    @Test(expected = IllegalLinkExternalTeamException.class)
    public void externalTeamsMembershipException() {
        subject.externalTeamsMembership(
                asList(externalTeam("identifier_1")),
                asList(externalTeam("identifier_2")),
                "urn");
    }

    @Test
    public void externalTeamsMembership() {
        subject.externalTeamsMembership(
                asList(externalTeam("identifier_1")),
                asList(externalTeam("identifier_1")),
                "urn");
    }

}