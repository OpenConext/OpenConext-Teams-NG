import React from "react";
import PropTypes from "prop-types";
import I18n from "i18n-js";

export default function TeamsDetailsLegend(props) {
    return (
        <div className="icon-legend">
            {props.children && props.children}
            <section className="roles">
                <span className="role"><i className="fa fa-pencil"></i>
                    {I18n.t("team_detail.edit")}
                </span>
                <span className="role"><i className="fa fa-clone"></i>
                    {I18n.t("team_detail.copy")}
                </span>
            </section>
        </div>);

}

TeamsDetailsLegend.propTypes = {
    children: PropTypes.element
};


