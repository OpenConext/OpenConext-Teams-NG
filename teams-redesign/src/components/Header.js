import surfLogo from "../icons/SURF.svg";
import arrowDown from "../icons/arrow-down-1.svg";
import arrowUp from "../icons/arrow-up-1.svg";
import {useState} from "react";
import I18n from "i18n-js";
import "./Header.scss";


export const Header = ({user}) => {

    const [droppedDown, setDroppedDown] = useState(false);

    return (
        <div className="header-container">
            <div className="header">
                <img src={surfLogo} alt=""/>
                <h2 className="conext">Conext Teams</h2>
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