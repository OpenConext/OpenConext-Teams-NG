package teams.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class InvitationInfo {

    private String inviter;
    private Long expiryDate;
    private boolean accepted;
    private boolean expired;
    private boolean declined;
    private boolean alreadyMember;
    private InvitationMessage latestInvitationMessage;
    private Long teamId;
    private String teamName;
    private String teamDescription;
    private String invitationEmail;
    private Role intendedRole;
    private int daysValid;
    private List<AdminMember> admins;


    public InvitationInfo(Invitation invitation, FederatedUser federatedUser) {
        this.latestInvitationMessage = invitation.getLatestInvitationMessage();
        Team team = invitation.getTeam();
        this.teamId = team.getId();
        this.teamName = team.getName();
        this.teamDescription = team.getDescription();
        this.inviter = invitation.getLatestInvitationMessage().getPerson().getName();
        this.invitationEmail = invitation.getEmail();
        this.intendedRole = invitation.getIntendedRole();
        this.expiryDate = invitation.getExpiryDate() != null ? invitation.getExpiryDate().getEpochSecond() : null;
        this.declined = invitation.isDeclined();
        this.accepted = invitation.isAccepted();
        this.expired = invitation.expired();
        this.alreadyMember = team.member(federatedUser.getUrn()).isPresent();
        this.daysValid = invitation.daysValid();
        this.admins = team.getMemberships().stream()
                .filter(membership -> membership.getRole().equals(Role.ADMIN))
                .map(membership -> new AdminMember(membership.getPerson()))
                .collect(Collectors.toList());
    }
}
