import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default function Footer({currentUser}) {
    return (
        <div className="footer">
            <div className="footer-inner">
            <span dangerouslySetInnerHTML={{__html: I18n.t("footer.surfnet_html", {productName: currentUser.productName})}}></span>
            <span dangerouslySetInnerHTML={{__html: I18n.t("footer.terms_html")}}></span>
            <span dangerouslySetInnerHTML={{__html: I18n.t("footer.contact_html")}}></span>
            </div>
        </div>
    );
}

Footer.propTypes = {
    currentUser: PropTypes.object.isRequired
};
