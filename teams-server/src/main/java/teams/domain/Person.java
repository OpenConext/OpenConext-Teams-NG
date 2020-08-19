package teams.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.util.StringUtils;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.util.*;

import static org.springframework.util.StringUtils.hasText;

@Entity(name = "persons")
@Getter
@NoArgsConstructor
public class Person implements Serializable {

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

    @Transient
    private boolean isSuperAdmin;

    public Person(String urn, String name, String email, boolean isGuest, boolean isSuperAdmin) {
        this.urn = urn;
        this.name = name;
        this.email = pickFirstMailEmail(email);
        this.guest = isGuest;
        this.isSuperAdmin = isSuperAdmin;
        this.created = Instant.now();
        this.lastLoginDate = Instant.now();
    }

    private String pickFirstMailEmail(String aMail) {
        if (StringUtils.hasText(aMail) && aMail.contains(";")) {
            return aMail.split(";")[0].trim();
        }
        return aMail;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = pickFirstMailEmail(email);
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

    @Override
    public String toString() {
        return "Person{" +
                "urn='" + urn + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", guest=" + guest +
                '}';
    }

    public void markAsSuperAdmin(boolean superAdmin) {
        isSuperAdmin = superAdmin;
    }
}
