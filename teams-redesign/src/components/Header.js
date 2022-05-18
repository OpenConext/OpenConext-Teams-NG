import surfLogo from "../icons/SURF.svg";
import arrowDown from "../icons/arrow-down-1.svg";
import arrowUp from "../icons/arrow-up-1.svg";
import {useState} from "react";
import I18n from "i18n-js";
import "./Header.scss";
import {Link} from "react-router-dom";
import {CheckBox} from "./CheckBox";


export const Header = ({user, toggleSuperAdminModus}) => {

    const [droppedDown, setDroppedDown] = useState(false);

    const doToggleSuperAdminModus = e => {
        toggleSuperAdminModus(e.target.checked);
    }

    return (
        <div className="header-container">
            <div className="header">
                <Link className={"home"} to={"/"}>
                    <img src={surfLogo} alt=""/>
                </Link>
                <h2 className="conext">Conext Teams</h2>
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
                         tabIndex="1" onBlur={() => setDroppedDown(false)}>
                        <img src={droppedDown ? arrowUp : arrowDown} alt="drop"/>
                    </div>
                    {droppedDown && <div className="user-drop-down">
                        <div>
                            <span>{`${I18n.t("profile.email")}:`}</span>
                            <span className="value">{user.person.email}</span>
                        </div>
                        <div>
                            <span>{`${I18n.t("profile.role")}:`}</span>
                            <span
                                className="value">{I18n.t("profile." + user.person.guest, {productName: user.productName})}</span>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}