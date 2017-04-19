import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default function UserProfile({currentUser}) {
    return (
        <ul className="user-profile">
            <li>test2</li>
            <li>
                {currentUser.person.email}
            </li>
            <li>
                {I18n.t("profile." + currentUser.person.guest)}
            </li>
        </ul>);

}

UserProfile.propTypes = {
    currentUser: PropTypes.object.isRequired
};


