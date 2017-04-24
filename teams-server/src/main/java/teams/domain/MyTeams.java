package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MyTeams {

    private List<JoinRequest> joinRequests;

    private List<Invitation> invitationsSend;

    private List<Invitation> invitationsReceived;

    private List<TeamSummary> teamSummaries;

}
