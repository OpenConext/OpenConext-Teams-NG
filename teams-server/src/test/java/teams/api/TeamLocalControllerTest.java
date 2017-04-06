package teams.api;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.runners.MockitoJUnitRunner;
import teams.Seed;
import teams.domain.FederatedUser;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.domain.TeamSummary;
import teams.repository.TeamRepository;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static java.util.Collections.singletonList;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class TeamLocalControllerTest implements Seed{

    @Mock
    private TeamRepository teamRepository;

    @InjectMocks
    private TeamController teamController = new TeamController();

    @Test
    public void testSearchWithNonViewableTeam() throws Exception {
        Team team = team(false);
        Person person = person("jdoe");
        team.getMemberships().add(membership(Role.ADMIN,team, person));

        when(teamRepository.findByNameContainingIgnoreCaseOrderByNameAsc("q")).thenReturn(singletonList(team));

        List<TeamSummary> summaries = teamController.teamSearch("q", new FederatedUser(person));
        assertEquals(1, summaries.size());

    }

}
