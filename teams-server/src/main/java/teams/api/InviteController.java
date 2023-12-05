package teams.api;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import teams.domain.Application;
import teams.domain.FederatedUser;
import teams.domain.Team;
import teams.exception.NotAllowedException;
import teams.repository.TeamRepository;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public class InviteController extends ApiController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final TeamRepository teamRepository;
    private final String inviteUrl;

    public InviteController(TeamRepository teamRepository,
                            @Value("${invite.url}") String inviteUrl,
                            @Value("${invite.user}") String inviteUser,
                            @Value("${invite.password}") String invitePassword) {
        this.teamRepository = teamRepository;
        this.inviteUrl = inviteUrl;
        byte[] encodedAuth = Base64.encodeBase64((inviteUser + ":" + invitePassword).getBytes());
        this.restTemplate.getInterceptors()
                .add((request, body, execution) -> {
                    request.getHeaders().add("Authorization", "Basic " + new String(encodedAuth));
                    return execution.execute(request, body);
                });
    }

    @GetMapping("/api/teams/invite-app/{id}")
    public ResponseEntity<Team> teamDetails(@PathVariable("id") Long id, FederatedUser federatedUser) {
        confirmFederatedUser(federatedUser);
        return doTeamDetails(id);
    }

    @GetMapping("/api/v1/external/invite-app/{id}")
    public ResponseEntity<Team> teamDetails(@PathVariable("id") Long id) {
        return doTeamDetails(id);
    }

    private ResponseEntity<Team> doTeamDetails(Long id) {
        Team team = teamRepository.findFirstById(id);
        team.getApplications().forEach(Application::getLandingPage);
        return ResponseEntity.ok(team);
    }

    @PutMapping("/api/v1/external/invite-app/migrate")
    public ResponseEntity<Void> migrateTeam(@RequestBody Map<String, Long> teamIdentifier) {
        return doMigrate(teamIdentifier);
    }

    @PutMapping("/api/teams/invite-app/migrate")
    public ResponseEntity<Void> migrateTeam(@RequestBody Map<String, Long> teamIdentifier, FederatedUser federatedUser) {
        confirmFederatedUser(federatedUser);
        return doMigrate(teamIdentifier);
    }

    private ResponseEntity<Void> doMigrate(Map<String, Long> teamIdentifier) {
        Team team = teamRepository.findFirstById(teamIdentifier.get("id"));
        //Must ensure the migration will work
        Set<Application> applications = team.getApplications();
        if (CollectionUtils.isEmpty(applications)) {
            throw new IllegalArgumentException("No applications");
        }

        restTemplate.put(inviteUrl, team);
        teamRepository.delete(team);

        return ResponseEntity.status(201).build();
    }

    private static void confirmFederatedUser(FederatedUser federatedUser) {
        if (!federatedUser.getPerson().isSuperAdmin()) {
            throw new NotAllowedException("Not allowed");
        }
    }
}
