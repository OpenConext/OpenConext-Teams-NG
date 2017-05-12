import React from "react";
import PropTypes from "prop-types";

export default function InvitationInfo({invitation, locale = "en"}) {
    return locale === "en" ?
        <div className="invitation_info">
            <p className="info">You have been invited by {invitation.inviter} to join team {invitation.teamName}.</p>
            <span className="by-file">This invitation will expire in {invitation.daysValid} days.</span>
        </div> :
        <div className="invitation_info">
            <p className="info">je bent door {invitation.inviter} uitgenodigd om lid te worden van het
                team {invitation.teamName}.</p>
            <p className="by-file">Deze uitnodiging verloopt over {invitation.daysValid} dagen.</p>
        </div>;

}

InvitationInfo.propTypes = {
    locale: PropTypes.string.isRequired,
    invitation: PropTypes.object.isRequired
};

