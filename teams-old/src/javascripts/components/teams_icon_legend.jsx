import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";

export default function TeamsIconLegend(props) {
    return (
        <div className="icon-legend">
            {props.children && props.children}
            <section className="roles">
                <span className="role"><i className="fa fa-building-o"></i>
                    {I18n.t("institution_teams.institution_team")}
                </span>
                <span className="role"><i className="fa fa-users"></i>
                    {props.currentUser.productName}
                </span>
            </section>
        </div>);

}

TeamsIconLegend.propTypes = {
    currentUser: PropTypes.object.isRequired,
    children: PropTypes.element
};


