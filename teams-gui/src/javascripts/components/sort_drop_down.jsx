import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default class SortDropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {dropDownActive: false};
    }

    renderDropDownItem(item, sortBy) {
        return (
            <li key={item.name} onClick={sortBy(item)}>
                <span>{I18n.t(item.name)}</span>
                <span><i className={`fa fa-caret-${item.order}`}/></span>
            </li>
        );
    }

    renderDropDown(items, sortBy) {
        if (!this.state.dropDownActive) {
            return null;
        }
        return (
            <ul className="drop-down">
                {items.map(item => this.renderDropDownItem(item, sortBy))}
            </ul>
        );


    }


    render() {
        const {items, sortBy} = this.props;
        const {dropDownActive} = this.state;
        const currentItem = items.filter(item => item.current)[0];

        return (
            <section className="sort-drop-down">
                <div>
                    <span className="sort-label">{I18n.t("sort.label")}</span>
                    <span className="sort-label-divider">:</span>
                    <span className="sort-name">{currentItem.name}</span>
                    <span><i className={`fa fa-caret-${currentItem.order}`}/></span>
                </div>
                {dropDownActive && this.renderDropDown(items, sortBy)}
            </section>);
    }

}

SortDropDown.propTypes = {
    items: PropTypes.array.isRequired,
    sortBy: PropTypes.func.isRequired
};