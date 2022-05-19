import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default function UserProfile({currentUser}) {
    return (
        <ul className="user-profile">
            <li>
                <span>{`${I18n.t("profile.email")}:`}</span>
                <span className="value">{currentUser.person.email}</span>
            </li>
            <li>
                <span>{`${I18n.t("profile.role")}:`}</span>
                <span  className="value">{I18n.t("profile." + currentUser.person.guest, {productName: currentUser.productName})}</span>

            </li>
        </ul>);

}

UserProfile.propTypes = {
    currentUser: PropTypes.object.isRequired
};


