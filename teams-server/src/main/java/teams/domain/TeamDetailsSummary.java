package teams.domain;

import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Getter
public class TeamDetailsSummary extends TeamSummary {

    private Set<Membership> memberships;
    private Set<JoinRequest> joinRequests = new HashSet<>();
    private Set<JoinRequest> invitations = new HashSet<>();

    public TeamDetailsSummary(Team team, FederatedUser user) {
        super(team, user);
        this.memberships = team.getMemberships();
    }
}
