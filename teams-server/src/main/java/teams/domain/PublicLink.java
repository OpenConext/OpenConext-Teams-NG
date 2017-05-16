package teams.domain;

import lombok.Getter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
public class PublicLink {

    private List<String> admins;
    private Long id;
    private String name;
    private String description;
    private boolean alreadyMember;

    public PublicLink(Team team, FederatedUser federatedUser) {
        this.id = team.getId();
        this.name = team.getName();
        this.description = team.getDescription();
        this.alreadyMember = team.member(federatedUser.getUrn()).isPresent();
        this.admins = team.getMemberships().stream()
                .filter(membership -> membership.getRole().equals(Role.ADMIN))
                .map(membership -> membership.getPerson().getName())
                .collect(Collectors.toList());

    }
}
