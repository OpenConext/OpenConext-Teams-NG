import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import {unmountComponentAtNode} from "react-dom";
import {Link} from "react-router-dom";
import SURFconext from "../../images/logo@2x.png";
import OpenConext from "../../images/open-conext-logo.png";
import RCTSaai from "../../images/rctsaai_blue.svg";
import LanguageSelector from "./language_selector";
import UserProfile from "./user_profile";
import {logOut} from "../api";

export default class Header extends React.PureComponent {

    constructor() {
        super();
        this.state = {
            dropDownActive: false
        };
    }

    renderProfileLink(currentUser) {
        return (
            <a className="welcome-link" onClick={this.handleToggle.bind(this)}>
                <i className="fa fa-user-circle-o"></i>
                {currentUser.username}
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


    renderExitLogout = () =>
        <li className="border-left"><a onClick={this.stop}>{I18n.t("header.links.logout")}</a>
        </li>;

    stop = e => {
        e.preventDefault();
        const node = document.getElementById("app");
        unmountComponentAtNode(node);
        logOut();
        window.location.href = "/Shibboleth.sso/Logout";
    };

    handleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({dropDownActive: !this.state.dropDownActive});
    }

    render() {
        const currentUser = this.props.currentUser;
        const validCurrentUser = currentUser.person.id && currentUser.person.email && currentUser.person.name && currentUser.productName;
        const organization = currentUser.config.organization;
        const titleClassName = `title ${organization === "RCTSaai" ? "pt" : ""}`;
        return (
            <div className="header-container">
                <div className="header">
                    {organization === "SURFconext" && <Link to="/" className="logo"><img src={SURFconext}/></Link>}
                    {organization === "OpenConext" && <Link to="/" className="logo"><img src={OpenConext}/></Link>}
                    {organization === "RCTSaai" && <Link to="/" className="logo"><img src={RCTSaai}/></Link>}
                    <ul className="links">
                        <li className={titleClassName}><span>{I18n.t("header.title")}</span></li>
                        {validCurrentUser && <li className="profile"
                            tabIndex="1" onBlur={() => this.setState({dropDownActive: false})}>
                            {this.renderProfileLink(currentUser)}
                            {this.renderDropDown(currentUser)}
                        </li>}
                        {currentUser.config && <li>
                            <a href={I18n.locale === "en" ? currentUser.config.helpLinkEn : I18n.locale === "nl" ? currentUser.config.helpLinkNl : currentUser.config.helpLinkPt} target="_blank">{I18n.t("header.links.help")}</a></li>}
                        {this.renderExitLogout()}
                        <li>
                            <LanguageSelector supportedLanguageCodes={currentUser.config.supportedLanguageCodes} />
                        </li>
                    </ul>
                </div>
            </div>
        );
    }

}

Header.propTypes = {
    currentUser: PropTypes.object.isRequired
};
