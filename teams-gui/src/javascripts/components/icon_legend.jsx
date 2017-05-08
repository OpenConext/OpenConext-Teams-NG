import React from "react";
import PropTypes from "prop-types";
import {ROLES, iconForRole, labelForRole} from "../validations/memberships";

export default function IconLegend(props) {
    return (
        <div className="icon-legend">
            {props.title && <h2>{props.title}</h2>}
            {props.children && props.children}
            {Object.keys(ROLES).map(role =>
                <span className="role" key={role}><i className={iconForRole(role)}></i>{labelForRole(role)}</span>
            )}
        </div>);
}

IconLegend.propTypes = {
    title: PropTypes.string,
    children: PropTypes.element
};


