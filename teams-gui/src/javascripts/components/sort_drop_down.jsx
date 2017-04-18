import React from "react";
import I18n from "i18n-js";

class SortDropDown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {dropDownActive: false};
    }

    renderDropDownItem(item) {
        return (<li key={item.name}>
            <span>{I18m.t(item.name)}</span>
            <span><i className={`fa fa-caret-${item.order}`}/></span>
        </li>);
    }

    renderDropDown(items) {
        if (!this.state.dropDownActive) {
            return null;
        }
        return (
            <ul className="drop-down">
                {items.map((item) => this.renderDropDownItem(item))}
            </ul>
        );
    }


    render() {
        const {items, sortBy} = this.props;
        const {dropDownActive} = this.state;
        const currentItem = items.filter((item) => item.current)[0];

        return (
            <section className="sort">
                <div>
                    <span className="sort-label">{I18n.t("sort.label")}</span>
                    <span className="sort-label-divider">:</span>
                    <span className="sort-name">{currentItem.name}</span>
                    <span><i className={`fa fa-caret-${currentItem.order}`}/></span>
                </div>
                {dropDownActive && this.renderDropDown(items)}
            </section>);
    }

}
export default SortDropDown;