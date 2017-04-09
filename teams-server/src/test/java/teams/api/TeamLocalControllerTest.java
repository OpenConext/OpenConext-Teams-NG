package teams.api;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import teams.Seed;
import teams.domain.FederatedUser;
import teams.domain.TeamAutocomplete;
import teams.repository.TeamRepository;

import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyLong;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class TeamLocalControllerTest implements Seed {

    @Mock
    private TeamRepository teamRepository;

    @InjectMocks
    private TeamController teamController = new TeamController();

    @Test
    public void testSearchWithNonViewableTeam() throws Exception {
        List<Object[]> seed = seed();
        when(teamRepository.autocomplete(anyLong(), anyString(), anyLong()))
            .thenReturn(seed);

        List<TeamAutocomplete> teamAutocompletes = teamController.
            teamSearch("test", new FederatedUser(person()));
        assertEquals(seed.size(), teamAutocompletes.size());

        IntStream.range(0, seed.size())
            .forEachOrdered(i -> assertEquals(i, Integer.valueOf(teamAutocompletes.get(i).getUrn()).intValue()));

    }

    private List<Object[]> seed() {
        //second 'urn' is the sorted position in the autoCompletes List
        return Arrays.asList(
            new String[]{"ContainingLaterTest", "6"},
            new String[]{"ContainingTest", "5"},
            new String[]{"Second test", "2", "ADMIN"},
            new String[]{"Test first", "0"},
            new String[]{"1 2 3 test", "3", "MEMBER"},
            new String[]{"1_2_3_4_ test", "4"},
            new String[]{"testtesttest", "1"}
        );
    }

}
