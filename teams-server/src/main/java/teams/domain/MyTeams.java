package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class MyTeams {

    private List<PendingJoinRequest> myJoinRequests;

    private List<TeamSummary> teamSummaries;

}
