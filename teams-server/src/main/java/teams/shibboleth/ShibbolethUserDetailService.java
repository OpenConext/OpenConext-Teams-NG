package teams.shibboleth;

import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import teams.domain.ExternalTeam;
import teams.domain.Feature;
import teams.domain.FederatedUser;
import teams.domain.Person;
import teams.voot.VootClient;

import java.util.List;
import java.util.Map;

public class ShibbolethUserDetailService implements AuthenticationUserDetailsService<PreAuthenticatedAuthenticationToken> {

    private final VootClient vootClient;
    private final Map<String, String> config;
    private String groupNameContext;
    private String productName;
    private Map<Feature, Boolean> featureToggles;

    public ShibbolethUserDetailService(String groupNameContext,
                                       String  productName,
                                       VootClient vootClient,
                                       Map<Feature, Boolean> featureToggles,
                                       Map<String, String> config) {
        this.groupNameContext = groupNameContext;
        this.vootClient = vootClient;
        this.productName = productName;
        this.featureToggles = featureToggles;
        this.config = config;
    }

    @Override
    public UserDetails loadUserDetails(PreAuthenticatedAuthenticationToken authentication) throws UsernameNotFoundException {
        Person person = Person.class.cast(authentication.getPrincipal());
        List<ExternalTeam> externalTeams = vootClient.teams(person.getUrn());
        return new FederatedUser(person, groupNameContext, productName, externalTeams, featureToggles, config);
    }
}
