import React from "react";
import PropTypes from "prop-types";

export default function TeamsIntroductionLegend(props) {
    return (
        <div className="icon-legend">
            {props.children && props.children}
        </div>);

}

TeamsIntroductionLegend.propTypes = {
    children: PropTypes.element
};


