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

import static java.util.stream.Collectors.toList;

@Component
@Profile("!dev")
public class VootClient {

    private static final Logger LOG = LoggerFactory.getLogger(VootClient.class);

    private String accessTokenUri;
    private String clientId;
    private String clientSecret;
    private String spaceDelimitedScopes;
    private String serviceUrl;

    private OAuth2RestTemplate vootService;

    public VootClient(@Value("${voot.accessTokenUri}") String accessTokenUri,
                      @Value("${voot.clientId}") String clientId,
                      @Value("${voot.clientSecret}") String clientSecret,
                      @Value("${voot.scopes}") String spaceDelimitedScopes,
                      @Value("${voot.serviceUrl}") String serviceUrl) {
        this.accessTokenUri = accessTokenUri;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.spaceDelimitedScopes = spaceDelimitedScopes;
        this.serviceUrl = serviceUrl;
        vootService = new OAuth2RestTemplate(vootConfiguration());
    }

    public List<ExternalTeam> teams(String personUrn) {
        List<ExternalTeam> externalTeams = vootService.exchange(
                RequestEntity.get(URI.create(String.format("%s/internal/external-groups/%s", serviceUrl, personUrn))).build(),
                new ParameterizedTypeReference<List<Map<String, Object>>>() {
                })
                .getBody()
                .stream()
                .map(map -> new ExternalTeam(
                        String.class.cast(map.get("description")),
                        String.class.cast(map.get("sourceID")),
                        String.class.cast(map.get("id")),
                        String.class.cast(map.get("displayName"))))
                .collect(toList());

        LOG.debug("Result from VOOT external teams {}", externalTeams);

        return externalTeams;
    }

    private OAuth2ProtectedResourceDetails vootConfiguration() {
        ClientCredentialsResourceDetails details = new ClientCredentialsResourceDetails();
        details.setId("voot");
        details.setClientId(clientId);
        details.setClientSecret(clientSecret);
        details.setAccessTokenUri(accessTokenUri);
        details.setScope(Arrays.asList(spaceDelimitedScopes.split(" ")));
        return details;
    }

}
