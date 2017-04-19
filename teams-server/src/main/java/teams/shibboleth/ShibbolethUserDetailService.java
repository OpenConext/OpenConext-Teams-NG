package teams.shibboleth;

import org.springframework.security.core.userdetails.AuthenticationUserDetailsService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import teams.domain.FederatedUser;
import teams.domain.Person;

public class ShibbolethUserDetailService implements AuthenticationUserDetailsService<PreAuthenticatedAuthenticationToken> {

    private String groupNameContext;

    public ShibbolethUserDetailService(String groupNameContext) {
        this.groupNameContext = groupNameContext;
    }

    @Override
    public UserDetails loadUserDetails(PreAuthenticatedAuthenticationToken authentication) throws UsernameNotFoundException {
        return new FederatedUser(Person.class.cast(authentication.getPrincipal()), groupNameContext);
    }
}
