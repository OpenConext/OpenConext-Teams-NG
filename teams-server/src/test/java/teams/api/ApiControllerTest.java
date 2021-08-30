package teams.api;

import org.junit.Test;
import teams.exception.DuplicateTeamNameException;

import java.util.Collections;

import static java.util.Collections.singletonList;

public class ApiControllerTest {

    private ApiController subject = new ApiController() {
    };

    @Test
    public void teamNameDuplicated() {
        subject.teamNameDuplicated("name", Collections.emptyList());
    }

    @Test(expected = DuplicateTeamNameException.class)
    public void teamNameDuplicatedException() {
        subject.teamNameDuplicated("name", singletonList("urn"));
    }


}