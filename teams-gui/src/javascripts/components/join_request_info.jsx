import React from "react";
import PropTypes from "prop-types";


export default function JoinRequestInfo({team, locale = "en"}) {
    return locale === "en" ?
        <div className="join_request_info">
            <p className="info">The administrators of the {team.name} will receive an email with request
                to join the {team.name}.</p>
            <p className="by-email">If for some reason you want to contact one of the administrators you can use the mail link.</p>
        </div> :
        <div className="join_request_info">
            <p className="info">De administrators van {team.name} zullen een email ontvangen met daarin je verzoek om
                lid te worden van {team.name}.</p>
            <p className="by-email">Je kan eventueel direct contact nemen met één van de administrators middels de email link.</p>
        </div>;

}

JoinRequestInfo.propTypes = {
    team: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired
};

