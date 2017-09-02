import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default function Footer({currentUser, isEn}) {
    return (
        <div className="footer">
            <div className="footer-inner">
                <span><a href={isEn ? currentUser.config.helpLinkEn : currentUser.config.helpLinkNl} target="_blank">{currentUser.productName}</a></span>
                <span><a href={isEn ? currentUser.config.helpTosEn : currentUser.config.helpTosNl} target="_blank">{I18n.t("footer.terms")}</a></span>
                <span><a href={`mailto:${currentUser.config.supportEmail}`} target="_blank">{currentUser.config.supportEmail}</a></span>
            </div>
        </div>
    );
}

Footer.propTypes = {
    currentUser: PropTypes.object.isRequired,
    isEn: PropTypes.bool.isRequired
};
