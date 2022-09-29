package teams.domain;

import lombok.Getter;

import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class TeamDetailsSummary extends TeamSummary {

    private final boolean viewable;
    private final Set<ExternalTeam> externalTeams;
    private final Set<Membership> memberships;

    public TeamDetailsSummary(Team team, FederatedUser user) {
        super(team, user, false);
        this.viewable = team.isViewable();
        team.getExternalTeams().forEach(ExternalTeam::getIdentifier);
        this.externalTeams = team.getExternalTeams();
        team.getMemberships().forEach(membership -> membership.getPerson().isValid());
        this.memberships = team.getMemberships().stream()
                .filter(membership -> !membership.getRole().equals(Role.OWNER))
                .filter(membership -> !team.isHideMembers() || membership.getPerson().getId().equals(user.getPerson().getId()))
                .collect(Collectors.toSet());
    }
}
