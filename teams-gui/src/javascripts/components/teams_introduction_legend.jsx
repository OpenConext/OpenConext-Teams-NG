import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";

export default function TeamsIntroductionLegend(props) {
    return (
        <div className="icon-legend">
            {props.children && props.children}
        </div>);

}

TeamsIntroductionLegend.propTypes = {
    children: PropTypes.element
};


