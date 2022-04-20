import { useEffect, useState } from "react";
import { deleteTeam, getMyTeams } from "../api";
import I18n from "i18n-js";
import "./MyTeams.scss"
import { Page } from "../components/Page";
import binIcon from "../icons/bin-1.svg";
import blockedIcon from "../icons/allowances-no-talking.svg";

export const MyTeams = () => {

    const [teams, setTeams] = useState({
        teamSummaries: []
    });

    useEffect(() => {
        getMyTeams().then(teams => {
            setTeams(teams);
        })
    }, [])


    const renderPrivateTag = viewable => {
        const tag = <label className="private-label">
            {<img src={blockedIcon} alt="Private" />}
            {I18n.t("myteams.private")}
        </label>
        return (
            <>{viewable ? I18n.t("myteams.empty") : tag}</>
        )
    }

    const processDelete = team => {
        deleteTeam(team.id).then(() => {
            getMyTeams().then(teams => {
                setTeams(teams);
            })
        })
    }

    const renderDeleteButton = team => {
        return (
            <>{team.role=="ADMIN"?<img className="binIcon" src={binIcon} alt="Delete" onClick={e => processDelete(team)} />:I18n.t("myteams.empty")}</>
        )
    }

    const renderTeamsRow = team => {
        return (<tr>
            <td>{team.name}</td>
            <td>{team.membershipCount}</td>
            <td>{renderPrivateTag(team.viewable)}</td>
            <td>Todo</td>
            <td>{renderDeleteButton(team)}</td>
        </tr>)
    }

    const renderTeamsTable = () => {
        const headers = ["title", "members", "empty", "empty", "empty"]
        return (
            <Page>
                <table>
                    <thead>
                        <tr>
                            {headers.map(header => <th className="why"> {I18n.t(`myteams.${header}`)} </th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {teams.teamSummaries.map(team => renderTeamsRow(team))}
                    </tbody>
                </table>
            </Page>
        )
    }

    return (
        <div className="my-teams-container">
            {renderTeamsTable()}
        </div>
    );

}