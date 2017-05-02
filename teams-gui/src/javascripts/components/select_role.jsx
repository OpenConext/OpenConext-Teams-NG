import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import "react-select/dist/react-select.css";

const roleOptions = [{value: "ADMIN", label: "Admin"}, {value: "MANAGER", label: "Manager"}, {value: "MEMBER", label: "Member"}];

export default class SelectRole extends React.Component {

    renderOption = option => {
        return (
            <span className="select-option">
                <span className="select-label">
                    <i className={`fa fa-user ${option.value.toLowerCase()}`}></i>
                    {option.label}</span>
            </span>
        );
    };

    render() {
        const isAdminInTeam = this.props.roleOfCurrentUserInTeam === "ADMIN";
        return <Select className="select-role"
                       onChange={this.props.onChange}
                       optionRenderer={this.renderOption}
                       options={roleOptions.filter(option => isAdminInTeam || option.value === "MEMBER")}
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


