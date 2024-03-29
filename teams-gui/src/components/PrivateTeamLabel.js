import I18n from "i18n-js";
import {ReactComponent as BlockedIcon} from "../icons/view-off.svg";
import "./PrivateTeamLabel.scss";

export const PrivateTeamLabel = () => {
    return (
        <span className="private-label">
            <BlockedIcon/>
            <span>{I18n.t("myteams.private")}</span>
        </span>
    );
};
