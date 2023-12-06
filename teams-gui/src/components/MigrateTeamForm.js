import I18n from "i18n-js";
import {React, useEffect, useState} from "react";
import "./MigrateTeamForm.scss";
import {ReactComponent as BackIcon} from "../icons/arrow-left-1.svg";
import {teamInviteAppDetails} from "../api";
import {SpinnerField} from "./SpinnerField";
import {Button} from "./Button";

export const MigrateTeamForm = ({migrateTeam, user, team, setShowForm}) => {

    const [loaded, setLoaded] = useState(false);
    const [teamDetails, setTeamDetails] = useState(false);

    useEffect(() => {
        teamInviteAppDetails(team.id).then(res => {
            setTeamDetails(res);
            setLoaded(true);
        })
    }, [team])

    if (!loaded) {
        return <SpinnerField/>;
    }

    return (
        <div className="migrate-teams-form-container">
            <button className="back" onClick={() => {
                setShowForm(false);
                document.title = I18n.t("headerTitles.index", {page: I18n.t("headerTitles.team-details")});
                window.scrollTo(0, 0);
            }}>
                <BackIcon/><span>{I18n.t("forms.back")}</span>
            </button>
            <h2>{I18n.t("migrateTeam.header")}</h2>
            <p>{I18n.t("migrateTeam.info")}</p>

            <table>
                <thead>
                <tr>
                    <th className={"attr"}>{I18n.t("migrateTeam.table.attribute")}</th>
                    <th className={"value"}>{I18n.t("migrateTeam.table.value")}</th>
                </tr>
                </thead>
                <tbody>
                {teamDetails.applications.map(application => <>
                    <tr>
                        <td className={"instance"} colSpan={2}>{I18n.t("migrateTeam.table.application")}</td>
                    </tr>
                    <tr>
                        <td>{I18n.t("migrateTeam.table.manageId")}</td>
                        <td>{application.manageId}</td>
                    </tr>
                    <tr>
                        <td>{I18n.t("migrateTeam.table.manageType")}</td>
                        <td>{application.manageType}</td>
                    </tr>
                    <tr>
                        <td>{I18n.t("migrateTeam.table.landingPage")}</td>
                        <td>{application.landingPage}</td>
                    </tr>
                </>)}
                {teamDetails.memberships.map(membership => <>
                    <tr>
                        <td className={"instance"} colSpan={2}>{I18n.t("migrateTeam.table.membership", {name: membership.person.name})}</td>
                    </tr>
                    <tr>
                        <td>{I18n.t("migrateTeam.table.role")}</td>
                        <td>{membership.role}</td>
                    </tr>
                    <tr>
                        <td>{I18n.t("migrateTeam.table.urn")}</td>
                        <td>{membership.person.urn}</td>
                    </tr>
                    <tr>
                        <td>{I18n.t("migrateTeam.table.schacHome")}</td>
                        <td>{membership.person.schacHomeOrganization}</td>
                    </tr>
                    <tr>
                        <td>{I18n.t("migrateTeam.table.email")}</td>
                        <td>{membership.person.email}</td>
                    </tr>
                </>) }
                </tbody>
            </table>
            <div className={"actions"}>
                <Button onClick={migrateTeam} txt={I18n.t("migrateTeam.migrate")}/>
            </div>


        </div>
    );
};
