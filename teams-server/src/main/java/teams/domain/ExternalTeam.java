package teams.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import java.util.Set;

@Entity(name = "external_groups")
public class ExternalTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String description;

    @Column
    private String groupProvider;

    @Column
    private String identifier;

    @Column
    private String name;

    @ManyToMany
    @JoinTable(name = "team_external_groups",
        joinColumns = @JoinColumn(name = "external_groups_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "team_id", referencedColumnName = "id"))
    private Set<Team> teams;

    public Set<Team> getTeams() {
        return teams;
    }

    public String getIdentifier() {
        return identifier;
    }
}
