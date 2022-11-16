import surfLogo from "../icons/SURF.svg";
import arrowDown from "../icons/arrow-down-1.svg";
import arrowUp from "../icons/arrow-up-1.svg";
import {useState} from "react";
import I18n from "i18n-js";
import "./Header.scss";
import {Link} from "react-router-dom";
import {CheckBox} from "./CheckBox";
import {logOut} from "../api";


export const Header = ({user, toggleSuperAdminModus}) => {

    const [droppedDown, setDroppedDown] = useState(false);

    const doToggleSuperAdminModus = () => {
        toggleSuperAdminModus();
    }

    const doLogOut = e => {
        if (e) {
            e.preventDefault();
        }
        logOut().then(res => {
            window.location.href = res.url;
        });
    };

    const onKeyDown = e => {
        if (e.key === "Escape" || e.key === "ArrowUp") {
            setDroppedDown(false);
        } else if (e.key === "ArrowDown") {
            setDroppedDown(true);
        } else if (e.key === " " && droppedDown) {
            doLogOut(e);
        }
    }

    return (
        <>
            <div className="skiplink">
                <a href="#content">Naar hoofdinhoud</a>
            </div>
            <header className="header-container">
                <div className="header">
                    <Link to="/" className="logo-container">
                        <img src={surfLogo} alt="SURF"/>
                        <span className="conext">CONEXT</span>
                        <span className="idp-dashboard">Teams</span>
                    </Link>
                    {user.superAdmin &&
                    <CheckBox className="checkbox super-admin"
                              onChange={doToggleSuperAdminModus}
                              value={user.superAdminModus || false}
                              name="super_admin"
                              info={I18n.t("header.superAdmin.modus")}/>}
                    <nav aria-label="account" className="user-info">
                        <button
                            className="user"
                            aria-expanded={droppedDown ? "true" : "false"}
                            onKeyDown={onKeyDown}
                            onBlur={() => setTimeout(() => setDroppedDown(false), 250)}
                            onClick={() => setDroppedDown(!droppedDown)}>
                            <span className="user text name">{user.person.name}</span>
                            <div className="user-toggle">
                                <img src={droppedDown ? arrowUp : arrowDown} alt="" aria-hidden="true"/>
                            </div>
                            <div className={`user-drop-down ${droppedDown ? "" : "visually-hidden"}`}>
                                <span className="value">{user.person.email}</span>
                                <span className="value focus">
                                <a href="/logout" onClick={e => doLogOut(e)}>{I18n.t("profile.logout")}</a>
                            </span>
                            </div>
                        </button>
                    </nav>
                </div>
            </header>
        </>
    );
}