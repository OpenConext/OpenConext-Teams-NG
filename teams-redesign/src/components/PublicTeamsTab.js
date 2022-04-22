import I18n from "i18n-js";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {autoCompleteTeam} from "../api";
import "./PublicTeamsTab.scss";
import {SearchBar} from "./SearchBar";
import {SortableTable} from "./SortableTable";
import TooltipIcon from "./Tooltip";

export const PublicTeamsTab = ({myteams}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sort, setSort] = useState({field: "name", direction: "ascending"});
    const [teams, setTeams] = useState([]);
    const [displayedTeams, setDisplayedTeams] = useState([]);

    useEffect(() => {
        autoCompleteTeam(searchQuery).then(teams => {
            setTeams(teams);
            updateDisplayedTeams();
        })
    }, [searchQuery]);

    useEffect(() => {
        updateDisplayedTeams()
    }, [sort, searchQuery]);

    const updateDisplayedTeams = () => {
        const toDisplay = [...teams];
        toDisplay.sort((a, b) => (a[sort.field] > b[sort.field]) ? 1 : -1);
        if (sort.direction !== "ascending") {
            toDisplay.reverse()
        }
        setDisplayedTeams(toDisplay)
    }

    const columns = [
        {
            name: "title",
            displayedName: I18n.t(`publicTeams.columns.title`),
            sortable: true,
            sortField: "name"
        },
        {
            name: "description",
            displayedName: I18n.t(`publicTeams.columns.description`),
            sortable: false,
        },
        {
            name: "join",
            displayedName: I18n.t(`publicTeams.columns.join`),
            sortable: false
        }
    ]

    const renderPublicTeamsRow = (team, index) => {
        const shouldTruncateDescription = team.description.length > 50
        const teamJoinable = myteams.filter(myteam => myteam.id === team.id).length < 1
        const joinLink = <Link to="/">{I18n.t("publicTeams.joinRequest")}</Link>

        return (
            <tr key={index}>
                <td data-label={"title"}>
                    <Link to={`/team-details/${team.id}`}>{team.name}</Link>
                </td>
                <td data-label={"description"}>
                    <span className="team-description">
                        {shouldTruncateDescription ? team.description.substring(0, 50) + "..." : team.description}
                        {shouldTruncateDescription && <TooltipIcon tooltip={team.description} name={"desc"}/>}
                    </span>
                </td>
                <td data-label={"join"}>
                    {teamJoinable ? joinLink : I18n.t("publicTeams.alreadyMember")}
                </td>
            </tr>)
    }

    const actionBarClassName = searchQuery !== "" ? "public-teams-actions-bar" : "public-teams-actions-bar-no-content";

    return (
        <div className="public-teams-tab">
            <h2>{I18n.t("myteams.tabs.publicTeams")}</h2>
            <span className={actionBarClassName}>
                        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                    </span>
            <SortableTable columns={columns} setSort={setSort}>
                {displayedTeams.map((team, index) => renderPublicTeamsRow(team, index))}
            </SortableTable>
        </div>
    )
}