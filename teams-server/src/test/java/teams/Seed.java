package teams;

import teams.domain.*;

import java.util.Collections;

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

    default ExternalTeam externalTeam(String identifier) {
        return new ExternalTeam("description", "groupProvider", identifier, "name");
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

    default FederatedUser federatedUser(String urn) {
        return new FederatedUser(person(urn), "urn:collab:group:dev.surfteams.nl:", Collections.emptyList());
    }
    default FederatedUser federatedUser() {
        return federatedUser("urn");
    }
}
