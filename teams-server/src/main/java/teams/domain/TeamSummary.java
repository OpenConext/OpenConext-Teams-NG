package teams.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    private boolean viewable;

    private List<AdminMember> admins = new ArrayList<>();

    public TeamSummary(Team team, FederatedUser user, boolean includeAdmins) {
        this.id = team.getId();
        this.urn = team.getUrn();
        this.name = team.getName();
        this.membershipCount = team.getMembershipCount();
        this.description = team.getDescription();
        this.viewable = team.isViewable();
        Optional<Membership> membershipOptional = team.getMemberships()
                .stream()
                .filter(membership -> membership.getUrnPerson().equals(user.getUrn()))
                .findAny();
        this.role = membershipOptional.map(Membership::getRole).orElse(null);
        if (includeAdmins) {
            this.admins = team.getMemberships().stream()
                    .filter(membership -> membership.getRole().equals(Role.ADMIN))
                    .map(membership -> new AdminMember(membership.getPerson()))
                    .collect(Collectors.toList());
        }
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
