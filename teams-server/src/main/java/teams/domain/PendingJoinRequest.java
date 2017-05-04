package teams.domain;

import lombok.Getter;

@Getter
public class PendingJoinRequest {

    private String teamName;
    private String teamDescription;
    private Long teamId;
    private JoinRequest joinRequest;

    public PendingJoinRequest(JoinRequest joinRequest) {
        this.joinRequest = joinRequest;

        Team team = joinRequest.getTeam();

        this.teamName = team.getName();
        this.teamDescription = team.getDescription();
        this.teamId = team.getId();
    }
}
