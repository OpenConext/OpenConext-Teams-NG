package teams.domain;

import lombok.Getter;

import java.util.Set;

@Getter
public class TeamDetailsSummary extends TeamSummary {

    private Set<Membership> memberShips;

    public TeamDetailsSummary(Team team, FederatedUser user) {
        super(team, user);
        this.memberShips = team.getMemberships();
    }
}
