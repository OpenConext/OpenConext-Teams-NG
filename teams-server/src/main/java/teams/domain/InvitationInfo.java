package teams.domain;

import lombok.Getter;

@Getter
public class InvitationInfo {

    private  InvitationMessage latestInvitationMessage;
    private  String teamName;
    private  String teamDescription;
    private  String invitationEmail;
    private  Role intendedRole;

    public InvitationInfo(Invitation invitation) {
        this.latestInvitationMessage = invitation.getLatestInvitationMessage();
        this.teamName = invitation.getTeam().getName();
        this.teamDescription = invitation.getTeam().getDescription();
        this.invitationEmail = invitation.getEmail();
        this.intendedRole = invitation.getIntendedRole();
    }
}
