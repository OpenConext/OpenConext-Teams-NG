import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default class SortDropDown extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {dropDownActive: false};
    }

    itemOrder = item => item.current && item.order === "down" ? "up" : "down"

    sort = (sortBy, item) => () => {
        this.setState({dropDownActive: false});
        sortBy(item);
    };

    renderDropDownItem = (item, sortBy) =>
            <li key={item.name} onClick={this.sort(sortBy, item)} className={item.current ? "current" : ""}>
                <span>{I18n.t(`sort.${item.name}`)}</span>
                <span><i className={`fa fa-caret-${this.itemOrder(item)}`}/></span>
            </li>;

    renderDropDown = (items, sortBy) =>
            <ul className="drop-down">
                {items.map(item => this.renderDropDownItem(item, sortBy))}
            </ul>;


    render() {
        const {items, sortBy} = this.props;
        const {dropDownActive} = this.state;
        const currentItem = items.filter(item => item.current)[0];

        return (
            <section className="sort-drop-down" tabIndex="1" onBlur={() => setTimeout(() => this.setState({dropDownActive: false}), 350)}>
                <div className="selected" onClick={() => this.setState({dropDownActive: !dropDownActive})}>
                    <span className="sort-label">{I18n.t("sort.label")}</span>
                    <span className="sort-label-divider">:</span>
                    <span className="sort-name">{I18n.t(`sort.${currentItem.name}`)}</span>
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