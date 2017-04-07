package teams;

import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;

public interface Seed {

    default Team team() {
        return this.team("urn");
    }

    default Team team(String urn) {
        return new Team(urn, "name", "description", true);
    }

    default Team team(boolean viewable) {
        return new Team("urn", "name", "description", viewable);
    }

    default Person person() {
        return person("urn");
    }

    default Person person(String urn) {
        return new Person(urn, "name", "email", false);
    }

    default Membership membership(Role role, Team team, Person person) {
        return new Membership(role, team, person);
    }
}
