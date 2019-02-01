package teams.api.validations;

import org.junit.Test;
import teams.Seed;
import teams.api.TeamController;
import teams.domain.*;
import teams.exception.DuplicateTeamNameException;
import teams.exception.IllegalMembershipException;
import teams.exception.InvalidTeamNameException;

import java.util.Collections;

import static java.util.Collections.singletonList;
import static org.junit.Assert.assertEquals;

public class TeamValidatorTest implements Seed {

    private TeamValidator subject = new TeamController();

    @Test
    public void teamNameDuplicated() throws Exception {
        subject.teamNameDuplicated("name", Collections.emptyList());
    }

    @Test(expected = DuplicateTeamNameException.class)
    public void teamNameDuplicatedException() throws Exception {
        subject.teamNameDuplicated("name", singletonList("urn"));
    }

    @Test
    public void onlyAdminAllowed() throws Exception {
        subject.onlyAdminAllowed(Role.ADMIN, federatedUser(), team(), "test");
    }

    @Test(expected = IllegalMembershipException.class)
    public void onlyAdminAllowedException() throws Exception {
        subject.onlyAdminAllowed(Role.MANAGER, federatedUser(), team(), "test");
    }

    @Test
    public void lazyLoadTeam() throws Exception {
        Team team = team();
        assertEquals(team, subject.lazyLoadTeam(team, Role.ADMIN, federatedUser()));
    }

    @Test
    public void lazyLoadTeamMember() throws Exception {
        Team team = team();
        new Membership(Role.ADMIN, team, person("test"),MembershipOrigin.INITIAL_ADMIN, "John Doe");
        TeamDetailsSummary summary = TeamDetailsSummary.class.cast(subject.lazyLoadTeam(team, Role.MEMBER, federatedUser()));
        assertEquals(team.getName(), summary.getName());
        assertEquals("test", summary.getMemberships().iterator().next().getPerson().getUrn());
    }

    @Test
    public void isAllowedToAcceptJoinRequestAdmin() throws Exception {
        doIsAllowedToAcceptJoinRequest(Role.MEMBER, false);
        doIsAllowedToAcceptJoinRequest(Role.MANAGER, true);
        doIsAllowedToAcceptJoinRequest(Role.ADMIN, true);

        assertEquals(false, subject.isAllowedToAcceptJoinRequest(new TeamSummary(team(), federatedUser(), false)));
    }

    @Test
    public void validName() throws Exception {
        subject.validateTeamName("Name - allowed's");
    }

    @Test(expected = InvalidTeamNameException.class)
    public void invalidName() throws Exception {
        subject.validateTeamName("^ ");
    }

    private void doIsAllowedToAcceptJoinRequest(Role role, boolean expected) {
        Team team = team();
        FederatedUser federatedUser = federatedUser("urn");
        membership(role, team, federatedUser.getPerson());
        assertEquals(expected, subject.isAllowedToAcceptJoinRequest(new TeamSummary(team, federatedUser, false)));
    }

}