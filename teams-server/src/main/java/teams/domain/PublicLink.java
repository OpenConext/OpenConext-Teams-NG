package teams.domain;

import lombok.Getter;

@Getter
public class PublicLink {

    private Long id;
    private String name;
    private String description;
    private boolean alreadyMember;

    public PublicLink(Team team, FederatedUser federatedUser) {
        this.id = team.getId();
        this.name = team.getName();
        this.description = team.getDescription();
        this.alreadyMember = team.member(federatedUser.getUrn()).isPresent();
    }
}
