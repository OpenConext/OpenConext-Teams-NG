package teams.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.util.Assert;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;

@Entity(name = "memberships")
@Getter
@Setter
@NoArgsConstructor
public class Membership implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @Enumerated(EnumType.STRING)
    @NotNull
    private Role role;

    @Column
    private Instant created;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "person_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Person person;

    @Column(name = "urn_person")
    @NotNull
    private String urnPerson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    @JsonIgnore
    private Team team;

    @Column(name = "urn_team")
    @NotNull
    private String urnTeam;

    @Column
    private Instant expiryDate;

    @Column(name = "origin")
    @Enumerated(EnumType.STRING)
    private MembershipOrigin origin;

    @Column(name = "approved_by")
    private String approvedBy;

    public Membership(Role role, Team team, Person person, MembershipOrigin origin, String approvedBy) {
        this(role, team, person, null, origin, approvedBy);
    }

    public Membership(Role role, Team team, Person person, Instant expiryDate, MembershipOrigin origin, String approvedBy) {
        Assert.notNull(role, "Role required");
        Assert.notNull(team.getUrn(), "Urn team required");
        Assert.notNull(person.getUrn(), "Urn person required");
        this.role = role;
        this.setTeam(team);
        this.team.getMemberships().add(this);
        this.urnTeam = team.getUrn();
        this.person = person;
        this.urnPerson = person.getUrn();
        this.expiryDate = expiryDate;
        this.origin = origin;
        this.approvedBy = approvedBy;
        this.created = Instant.now();
    }
}
