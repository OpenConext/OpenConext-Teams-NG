package teams.voot;

import lombok.SneakyThrows;
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

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.toList;

@Component
@Profile("!dev")
@SuppressWarnings("deprecation")
public class VootClient {

    private static final Logger LOG = LoggerFactory.getLogger(VootClient.class);

    private final String serviceUrl;

    private OAuth2RestTemplate vootService;

    public VootClient(@Value("${voot.accessTokenUri}") String accessTokenUri,
                      @Value("${voot.clientId}") String clientId,
                      @Value("${voot.clientSecret}") String clientSecret,
                      @Value("${voot.scopes}") String spaceDelimitedScopes,
                      @Value("${voot.serviceUrl}") String serviceUrl) {
        this.serviceUrl = serviceUrl;
        vootService = new OAuth2RestTemplate(vootConfiguration(clientId, clientSecret, accessTokenUri, spaceDelimitedScopes));
    }

    @SneakyThrows
    public List<ExternalTeam> teams(String personUrn) {
        String personUrnEncoded = URLEncoder.encode(personUrn, Charset.defaultCharset().name());
        List<ExternalTeam> externalTeams = vootService.exchange(
                        RequestEntity.get(URI.create(String.format("%s/internal/external-groups/%s/", serviceUrl, personUrnEncoded))).build(),
                        new ParameterizedTypeReference<List<Map<String, Object>>>() {
                        })
                .getBody()
                .stream()
                .map(map -> new ExternalTeam(
                        (String) map.get("description"),
                        (String) map.get("sourceID"),
                        (String) map.get("id"),
                        (String) map.get("displayName")))
                .collect(toList());

        LOG.debug("Result from VOOT external teams {}", externalTeams);

        return externalTeams;
    }

    private OAuth2ProtectedResourceDetails vootConfiguration(String clientId,
                                                             String clientSecret,
                                                             String accessTokenUri,
                                                             String spaceDelimitedScopes) {
        ClientCredentialsResourceDetails details = new ClientCredentialsResourceDetails();
        details.setId("voot");
        details.setClientId(clientId);
        details.setClientSecret(clientSecret);
        details.setAccessTokenUri(accessTokenUri);
        details.setScope(Arrays.asList(spaceDelimitedScopes.split(" ")));
        return details;
    }


}
