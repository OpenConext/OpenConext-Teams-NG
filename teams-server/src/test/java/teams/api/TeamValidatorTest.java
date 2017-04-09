package teams.api;

import org.junit.Test;
import teams.Seed;
import teams.domain.FederatedUser;
import teams.domain.Membership;
import teams.domain.Role;
import teams.domain.Team;
import teams.domain.TeamDetailsSummary;
import teams.exception.DuplicateTeamNameException;
import teams.exception.IllegalMembershipException;

import java.util.Optional;

import static org.junit.Assert.assertEquals;

public class TeamValidatorTest implements Seed{

    private TeamValidator subject = new TeamController();

    @Test
    public void teamNameDuplicated() throws Exception {
        subject.teamNameDuplicated("name", Optional.empty());
    }

    @Test(expected = DuplicateTeamNameException.class)
    public void teamNameDuplicatedException() throws Exception {
        subject.teamNameDuplicated("name", Optional.of(team()));
    }

    @Test
    public void onlyAdminAllowed() throws Exception {
        subject.onlyAdminAllowed(Role.ADMIN, new FederatedUser(person()), team(), "test");
    }

    @Test(expected = IllegalMembershipException.class)
    public void onlyAdminAllowedException() throws Exception {
        subject.onlyAdminAllowed(Role.MANAGER, new FederatedUser(person()), team(), "test");
    }

    @Test
    public void lazyLoadTeam() throws Exception {
        Team team = team();
        assertEquals(team, subject.lazyLoadTeam(team, Role.ADMIN, new FederatedUser(person())));
    }

    @Test
    public void lazyLoadTeamMember() throws Exception {
        Team team = team();
        new Membership(Role.ADMIN, team, person("test") );
        TeamDetailsSummary summary = TeamDetailsSummary.class.cast(subject.lazyLoadTeam(team, Role.MEMBER, new FederatedUser(person())));
        assertEquals(team.getName(), summary.getName());
        assertEquals("test", summary.getMemberShips().iterator().next().getPerson().getUrn());
    }
}