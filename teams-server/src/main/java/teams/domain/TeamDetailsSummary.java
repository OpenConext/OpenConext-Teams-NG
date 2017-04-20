package teams.domain;

import lombok.Getter;

import java.util.HashSet;
import java.util.Set;

@Getter
public class TeamDetailsSummary extends TeamSummary {

    private Set<Membership> memberships;
    private Set<JoinRequest> joinRequests = new HashSet<>();
    private Set<Invitation> invitations = new HashSet<>();

    public TeamDetailsSummary(Team team, FederatedUser user) {
        super(team, user);
        team.getMemberships().forEach(membership -> membership.getPerson().isValid());
        this.memberships = team.getMemberships();
    }
}
