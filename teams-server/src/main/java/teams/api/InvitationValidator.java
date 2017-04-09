package teams.api;

import teams.domain.FederatedUser;
import teams.domain.Invitation;
import teams.domain.Membership;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalInviteException;
import teams.exception.InvitationAlreadyAcceptedException;
import teams.exception.InvitationAlreadyDeclinedException;
import teams.exception.InvitationExpiredException;
import teams.exception.NotAllowedException;
import teams.exception.ResourceNotFoundException;

import java.util.Optional;

public interface InvitationValidator {

    default void validateInvitation(Invitation invitation, Person person) {
        if (invitation.hasExpired()) {
            throw new InvitationExpiredException();
        }
        if (invitation.isAccepted() || invitation.getTeam().member(person.getUrn()).isPresent()) {
            throw new InvitationAlreadyAcceptedException();
        }
        if (invitation.isDeclined()) {
            throw new InvitationAlreadyDeclinedException();
        }
    }

    default void membershipRequired(Team team, Person person) {
        if (team.getMemberships().stream().noneMatch(membership -> membership.getUrnPerson().equals(person.getUrn()))) {
            throw new IllegalInviteException(String.format(
                "Person %s must be a member of team %s", person.getUrn(), team.getUrn()));
        }
    }

    default void mustBeTeamAdminOrManager(Invitation invitation, FederatedUser federatedUser) {
        Membership membership = invitation.getTeam().member(federatedUser.getUrn()).orElseThrow(() ->
            new NotAllowedException(String.format(
                "Person %s is a member of team %s", federatedUser.getUrn(), invitation.getTeam().getUrn())));

        if (membership.getRole().equals(Role.MEMBER)) {
            throw new NotAllowedException(String.format(
                "Person %s is not the inviter of invitation %s", federatedUser.getUrn(), invitation.getId()));
        }
    }

    default Role determineFutureRole(Team team, Person person, Role intendedRole) {
        Optional<Membership> membershipOptional = team.member(person.getUrn());
        return membershipOptional.map(membership -> doDetermineFutureRole(membership.getRole(), intendedRole))
            .orElseThrow(() -> new IllegalInviteException(
                String.format("Person %s must be a member of team %s", person.getUrn(), team.getUrn())));
    }

    default Role doDetermineFutureRole(Role role, Role intendedRole) {
        switch (role) {
            case ADMIN:
                return intendedRole;
            case MANAGER:
                return Role.MEMBER;
            default:
                throw new IllegalInviteException("Only ADMIN and MANAGER can invite members");
        }
    }


}
