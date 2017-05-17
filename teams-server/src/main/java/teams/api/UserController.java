package teams.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import teams.domain.FederatedUser;
import teams.domain.Person;
import teams.domain.PersonAutocomplete;
import teams.exception.IllegalSearchParamException;
import teams.repository.PersonRepository;

import java.util.List;

import static java.util.stream.Collectors.toList;

@RestController
public class UserController {

    @Autowired
    private PersonRepository personRepository;


    @GetMapping("api/teams/users/me")
    public FederatedUser person(FederatedUser federatedUser) {
        return federatedUser;
    }

    @GetMapping("api/teams/users")
    public List<PersonAutocomplete> autocomplete(@RequestParam("query") String query) {
        if (query.trim().length() < 2) {
            throw new IllegalSearchParamException("Minimal query length is 2");
        }
        List<Person> persons = personRepository.findFirst10ByNameStartingWithOrEmailStartingWithAllIgnoreCase(query, query);
        return persons.stream()
                .map(person -> new PersonAutocomplete(person.getName(), person.getEmail()))
                .collect(toList());
    }
}
