import I18n from "i18n-js";
import {ReactComponent as BlockedIcon} from "../icons/allowances-no-talking.svg";
import "./PrivateTeamLabel.scss";

export const PrivateTeamLabel = () => {
    return (
        <span className="private-label">
      <span>
        <BlockedIcon/>
          {I18n.t("myteams.private")}
      </span>
    </span>
    );
};
