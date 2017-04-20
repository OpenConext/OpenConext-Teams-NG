package teams.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Formula;
import org.springframework.util.StringUtils;
import org.springframework.web.util.HtmlUtils;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import static javax.persistence.CascadeType.ALL;

@Entity(name = "teams")
@NamedEntityGraph(name = "Team.memberships", attributeNodes = @NamedAttributeNode("memberships"))
@Getter
@Setter
@NoArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    @NotNull
    private String urn;

    @Column
    @Pattern(regexp = "[\\w \\-']{1,255}")
    private String name;

    @Column
    private String description;

    @Column
    private String personalNote;

    @Column
    private boolean viewable;

    @Column
    private Instant created;

    @Formula("(select count(*) from memberships m where m.team_id = id)")
    private int membershipCount;

    @OneToMany(mappedBy = "team", orphanRemoval = true, cascade = ALL)
    private Set<Membership> memberships = new HashSet<>();

    @OneToMany(mappedBy = "team", orphanRemoval = true)
    private Set<Invitation> invitations = new HashSet<>();

    @OneToMany(mappedBy = "team", orphanRemoval = true)
    private Set<JoinRequest> joinRequests = new HashSet<>();

    @ManyToMany(mappedBy = "teams", cascade = ALL)
    private Set<ExternalTeam> externalTeams = new HashSet<>();

    public Team(String urn, String name, String description, boolean viewable) {
        this.urn = urn;
        this.name = name;
        this.description = StringUtils.hasText(description) ? description : null;
        this.viewable = viewable;
    }

    public Optional<Membership> member(String urn) {
        return memberships.stream().filter(membership -> membership.getUrnPerson().equals(urn))
                .findAny();
    }

    @JsonIgnore
    public boolean isContainsDescription() {
        return StringUtils.hasText(this.description);
    }

    @JsonIgnore
    public String getHtmlDescription() {
        return isContainsDescription() ? HtmlUtils.htmlEscape(description).replaceAll("\n", "<br/>") : "";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Team team = (Team) o;
        return Objects.equals(id, team.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
