import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import "react-select/dist/react-select.css";
import {iconForRole, labelForRole, ROLES} from "../validations/memberships";

const roleOptions = [ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER].map(role => {
    return {value: role.role, label: labelForRole(role.role)};
});

export default class SelectRole extends React.Component {

    renderOption = option => {
        return (
            <span className="select-option">
                <span className="select-label">
                    <i className={iconForRole(option.value)}></i>{option.label}
                </span>
            </span>
        );
    };

    render() {
        const isAdminInTeam = this.props.roleOfCurrentUserInTeam === "ADMIN";
        return <Select className="select-role"
                       onChange={this.props.onChange}
                       optionRenderer={this.renderOption}
                       options={roleOptions.filter(option => isAdminInTeam || option.value === ROLES.MEMBER.role)}
                       value={this.props.role}
                       searchable={false}
                       valueRenderer={this.renderOption}/>;
    }


}

SelectRole.propTypes = {
    onChange: PropTypes.func.isRequired,
    role: PropTypes.string.isRequired,
    roleOfCurrentUserInTeam: PropTypes.string.isRequired
};


