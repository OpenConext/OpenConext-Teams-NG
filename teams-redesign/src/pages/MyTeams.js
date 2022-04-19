import {useEffect, useState} from "react";
import {getMyTeams} from "../api";
import I18n from "i18n-js";

export const MyTeams = () => {

    const [teams, setTeams] = useState({
        teamSummaries: []
    });

    useEffect(() => {
        getMyTeams().then(teams => {
            //use example
            setTeams(teams);
            debugger;
        })
    }, [])


    const renderTeamsRow = team => {
        return (<tr>
            <td>{team.name}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>)
    }

    const renderTeamsTable = () => {
        const headers = ["title" ,"members", "empty", "empty", "empty"]
        return (
            <table>
                <thead>
                <tr>
                    {headers.map(header => <th>{I18n.t(`myteams.${header}`)}</th>)}
                </tr>
                </thead>
                <tbody>
                {teams.teamSummaries.map(team => renderTeamsRow(team))}
                </tbody>
            </table>
        )
    }

    return (
        <div className="my-teams-container">
            {renderTeamsTable()}
        </div>
    );

}