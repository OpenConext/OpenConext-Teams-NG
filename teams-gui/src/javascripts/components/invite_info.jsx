import React from "react";
import PropTypes from "prop-types";

export default function InviteInfo({locale = "en", personEmailPickerEnabled = true}) {
    const text = personEmailPickerEnabled ? "Search and add " : "Add ";
    const textNl = personEmailPickerEnabled ? "Zoek en voeg " : "Voeg ";
    return locale === "en" ?
        <div className="invitation_info">
            <p className="info">{text}the email addresses of colleagues you would like to invite for this team.</p>
            <p className="by-email">You can invite one or more people.</p>
            <span className="by-file">To send multiple invitations, simply add more email
                addresses or upload a csv file with comma-separated email addresses.</span>
        </div> :
        <div className="invitation_info">
            <p className="info">{textNl}de e-mailadressen van je collega's toe die je wilt uitnodigen voor dit team.</p>
            <p className="by-email">Je kan één of meer personen uitnodigen.</p>
            <p className="by-file">Je kan meerdere uitnodigingen versturen door meerdere e-mailadressen te selecteren
                of je kunt een csv-bestand met kommagescheiden e-mailadressen uploaden.</p>
        </div>;

}

InviteInfo.propTypes = {
    locale: PropTypes.string,
    personEmailPickerEnabled: PropTypes.bool
};

