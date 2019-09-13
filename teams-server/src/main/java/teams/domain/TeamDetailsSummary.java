package teams.domain;

import lombok.Getter;

import java.util.Set;
import java.util.stream.Collectors;

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
        this.memberships = team.getMemberships().stream()
                .filter(membership -> !membership.getRole().equals(Role.OWNER))
                .collect(Collectors.toSet());

        this.externalTeams = team.getExternalTeams();
    }
}
