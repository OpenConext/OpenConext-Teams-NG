import React from "react";
import PropTypes from "prop-types";

export default function PublicLinkInfo({team, locale = "en"}) {
    return locale === "en" ?
        <div className="invitation_info">
            <p className="info">You can join team {team.name} and become a regular member.</p>
            <span className="by-file">If you don't want to become a member then cancel this operation.</span>
        </div> : locale === "nl" ?
            <div className="invitation_info">
                <p className="info">Je kan lid worden van team {team.name} met als rol member.</p>
                <span className="by-file">Mocht je geen lid willen worden dan kan je dit annuleren.</span>
            </div> :
            <div className="invitation_info">
                <p className="info">Você pode participar do time {team.name} e se tornar um membro regular.</p>
                <span className="by-file">Se você não quiser se tornar um membro, cancele esta operação.</span>
            </div>;

}

PublicLinkInfo.propTypes = {
    locale: PropTypes.string.isRequired,
    team: PropTypes.object.isRequired
};

