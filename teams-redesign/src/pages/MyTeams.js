import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {deleteTeam, getMyTeams} from "../api";
import I18n from "i18n-js";
import "./MyTeams.scss"
import {Page} from "../components/Page";
import binIcon from "../icons/bin-1.svg";
import blockedIcon from "../icons/allowances-no-talking.svg";
import {ROLES} from "../utils/roles";

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
        const tag = <span className="private-label">
            <span><img src={blockedIcon} alt="Private"/>{I18n.t("myteams.private")}</span>

        </span>
        return (
            <>{viewable ? I18n.t("myteams.empty") : tag}</>
        )
    }

    const processDelete = team => {
        //TODO first show confirmation modal
        deleteTeam(team.id).then(() => {
            getMyTeams().then(teams => {
                setTeams(teams);
            })
        })
    }

    const renderAddMemberLink = team => {
        const link = <Link to={{ pathname: "/", state: { team: team } }}>{I18n.t("myteams.add_members")}</Link> 
        return (
            <>{ROLES.MEMBER !== team.role ? link: I18n.t("myteams.empty")}</>
        )
    }

    const renderDeleteButton = team => {
        const icon = <img className="binIcon" src={binIcon} alt="Delete" onClick={() => processDelete(team)} />
        return (
            <>{[ROLES.OWNER, ROLES.ADMIN].includes(team.role) ? icon : I18n.t("myteams.empty")}</>
        )
    }

    const renderTeamsRow = team => {
        return (<tr>
            <td><Link to={`/team-details/${team.id}`}>{team.name}</Link></td>
            <td>{team.membershipCount}</td>
            <td>{renderPrivateTag(team.viewable)}</td>
            <td>{renderAddMemberLink(team)}</td>
            <td>{renderDeleteButton(team)}</td>
        </tr>)
    }

    const renderTeamsTable = () => {
        const headers = ["title", "members", "private", "member", "bin"];
        return (
            <Page>
                <table>
                    <thead>
                    <tr>
                        {headers.map(header => <th className={header}>
                            {I18n.t(`myteams.columns.${header}`)}
                        </th>)}
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
            <div>TODO - header, drop-down (admin 4, members 3) - search box</div>
            {renderTeamsTable()}
        </div>
    );

}