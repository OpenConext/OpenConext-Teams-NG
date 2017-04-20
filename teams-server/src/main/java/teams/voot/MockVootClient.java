package teams.voot;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.RequestEntity;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.grant.client.ClientCredentialsResourceDetails;
import org.springframework.stereotype.Component;
import teams.domain.ExternalTeam;

import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
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
        List<ExternalTeam> externalTeams = IntStream.range(1, 11).mapToObj(i -> new ExternalTeam(
                "description " + i,
                "mock-group-provider",
                "urn:collab:group:example.org:name" + i,
                "name_" + i)
        ).collect(toList());

        LOG.debug("Result from mock VOOT external teams {}", externalTeams);

        return externalTeams;
    }

}
