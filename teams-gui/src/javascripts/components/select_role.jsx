import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import "react-select/dist/react-select.css";
import {iconForRole, ROLES} from "../validations/memberships";
import I18n from "i18n-js";

export default class SelectRole extends React.PureComponent {

    constructor(props) {
        super(props);
        this.ROLE_OPTIONS = {
            ADMIN: {value: ROLES.ADMIN.role, label: I18n.t("icon_legend.admin")},
            MANAGER: {value: ROLES.MANAGER.role, label: I18n.t("icon_legend.manager")},
            MEMBER: {value: ROLES.MEMBER.role, label: I18n.t("icon_legend.member")}
        };

    }

    renderOption = option => {
        return (
            <span className="select-option">
                <span className="select-label">
                    <i className={iconForRole(option.value)}></i>{option.label}
                </span>
            </span>
        );
    };

    options = (roleOfCurrentUserInTeam, isOnlyAdmin, isCurrentUser, role) => {
        if (isCurrentUser && isOnlyAdmin) {
            return [this.ROLE_OPTIONS.ADMIN];
        }
        if (roleOfCurrentUserInTeam === ROLES.ADMIN.role) {
            return [this.ROLE_OPTIONS.ADMIN, this.ROLE_OPTIONS.MANAGER, this.ROLE_OPTIONS.MEMBER];
        }
        if (roleOfCurrentUserInTeam === ROLES.MANAGER.role && role === ROLES.MEMBER.role) {
            return [this.ROLE_OPTIONS.MANAGER, this.ROLE_OPTIONS.MEMBER];
        }
        return [this.ROLE_OPTIONS[role]];
    };

    render() {
        const {onChange, role, roleOfCurrentUserInTeam, isCurrentUser, isOnlyAdmin, disabled} = this.props;
        const options = this.options(roleOfCurrentUserInTeam, isOnlyAdmin, isCurrentUser, role);
        return <Select className="select-role"
                       onChange={onChange}
                       optionRenderer={this.renderOption}
                       options={options}
                       value={role}
                       searchable={false}
                       valueRenderer={this.renderOption}
                       disabled={disabled || options.length === 1}/>;
    }


}

SelectRole.propTypes = {
    onChange: PropTypes.func.isRequired,
    role: PropTypes.string.isRequired,
    roleOfCurrentUserInTeam: PropTypes.string,
    isCurrentUser: PropTypes.bool,
    isOnlyAdmin: PropTypes.bool,
    disabled: PropTypes.bool
};


