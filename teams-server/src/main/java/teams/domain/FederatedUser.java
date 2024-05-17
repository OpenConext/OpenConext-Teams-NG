package teams.domain;

import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;

@Getter
public class FederatedUser extends User {

    private final Map<String, String> config;
    private final String productName;
    private final Person person;
    private String groupNameContext;
    private List<ExternalTeam> externalTeams;
    private Map<Feature, Boolean> featureToggles;

    public FederatedUser(Person person, String productName, Map<String, String> config) {
        super(StringUtils.hasText(person.getName()) ? person.getName() : "No display name provided", "N/A", person.isGuest() ?
                singletonList(new SimpleGrantedAuthority("ROLE_USER")) :
                asList(new SimpleGrantedAuthority("ROLE_USER"), new SimpleGrantedAuthority("ROLE_ADMIN")));
        this.person = person;
        this.config = config;
        this.productName = productName;
    }

    public FederatedUser(Person person,
                         String groupNameContext,
                         String productName,
                         List<ExternalTeam> externalTeams,
                         Map<Feature, Boolean> featureToggles,
                         Map<String, String> config) {
        super(StringUtils.hasText(person.getName()) ? person.getName() : "No display name provided", "N/A", person.isGuest() ?
                singletonList(new SimpleGrantedAuthority("ROLE_USER")) :
                asList(new SimpleGrantedAuthority("ROLE_USER"), new SimpleGrantedAuthority("ROLE_ADMIN")));
        this.person = person;
        this.groupNameContext = groupNameContext;
        this.productName = productName;
        this.externalTeams = externalTeams;
        this.featureToggles = featureToggles;
        this.config = config;
    }

    public String getUrn() {
        return person.getUrn();
    }

    public boolean featureEnabled(Feature feature) {
        return featureToggles.getOrDefault(feature, Boolean.FALSE);
    }
}
