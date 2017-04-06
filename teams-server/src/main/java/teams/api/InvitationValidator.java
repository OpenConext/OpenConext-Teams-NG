package teams.api;

import teams.domain.Invitation;
import teams.domain.Person;
import teams.domain.Team;
import teams.exception.IllegalInviteException;
import teams.exception.InvitationAlreadyAcceptedException;
import teams.exception.InvitationAlreadyDeclinedException;
import teams.exception.InvitationExpiredException;

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
            throw new IllegalInviteException(String.format("Person %s must be a member of team %s", person.getUrn(), team.getUrn()));
        }
    }

}
