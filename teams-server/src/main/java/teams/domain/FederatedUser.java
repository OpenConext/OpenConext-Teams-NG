package teams.domain;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;

public class FederatedUser extends User {

    public String urn;
    public String email;

    public FederatedUser(Person person) {
        super(person.getName(), "N/A", person.isGuest() ?
            singletonList(new SimpleGrantedAuthority("ROLE_USER")) :
            asList(new SimpleGrantedAuthority("ROLE_USER"), new SimpleGrantedAuthority("ROLE_ADMIN")));
        this.urn = person.getUrn();
        this.email = person.getEmail();
    }
}
