package teams.api.validations;

import teams.domain.FederatedUser;
import teams.domain.JoinRequest;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalJoinRequestException;
import teams.exception.IllegalMembershipException;

import java.util.List;

import static java.util.stream.Collectors.toList;

public interface JoinRequestValidator {

    default void membershipNotAllowed(Team team, Person person) {
        if (team.getMemberships().stream().anyMatch(membership -> membership.getUrnPerson().equals(person.getUrn()))) {
            throw new IllegalJoinRequestException(String.format("Person %s is already a member of team %s", person.getUrn(), team.getUrn()));
        }
    }

    default List<String> admins(Team team) {
        List<String> admins = team.getMemberships().stream()
                .filter(membership ->
                        membership.getRole().equals(Role.ADMIN) || membership.getRole().equals(Role.OWNER))
                .map(membership -> membership.getPerson().getEmail())
                .collect(toList());
        if (admins.isEmpty()) {
            throw new IllegalJoinRequestException(String.format("Team %s does not have an ADMIN user", team.getUrn()));
        }
        return admins;
    }

    default void validateJoinRequest(JoinRequest joinRequest, FederatedUser federatedUser) {
        if (!joinRequest.getPerson().getUrn().equals(federatedUser.getUrn())) {
            throw new IllegalJoinRequestException(String.format("User %s is not the owner of JoinRequest %s", federatedUser.getUrn(), joinRequest.getId()));
        }
    }

    default void membersCanNotApproveJoinRequests(Role roleOfLoggedInPerson) {
        if (roleOfLoggedInPerson.equals(Role.MEMBER)) {
            throw new IllegalMembershipException("Members are not allowed to approve join requests");
        }
    }
}
