import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
//import scrollIntoView from "scroll-into-view";

export default class DropDownActions extends React.Component {

    componentDidMount() {
        //todo - is this a UI improvement
        //scrollIntoView(this.me);
    }

    render() {
        const {options, i18nPrefix, className} = this.props;
        return (
            <section className={className || "drop-down-actions"} ref={ref => this.me = ref}>
                {options.map((option, index) =>
                        <span key={index} onClick={option.action}>
                    <i className={option.icon}></i>{I18n.t(`${i18nPrefix}.${option.label}`)}
                </span>
                )}
            </section>
        );

    }

}

DropDownActions.propTypes = {
    options: PropTypes.array.isRequired,
    i18nPrefix: PropTypes.string.isRequired,
    className: PropTypes.string
};


