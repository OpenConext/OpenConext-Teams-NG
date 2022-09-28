import I18n from "i18n-js";
import {React, useState} from "react";
import "./ExternalTeamsForm.scss";
import {ReactComponent as BackIcon} from "../icons/arrow-left-1.svg";
import ToggleSwitch from "./ToggleSwitch";
import {delinkExternalTeam, linkExternalTeam} from "../api";
import {SpinnerField} from "./SpinnerField";

export const ExternalTeamsForm = ({setShowForm, user, team, updateTeam}) => {

    const [loaded, setLoaded] = useState(true);

    const isInstitutionalTeamLinked = externalTeam => {
        return team.externalTeams && team.externalTeams
            .filter(et => et.identifier === externalTeam.identifier).length > 0;
    };

    const toggleLinked = (checked, externalTeam) => {
        setLoaded(false);
        const promise = checked ? linkExternalTeam : delinkExternalTeam;
        promise(team.id, externalTeam.identifier).then(() => {
            updateTeam();
            setLoaded(true);
        })

    }

    if (!loaded) {
        return <SpinnerField/>;
    }

    return (
        <div className="external-teams-form-container">
            <div className="back" onClick={() => {
                setShowForm(false);
                window.scrollTo(0, 0);
            }}>
                <BackIcon/><span>{I18n.t("forms.back")}</span>
            </div>
            <h2>{I18n.t("externalTeams.header")}</h2>
            <p>{I18n.t("externalTeams.info", {productName: user.productName})}</p>
            <p className="last">{I18n.t("externalTeams.info2", {productName: user.productName})}</p>

            <table className={"institutional-teams"}>
                <thead>
                <tr>
                    <th className={"name"}>{I18n.t("externalTeams.table.name")}</th>
                    <th className={"linked"}>{I18n.t("externalTeams.table.linked")}</th>
                </tr>
                </thead>
                <tbody>
                {user.externalTeams.map((externalTeam, index) => <tr key={index}>
                    <td>{externalTeam.identifier}</td>
                    <td>
                        <ToggleSwitch value={isInstitutionalTeamLinked(externalTeam)}
                                      onChange={checked => toggleLinked(checked, externalTeam)}/>
                    </td>
                </tr>)}
                </tbody>
            </table>
        </div>
    );
};
