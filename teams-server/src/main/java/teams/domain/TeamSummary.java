package teams.domain;

import lombok.Getter;

@Getter
public class TeamSummary {

    private Long id;

    private String name;

    private int membershipCount;

    private String description;

    private Role role;

    public TeamSummary(Team team, FederatedUser user) {
        this.id = team.getId();
        this.name = team.getName();
        this.membershipCount = team.getMembershipCount();
        this.description = team.getDescription();
        this.role = team.getMemberships()
            .stream()
            .filter(membership -> membership.getUrnPerson().equals(user.urn))
            .findAny()
            .map(Membership::getRole)
            .orElse(null);
    }
}
