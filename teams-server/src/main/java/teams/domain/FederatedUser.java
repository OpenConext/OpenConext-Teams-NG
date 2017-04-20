package teams.domain;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;

@Getter
public class FederatedUser extends User {

    private String groupNameContext;
    private Person person;
    private List<ExternalTeam> externalTeams;

    public FederatedUser(Person person, String groupNameContext, List<ExternalTeam> externalTeams) {
        super(person.getName(), "N/A", person.isGuest() ?
                singletonList(new SimpleGrantedAuthority("ROLE_USER")) :
                asList(new SimpleGrantedAuthority("ROLE_USER"), new SimpleGrantedAuthority("ROLE_ADMIN")));
        this.person = person;
        this.groupNameContext = groupNameContext;
        this.externalTeams = externalTeams;
    }

    public String getUrn() {
        return person.getUrn();
    }
}
