package teams.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity(name = "external_groups")
@NoArgsConstructor
@Getter
@Setter
public class ExternalTeam implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String description;

    @Column
    @NotNull
    private String groupProvider;

    @Column
    @NotNull
    private String identifier;

    @Column
    @NotNull
    private String name;

    @Column(name = "admin_name")
    private String adminName;

    @ManyToMany
    @JoinTable(name = "team_external_groups",
            joinColumns = @JoinColumn(name = "external_groups_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "team_id", referencedColumnName = "id"))
    @JsonIgnore
    private Set<Team> teams = new HashSet<>();

    public ExternalTeam(String description, String groupProvider, String identifier, String name) {
        this.description = description;
        this.groupProvider = groupProvider;
        this.identifier = identifier;
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExternalTeam that = (ExternalTeam) o;
        return Objects.equals(identifier, that.identifier);
    }

    @Override
    public int hashCode() {
        return Objects.hash(identifier);
    }
}
