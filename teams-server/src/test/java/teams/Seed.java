package teams;

import teams.domain.*;

import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static teams.domain.Language.Dutch;
import static teams.domain.Role.ADMIN;

public interface Seed {

    default Team team() {
        return this.team("urn");
    }

    default Team team(String urn) {
        return new Team(urn, "name", "description", true, "personal note");
    }

    default Team team(boolean viewable) {
        return new Team("urn", "name", "description", viewable, "personal note");
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

    default InvitationMessage invitationMessage(String message) {
        return new InvitationMessage(
                new Invitation(team(), "email", ADMIN, Dutch, null), person("urn"), message);
    }

    default ClientInvitation clientInvitation(List<String> emails, String csvEmails) {
        return clientInvitation(emails, csvEmails, null);
    }

    default ClientInvitation clientInvitation(List<String> emails, String csvEmails, Instant instant) {
        return new ClientInvitation(1L, Role.MANAGER, emails, instant, "Message", csvEmails, Language.Dutch);
    }

    default JoinRequest joinRequest(String personUrn) {
        return new JoinRequest(person(personUrn), team(),"Message");
    }

}
