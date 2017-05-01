import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default class DatePickerCustom extends React.Component {

    render() {
        const value = this.props.value || I18n.t("invite.expiry_date_none");
        return (
            <div className="date_picker_custom" onClick={this.props.onClick}>
                <a href="#">
                    {value}
                </a>
                <span><i className="fa fa-calendar"></i></span>
            </div>
        );
    }
}

DatePickerCustom.propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};