import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import {render, unmountComponentAtNode} from "react-dom";
import {Link} from "react-router-dom";
import logo from "../../images/logo.jpg";
import LanguageSelector from "./language_selector";
import UserProfile from "./user_profile";
import Logout from "../pages/logout";

export default class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            dropDownActive: false
        };
    }

    render() {
        const currentUser = this.props.currentUser;
        return (
            <div className="mod-header">
                <Link to="/" className="logo"><img src={logo}/></Link>
                <ul className="links">
                    <li>
                        {this.renderProfileLink(currentUser)}
                        {this.renderDropDown(currentUser)}
                    </li>
                    <li dangerouslySetInnerHTML={{__html: I18n.t("header.links.help_html")}}></li>
                    {this.renderExitLogout()}
                    <li>
                        <LanguageSelector />
                    </li>
                </ul>
            </div>
        );
    }

    renderProfileLink(currentUser) {
        const welcome = I18n.t("header.welcome") + " " + currentUser.username;
        return (
            <a href="#" className="welcome-link" onClick={this.handleToggle.bind(this)}>
                {welcome}
                {this.renderDropDownIndicator()}
            </a>
        );
    }

    renderDropDownIndicator() {
        return this.state.dropDownActive ? <i className="fa fa-caret-up"/> : <i className="fa fa-caret-down"/>;
    }

    renderDropDown(currentUser) {
        return this.state.dropDownActive ? <UserProfile currentUser={currentUser}/> : null;
    }


    renderExitLogout() {
        return (
            <li className="border-left"><a href="#" onClick={this.stop.bind(this)}>{I18n.t("header.links.logout")}</a>
            </li>
        );
    }

    stop(e) {
        e.preventDefault();
        const node = document.getElementById("app");
        unmountComponentAtNode(node);
        render(<Logout />, node);
    }

    handleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({dropDownActive: !this.state.dropDownActive});
    }
}

Header.propTypes = {
    currentUser: PropTypes.object.required
};
