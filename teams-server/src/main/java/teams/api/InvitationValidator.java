package teams.api;

import teams.domain.FederatedUser;
import teams.domain.Invitation;
import teams.domain.Person;
import teams.domain.Role;
import teams.domain.Team;
import teams.exception.IllegalJoinRequestException;
import teams.exception.IllegalMembershipException;
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

}
