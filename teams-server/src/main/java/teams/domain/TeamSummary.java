package teams.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;

@Getter
public class TeamSummary {

    private Long id;

    private String name;

    private String urn;

    private int membershipCount;

    private String description;

    private Role role;

    private int joinRequestsCount;

    private int invitationsCount;

    public TeamSummary(Team team, FederatedUser user) {
        this.id = team.getId();
        this.urn = team.getUrn();
        this.name = team.getName();
        this.membershipCount = team.getMembershipCount();
        this.description = team.getDescription();
        this.role = team.getMemberships()
                .stream()
                .filter(membership -> membership.getUrnPerson().equals(user.getUrn()))
                .findAny()
                .map(Membership::getRole)
                .orElse(null);
    }

    @JsonIgnore
    public void joinRequestsCount(int count) {
        this.joinRequestsCount = count;
    }

    @JsonIgnore
    public void invitationsCount(int count) {
        this.invitationsCount = count;
    }

}
