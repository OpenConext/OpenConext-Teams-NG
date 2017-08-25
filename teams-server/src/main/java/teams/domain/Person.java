package teams.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.Instant;
import java.util.*;

import static org.springframework.util.StringUtils.hasText;

@Entity(name = "persons")
@Getter
@NoArgsConstructor
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @NotNull
    private String urn;

    @Column
    private String name;

    @Column
    private String email;

    @Column
    private Instant created;

    @Column
    private Instant lastLoginDate;

    @Column
    private boolean guest;

    @OneToMany(mappedBy = "person", orphanRemoval = true)
    @JsonIgnore
    private Set<JoinRequest> joinRequests = new HashSet<>();

    @OneToMany(mappedBy = "person", orphanRemoval = true)
    @JsonIgnore
    private Set<Membership> memberships = new HashSet<>();

    public Person(String urn, String name, String email, boolean isGuest) {
        this.urn = urn;
        this.name = name;
        this.email = email;
        this.guest = isGuest;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setGuest(boolean guest) {
        this.guest = guest;
    }

    public void setLastLoginDate(Instant lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    @JsonIgnore
    public boolean isValid() {
        return hasText(urn) && hasText(name) && hasText(email);
    }

    public String invalidAttributes() {
        List<String> invalidAttributes = new ArrayList<>();
        if (!hasText(urn)) {
            invalidAttributes.add("urn");
        }
        if (!hasText(name)) {
            invalidAttributes.add("name");
        }
        if (!hasText(email)) {
            invalidAttributes.add("email");
        }
        return String.join(",", invalidAttributes);
    }

    @Override
    public String toString() {
        return "Person{" +
                "urn='" + urn + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", guest=" + guest +
                '}';
    }
}
