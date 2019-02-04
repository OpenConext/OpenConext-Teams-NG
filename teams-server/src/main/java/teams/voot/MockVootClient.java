package teams.voot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import teams.domain.ExternalTeam;

import java.util.Collections;
import java.util.List;
import java.util.stream.IntStream;

import static java.util.stream.Collectors.toList;

@Component
@Profile("dev")
public class MockVootClient extends VootClient{

    private static final Logger LOG = LoggerFactory.getLogger(MockVootClient.class);

    public MockVootClient() {
        super("accessTokenUri", "clientId","clientSecret",
                "spaceDelimitedScopes","serviceUrl");
    }

    @Override
    public List<ExternalTeam> teams(String personUrn) {
        if (personUrn.equals("urn:collab:person:surfnet.nl:rdoe")) {
            return Collections.emptyList();
        }
        List<ExternalTeam> externalTeams = IntStream.range(1, 11).mapToObj(i -> new ExternalTeam(
                "description " + i,
                "mock-group-provider",
                "urn:collab:group:example.org:nameXXX" + i,
                "name_" + i)
        ).collect(toList());

        LOG.debug("Result from mock VOOT external teams {}", externalTeams);

        return externalTeams;
    }

}
