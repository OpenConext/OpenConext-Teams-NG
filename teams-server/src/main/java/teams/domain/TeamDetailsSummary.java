package teams.domain;

import lombok.Getter;

import java.util.Set;

@Getter
public class TeamDetailsSummary extends TeamSummary {

    private boolean viewable;
    private Set<Membership> memberships;
    private Set<ExternalTeam> externalTeams;

    public TeamDetailsSummary(Team team, FederatedUser user) {
        super(team, user, false);
        this.viewable = team.isViewable();
        team.getMemberships().forEach(membership -> membership.getPerson().isValid());
        team.getExternalTeams().forEach(ExternalTeam::getIdentifier);
        this.memberships = team.getMemberships();
        this.externalTeams = team.getExternalTeams();
    }
}
