package teams.voot;

import com.github.tomakehurst.wiremock.junit.WireMockRule;
import org.apache.commons.io.IOUtils;
import org.junit.Rule;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import teams.domain.ExternalTeam;

import java.util.List;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.get;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;
import static java.nio.charset.Charset.defaultCharset;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

public class VootClientTest {

    private String personUrn = "urn:collab:person:example.org:admin";
    private VootClient client = new VootClient("http://localhost:8889/oauth/token",
        "surf-teams", "secret", "groups", "http://localhost:8889");

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(8889);

    @Test
    public void testGroups() throws Exception {
        String groupsJson = IOUtils.toString(new ClassPathResource("mocks/oauth-client-credentials.json").getInputStream(), defaultCharset());
        String oauthJson = IOUtils.toString(new ClassPathResource("mocks/voot-groups.json").getInputStream(), defaultCharset());

        stubFor(post(urlEqualTo("/oauth/token")).willReturn(aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody(groupsJson)));
        stubFor(get(urlEqualTo("/internal/external-groups/" + personUrn)).willReturn(aResponse().withStatus(200).withHeader("Content-Type", "application/json").withBody(oauthJson)));

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
