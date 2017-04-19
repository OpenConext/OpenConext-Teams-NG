package teams.domain;

import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Set;

@Entity(name = "external_groups")
@NoArgsConstructor
@Getter
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

    public ExternalTeam(String description, String groupProvider, String identifier, String name) {
        this.description = description;
        this.groupProvider = groupProvider;
        this.identifier = identifier;
        this.name = name;
    }
}
