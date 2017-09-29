package teams.api.validations;

import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import teams.domain.*;
import teams.exception.*;

import java.io.IOException;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static java.util.stream.Collectors.toList;

public interface InvitationValidator {

    default void validateClientInvitation(ClientInvitation clientInvitation) {
        List<String> emails = clientInvitation.getEmails();
        if (CollectionUtils.isEmpty(emails) && StringUtils.isEmpty(clientInvitation.getCsvEmails())) {
            throw new IllegalInviteException("Either emails or file with emails is required");
        }
        Instant expiryDate = clientInvitation.getExpiryDate();
        Instant now = Instant.now();
        if (expiryDate != null && now.isAfter(expiryDate)) {
            throw new IllegalInviteException(String.format("Expiry date %s must be before %s", expiryDate, now));
        }
    }

    default void validateInvitation(Invitation invitation, Person person) {
        if (invitation.expired()) {
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
        Team team = invitation.getTeam();
        Membership membership = team.member(federatedUser.getUrn()).orElseThrow(() ->
                new NotAllowedException(String.format(
                        "Person %s is a member of team %s", federatedUser.getUrn(), team.getUrn())));

        if (membership.getRole().equals(Role.MEMBER)) {
            throw new NotAllowedException(String.format(
                    "Person %s is a member of team %s of invitation %s", federatedUser.getUrn(), team.getUrn(), invitation.getId()));
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

    default List<String> emails(ClientInvitation clientInvitation) throws IOException {
        validateClientInvitation(clientInvitation);
        List<String> fromFile = StringUtils.hasText(clientInvitation.getCsvEmails()) ?
                Stream.of(clientInvitation.getCsvEmails().split("[,\\n\\r]"))
                        .map(email -> email.trim().replaceAll("[\\t\\n\\r]", ""))
                        .filter(email -> Invitation.emailPattern.matcher(email).matches())
                        .collect(toList()) : Collections.emptyList();
        List<String> fromInput = clientInvitation.getEmails();
        fromInput.addAll(fromFile);
        return fromInput;

    }


}
