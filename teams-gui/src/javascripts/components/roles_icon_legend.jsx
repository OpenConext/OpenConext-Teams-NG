import React from "react";
import PropTypes from "prop-types";
import {iconForRole, labelForRole, ROLES} from "../validations/memberships";

export default function RolesIconLegend(props) {
  return (
    <div className="icon-legend">
      {props.children && props.children}
      <section className="roles">
        {Object.keys(ROLES).filter(role => (props.includeInvitation || role !== ROLES.INVITATION.role)
          && (props.includeOwner || role !== ROLES.OWNER.role))
          .map(role =>
            <span className="role" key={role}><i className={iconForRole(role)}></i>{labelForRole(role)}</span>
          )}
      </section>
    </div>);
}

RolesIconLegend.propTypes = {
  children: PropTypes.element,
  includeInvitation: PropTypes.bool,
  includeOwner: PropTypes.bool
};


