package teams.domain;

import lombok.Getter;

@Getter
public class PendingJoinRequest {

    private String teamName;
    private String teamDescription;
    private JoinRequest joinRequest;

    public PendingJoinRequest(JoinRequest joinRequest) {
        this.joinRequest = joinRequest;

        this.teamName = joinRequest.getTeam().getName();
        this.teamDescription = joinRequest.getTeam().getDescription();
    }
}
