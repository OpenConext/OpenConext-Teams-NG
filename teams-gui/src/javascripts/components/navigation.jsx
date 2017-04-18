import React from "react";
import I18n from "i18n-js";

import Spinner from "spin.js";
import spinner from "../lib/spin";

import {NavLink} from "react-router-dom";

export default class Navigation extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: false
        };
    }

    componentWillMount() {
        spinner.onStart = () => this.setState({loading: true});
        spinner.onStop = () => this.setState({loading: false});
    }

    componentDidUpdate() {
        if (this.state.loading) {
            if (!this.spinner) {
                this.spinner = new Spinner({
                    lines: 25, // The number of lines to draw
                    length: 12, // The length of each line
                    width: 2, // The line thickness
                    radius: 8, // The radius of the inner circle
                    color: "#4DB3CF", // #rgb or #rrggbb or array of colors
                    top: "20%"
                }).spin(this.spinnerNode);
            }
        } else {
            this.spinner = null;
        }
    }

    render() {
        return (
            <div className="mod-navigation">
                    {this.renderItem("/my-teams", "my_teams")}
                    {this.renderItem("/public-teams", "public_teams")}
                    {this.renderItem("/external-teams", "external_teams")}

                {this.renderSpinner()}
            </div>
        );
    }

    renderItem(href, value) {
        return (
            <NavLink activeClassName="active" to={href}>{I18n.t("navigation." + value)}</NavLink>
        );
    }

    renderSpinner() {
        return this.state.loading ? <div className="spinner" ref={spinner => this.spinnerNode = spinner}/> : null;
    }

}
