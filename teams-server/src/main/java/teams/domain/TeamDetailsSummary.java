package teams.domain;

import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Getter
public class TeamDetailsSummary extends TeamSummary {

    private Set<Membership> memberships;

    public TeamDetailsSummary(Team team, FederatedUser user) {
        super(team, user, false);
        team.getMemberships().forEach(membership -> membership.getPerson().isValid());
        this.memberships = team.getMemberships();
    }
}
