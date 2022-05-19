import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default function MissingAttributes({currentUser}) {
    return (
        <div className="mod-server-error">
            <h1>{I18n.t("server_error.missing_attribute", {productName: currentUser.productName})}</h1>
            <h3 dangerouslySetInnerHTML={{
                __html: I18n.t("server_error.missing_attribute_description_html",
                    {
                        helpUrl: I18n.locale === "en" ? currentUser.config.helpLinkEn : currentUser.config.helpLinkNl,
                        productName: currentUser.productName
                    })
            }}/>
            <h3 className="not-provided">{I18n.t("server_error.missing_attribute_not_provided")}</h3>
            {!currentUser.person.email && <h3>{I18n.t("profile.email")}</h3>}
            {!currentUser.person.name && <h3>{I18n.t("profile.name")}</h3>}
        </div>
    );
}

MissingAttributes.propTypes = {
    currentUser: PropTypes.object.isRequired
};
