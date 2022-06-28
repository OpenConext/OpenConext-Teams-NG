import surfLogo from "../icons/SURF.svg";
import arrowDown from "../icons/arrow-down-1.svg";
import arrowUp from "../icons/arrow-up-1.svg";
import {useState} from "react";
import I18n from "i18n-js";
import "./Header.scss";
import {Link} from "react-router-dom";
import {CheckBox} from "./CheckBox";
import {unmountComponentAtNode} from "react-dom";
import {logOut} from "../api";


export const Header = ({user, toggleSuperAdminModus}) => {

    const [droppedDown, setDroppedDown] = useState(false);

    const doToggleSuperAdminModus = e => {
        toggleSuperAdminModus(e.target.checked);
    }

    const doLogOut = e => {
        e.preventDefault();
        const node = document.getElementById("app");
        unmountComponentAtNode(node);
        logOut();
        window.location.href = "/Shibboleth.sso/Logout";
    };


    return (
        <div className="header-container">
            <div className="header">
                <Link to="/" className="logo-container">
                    <img src={surfLogo} alt="SURF" />
                    <span className="conext">CONEXT</span>
                    <span className="idp-dashboard">Teams</span>
                </Link>
                {user.superAdmin &&
                <CheckBox className="checkbox super-admin"
                          onChange={doToggleSuperAdminModus}
                          value={user.superAdminModus}
                          name="super_admin"
                          info={I18n.t("header.superAdmin.modus")}/>}
                <div className="user-info">
                    <div className="user">
                        <span className="name">{user.person.name}</span>
                        <span className="role">{I18n.t(`profile.${user.person.guest ? "guest" : "admin"}`)}</span>
                    </div>
                    <div className="user-toggle"
                         onClick={() => setDroppedDown(!droppedDown)}
                         tabIndex="1"
                         onBlur={() => setTimeout(() => setDroppedDown(false), 125)}>
                        <img src={droppedDown ? arrowUp : arrowDown} alt="drop"/>
                    </div>
                    {droppedDown && <div className="user-drop-down">
                        <div>
                            <span className="value">{user.person.email}</span>
                        </div>
                        <div>
                            <span className="value">
                                <a href="/logout" onClick={e => doLogOut(e)}>{I18n.t("profile.logout")}</a>
                            </span>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}