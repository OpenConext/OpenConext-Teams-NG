import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default function Footer({currentUser}) {
    return (
        <div className="footer">
            <div className="footer-inner">
                <span><a href={I18n.locale === "en" ? currentUser.config.helpLinkEn : I18n.locale === "nl" ? currentUser.config.helpLinkNl : currentUser.config.helpLinkPt} target="_blank">{currentUser.productName}</a></span>
                <span><a href={I18n.locale === "en" ? currentUser.config.helpTosEn : I18n.locale === "nl" ? currentUser.config.helpTosNl : currentUser.config.helpTosPt} target="_blank">{I18n.t("footer.terms")}</a></span>
                <span><a href={`mailto:${currentUser.config.supportEmail}`} target="_blank">{currentUser.config.supportEmail}</a></span>
            </div>
        </div>
    );
}

Footer.propTypes = {
    currentUser: PropTypes.object.isRequired,
    isEn: PropTypes.bool.isRequired
};
