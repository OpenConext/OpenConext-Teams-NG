import React from "react";
import PropTypes from "prop-types";
import {ROLES, iconForRole, labelForRole} from "../validations/memberships";

export default function IconLegend({title}) {
    return (
        <div className="icon-legend">
            {title && <h2>{title}</h2>}
            {Object.keys(ROLES).map(role =>
                <span key={role}><i className={iconForRole(role)}></i>{labelForRole(role)}</span>
            )}
        </div>);
}

IconLegend.propTypes = {
    title: PropTypes.string
};


