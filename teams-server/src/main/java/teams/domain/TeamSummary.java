package teams.domain;

import lombok.Getter;

import java.util.Optional;

@Getter
public class TeamSummary {

    private Long id;

    private String name;

    private int membershipCount;

    private String description;

    private Role role;

    public TeamSummary(Team team) {
        this(team, Optional.empty());
    }

    public TeamSummary(Team team, Optional<FederatedUser> federatedUserOptional) {
        this.id = team.getId();
        this.name = team.getName();
        this.membershipCount = team.getMembershipCount();
        this.description = team.getDescription();
        this.role = federatedUserOptional.map(user ->
        this.role = team.getMemberships()
            .stream()
            .filter(membership -> membership.getUrnPerson().equals(user.urn))
            .findAny()
            .orElseThrow(() -> new IllegalArgumentException(String.format(
                "Person {} is not a member of team {}", user.urn, team.getName())))
            .getRole()).orElse(null);
    }
}
