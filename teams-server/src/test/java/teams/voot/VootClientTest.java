package teams.voot;

import com.github.tomakehurst.wiremock.junit.WireMockRule;
import org.junit.Rule;
import org.junit.Test;
import teams.Mocks;
import teams.domain.ExternalTeam;

import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class VootClientTest implements Mocks {

    private String personUrn = "urn:collab:person:example.org:admin";
    private VootClient client = new VootClient("http://localhost:8889/oauth/token",
            "surf-teams", "secret", "groups", "http://localhost:8889");

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(8889);

    @Test
    public void testGroups() throws Exception {
        String groupsJson = fromMocks("oauth-client-credentials.json");
        String oauthJson = fromMocks("voot-groups.json");

        stubFor(post(urlEqualTo("/oauth/token")).willReturn(aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody(groupsJson)));
        stubFor(get(urlEqualTo("/internal/external-groups/" + URLEncoder.encode(personUrn, Charset.defaultCharset().name()) + "/")).willReturn(aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody(oauthJson)));

        List<ExternalTeam> teams = client.teams(personUrn);
        assertEquals(2, teams.size());

        ExternalTeam externalTeam = teams.get(0);
        assertEquals("urn:collab:group:foo:go", externalTeam.getIdentifier());
        assertEquals("go", externalTeam.getName());
        assertEquals("Go description", externalTeam.getDescription());
        assertEquals("foo", externalTeam.getGroupProvider());
        assertNull(externalTeam.getId());

    }


}
