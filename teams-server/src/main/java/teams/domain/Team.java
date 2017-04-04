package teams.domain;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Formula;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.OneToMany;
import javax.validation.constraints.Pattern;
import java.time.Instant;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.function.Function;

@Entity(name = "teams")
@NamedEntityGraph(name = "Team.memberships", attributeNodes = @NamedAttributeNode("memberships"))
@Getter
@Setter
@NoArgsConstructor
@ToString(of = {"urn", "name"})
@EqualsAndHashCode(of = "urn")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String urn;

    @Column
    @Pattern(regexp = "[\\w \\-']{1,255}")
    private String name;

    @Column
    private String description;

    @Column
    private boolean viewable;

    @Column
    private Instant created;

    @Formula("(select count(*) from memberships m where m.team_id = id)")
    private int membershipCount;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Membership> memberships = new HashSet<>();

    public Team(String urn, String name, String description, boolean viewable) {
        this.urn = urn;
        this.name = name;
        this.description = description;
        this.viewable = viewable;
    }

    public Optional<Membership> member(String urn) {
        return memberships.stream().filter(membership -> membership.getUrnPerson().equals(urn))
            .findAny();
    }
}
