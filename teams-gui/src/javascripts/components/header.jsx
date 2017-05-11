import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import {render, unmountComponentAtNode} from "react-dom";
import {Link} from "react-router-dom";
import logo from "../../images/logo@2x.png";
import LanguageSelector from "./language_selector";
import UserProfile from "./user_profile";
import Logout from "../pages/logout";
import {isEmpty} from "../utils/utils";
import {emitter, getFlash} from "../utils/flash";

export default class Header extends React.Component {

    constructor() {
        super();
        this.state = {
            dropDownActive: false,
            withFlash: false
        };
        this.callback = flash => this.setState({withFlash: !isEmpty(flash) && !isEmpty(flash.message)});
    }

    componentWillMount() {
        this.callback(getFlash());
        emitter.addListener("flash", this.callback);
        emitter.addListener("clear_flash", this.callback);
    }

    componentWillUnmount() {
        emitter.removeListener("flash", this.callback);
        emitter.removeListener("clear_flash", this.callback);
    }
    renderProfileLink(currentUser) {
        return (
            <a href="#" className="welcome-link" onClick={this.handleToggle.bind(this)}>
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
            <li className="border-left"><a href="#" onClick={this.stop}>{I18n.t("header.links.logout")}</a>
            </li>;

    stop = e => {
        e.preventDefault();
        const node = document.getElementById("app");
        unmountComponentAtNode(node);
        render(<Logout />, node);
    };

    handleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({dropDownActive: !this.state.dropDownActive});
    }

    render() {
        const currentUser = this.props.currentUser;
        const classNameHeader = `header ${this.state.withFlash ? "with-flash" : ""}`;
        return (
            <div className="header-container">
                <div className={classNameHeader}>
                    <Link to="/" className="logo"><img src={logo}/></Link>
                    <ul className="links">
                        <li className="title"><span>Teams</span></li>
                        <li className="profile"
                            tabIndex="1" onBlur={() => this.setState({dropDownActive : false})}>
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
            </div>
        );
    }

}

Header.propTypes = {
    currentUser: PropTypes.object.isRequired
};
