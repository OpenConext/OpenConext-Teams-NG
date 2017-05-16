import React from "react";
import PropTypes from "prop-types";

export default function PublicLinkInfo({team, locale = "en"}) {
    return locale === "en" ?
        <div className="invitation_info">
            <p className="info">You can join team {team.name} and become a regular member.</p>
            <span className="by-file">If you don't want to become a member then cancel this operation.</span>
        </div> :
        <div className="invitation_info">
            <p className="info">Je kan lid worden van team {team.name} met als rol member.</p>
            <span className="by-file">Mocht je geen lid willen worden dan kan je dit annuleren.</span>
        </div>;

}

PublicLinkInfo.propTypes = {
    locale: PropTypes.string.isRequired,
    team: PropTypes.object.isRequired
};

