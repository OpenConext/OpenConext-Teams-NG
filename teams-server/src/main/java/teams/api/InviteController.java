package teams.api;

import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import teams.domain.Application;
import teams.domain.FederatedUser;
import teams.domain.Team;
import teams.exception.NotAllowedException;
import teams.exception.ResourceNotFoundException;
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
        Team team = teamRepository.findById(id).orElseThrow(ResourceNotFoundException::new);
        team.getApplications().forEach(Application::getLandingPage);
        team.getMemberships().forEach(membership -> membership.getPerson().getSchacHomeOrganization());
        return ResponseEntity.ok(team);
    }

    @PutMapping("/api/v1/external/invite-app/migrate")
    public ResponseEntity<Map<String, Integer>> migrateTeam(@RequestBody Map<String, Long> teamIdentifier) {
        return doMigrate(teamIdentifier);
    }

    @PutMapping("/api/teams/invite-app/migrate")
    public ResponseEntity<Map<String, Integer>> migrateTeam(@RequestBody Map<String, Long> teamIdentifier, FederatedUser federatedUser) {
        confirmFederatedUser(federatedUser);
        return doMigrate(teamIdentifier);
    }

    private ResponseEntity<Map<String, Integer>> doMigrate(Map<String, Long> teamIdentifier) {
        //We must avoid hibernateLazyInitializer errors, so do not use the repository
        Team team = doTeamDetails(teamIdentifier.get("id")).getBody();
        //Must ensure the migration will work
        Set<Application> applications = team.getApplications();
        if (CollectionUtils.isEmpty(applications)) {
            throw new IllegalArgumentException("No applications");
        }
        ResponseEntity<Map<String, Integer>> responseEntity = restTemplate.exchange(inviteUrl, HttpMethod.PUT, new HttpEntity<>(team), new ParameterizedTypeReference<>() {
        });
        teamRepository.delete(team);

        return responseEntity;
    }

    private static void confirmFederatedUser(FederatedUser federatedUser) {
        if (!federatedUser.getPerson().isSuperAdmin()) {
            throw new NotAllowedException("Not allowed");
        }
    }
}
