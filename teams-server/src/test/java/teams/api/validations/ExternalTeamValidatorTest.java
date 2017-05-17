package teams.api.validations;

import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;
import teams.Seed;
import teams.api.ExternalTeamController;
import teams.domain.ExternalTeam;
import teams.domain.FederatedUser;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalLinkExternalTeamException;

import java.util.Collections;

import static java.util.Collections.singletonList;
import static org.junit.Assert.assertNotNull;

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

    @Test
    public void isAllowedToLinkExternalTeam() throws Exception {
        subject.isAllowedToLinkExternalTeam(Role.ADMIN, team(), federatedUser());
    }

    @Test(expected = IllegalLinkExternalTeamException.class)
    public void isAllowedToLinkExternalTeamNotAllowed() throws Exception {
        subject.isAllowedToLinkExternalTeam(Role.MEMBER, team(), federatedUser());
    }

    @Test
    public void externalTeamFromFederatedUser() throws Exception {
        FederatedUser federatedUser = new FederatedUser(person("urn"), "nope", "OC",
                singletonList(externalTeam("identifier")), Collections.emptyMap());
        ExternalTeam externalTeam = subject.externalTeamFromFederatedUser(federatedUser, "identifier");
        assertNotNull(externalTeam);
    }

    @Test(expected = IllegalLinkExternalTeamException.class)
    public void externalTeamFromFederatedUserNotMember() throws Exception {
        FederatedUser federatedUser = new FederatedUser(person("urn"), "nope", "OC",
                singletonList(externalTeam("nope")), Collections.emptyMap());
        ExternalTeam externalTeam = subject.externalTeamFromFederatedUser(federatedUser, "identifier");
        assertNotNull(externalTeam);
    }

}