package teams.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import teams.domain.FederatedUser;
import teams.domain.Person;
import teams.domain.PersonAutocomplete;
import teams.exception.IllegalSearchParamException;
import teams.repository.PersonRepository;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.*;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

@RestController
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);


    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("api/teams/users/me")
    public FederatedUser person(FederatedUser federatedUser) {
        return federatedUser;
    }

    @GetMapping("api/teams/users")
    public Set<PersonAutocomplete> autocomplete(@RequestParam("query") String query) {
        if (query.trim().length() < 2) {
            throw new IllegalSearchParamException("Minimal query length is 2");
        }
        List<Person> persons = personRepository.findFirst10ByNameStartingWithOrEmailStartingWithAllIgnoreCase(query, query);
        return persons.stream()
                .map(person -> new PersonAutocomplete(person.getName(), person.getEmail()))
                .collect(toSet());
    }

    @PostMapping("/api/teams/error")
    public void error(@RequestBody Map<String, Object> payload, FederatedUser federatedUser) throws JsonProcessingException, UnknownHostException {
        payload.put("dateTime", new SimpleDateFormat("yyyyy-mm-dd hh:mm:ss").format(new Date()));
        payload.put("machine", InetAddress.getLocalHost().getHostName());
        payload.put("user", federatedUser);
        String msg = objectMapper.writeValueAsString(payload);
        log.error(msg, new IllegalArgumentException(msg));
    }

}
