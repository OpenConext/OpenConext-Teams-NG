import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default function IconLegend({title}) {
    return (
        <div className="icon-legend">
            <h2>{title}</h2>
            <span><i className="fa fa-star"></i>{I18n.t("icon_legend.admin")}</span>
            <span><i className="fa fa-user"></i>{I18n.t("icon_legend.manager")}</span>
            <span><i className="fa fa-user-o"></i>{I18n.t("icon_legend.member")}</span>
            <span><i className="fa fa-clock-o"></i>{I18n.t("icon_legend.invitation")}</span>
            <span><i className="fa fa-envelope"></i>{I18n.t("icon_legend.join_request")}</span>
        </div>);

}

IconLegend.propTypes = {
    title: PropTypes.string.isRequired
};


