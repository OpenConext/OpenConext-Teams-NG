import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default function NotFound({currentUser}) {
    return (
        <div className="mod-not-found">
            <h1>{I18n.t("not_found.title")}</h1>
            <p dangerouslySetInnerHTML={{__html: I18n.t("not_found.description_html", {helpMail: currentUser.config.supportEmail})}}/>
        </div>
    );
}
NotFound.propTypes = {
    currentUser: PropTypes.object.isRequired
};

