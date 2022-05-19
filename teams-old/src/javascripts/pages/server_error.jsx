import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default function ServerError({currentUser}) {
    return (
        <div className="mod-server-error">
            <h1>{I18n.t("server_error.title")}</h1>
            <p dangerouslySetInnerHTML={{
                __html: I18n.t("server_error.description_html",
                    {helpMail: currentUser.config.supportEmail})
            }}/>
        </div>
    );
}
ServerError.propTypes = {
    currentUser: PropTypes.object.isRequired
};
