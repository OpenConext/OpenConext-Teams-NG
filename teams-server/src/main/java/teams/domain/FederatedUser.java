package teams.domain;

import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;

@Getter
public class FederatedUser extends User {

    private String urn;
    private String email;

    public FederatedUser(Person person) {
        super(person.getName(), "N/A", person.isGuest() ?
            singletonList(new SimpleGrantedAuthority("ROLE_USER")) :
            asList(new SimpleGrantedAuthority("ROLE_USER"), new SimpleGrantedAuthority("ROLE_ADMIN")));
        this.urn = person.getUrn();
        this.email = person.getEmail();
    }

}
