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

public interface InvitationValidator {

    default void validateInvitation(Invitation invitation) {
        if (invitation.hasExpired()) {
            throw new InvitationExpiredException();
        }
        if (invitation.isAccepted()) {
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
    default void assertNotNull(Invitation invitation, Long id) {
        if (invitation == null) {
            throw new ResourceNotFoundException(String.format("Invitation %s does not exists", id));
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

}
