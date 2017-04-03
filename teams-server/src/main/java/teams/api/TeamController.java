package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.FederatedUser;
import teams.domain.Team;
import teams.domain.TeamSummary;
import teams.repository.TeamRepository;

import java.util.List;
import java.util.Optional;

import static java.util.stream.Collectors.toList;


@RestController
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @GetMapping("api/teams/teams/me")
    public List<TeamSummary> myTeams(FederatedUser federatedUser) {
        return teamRepository
            .findByMembershipsUrnPersonOrderByNameAsc(federatedUser.urn, new PageRequest(0, Integer.MAX_VALUE))
            .getContent()
            .stream()
            .map(team -> new TeamSummary(team, Optional.of(federatedUser)))
            .collect(toList());

    }

}
