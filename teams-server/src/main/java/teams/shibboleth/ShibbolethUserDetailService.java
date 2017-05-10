package teams.shibboleth;

import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import teams.domain.ExternalTeam;
import teams.domain.FederatedUser;
import teams.domain.Person;
import teams.voot.VootClient;

import java.util.List;

public class ShibbolethUserDetailService implements AuthenticationUserDetailsService<PreAuthenticatedAuthenticationToken> {

    private final VootClient vootClient;
    private String groupNameContext;
    private String productName;

    public ShibbolethUserDetailService(String groupNameContext, String  productName, VootClient vootClient) {
        this.groupNameContext = groupNameContext;
        this.vootClient = vootClient;
        this.productName = productName;
    }

    @Override
    public UserDetails loadUserDetails(PreAuthenticatedAuthenticationToken authentication) throws UsernameNotFoundException {
        Person person = Person.class.cast(authentication.getPrincipal());
        List<ExternalTeam> externalTeams = vootClient.teams(person.getUrn());
        return new FederatedUser(person, groupNameContext, productName, externalTeams);
    }
}
