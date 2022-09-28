import I18n from "i18n-js";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import "./PublicTeamsTab.scss";
import {SearchBar} from "./SearchBar";
import {SortableTable} from "./SortableTable";
import TooltipIcon from "./Tooltip";
import {autoCompleteTeam} from "../api";
import {SpinnerField} from "./SpinnerField";
import {useDebounce} from "../utils/debounce";
import {isSuperAdmin} from "../store/store";
import informational from "../icons/alert-information-circle.svg";
import removeMd from "remove-markdown";

export const PublicTeamsTab = ({user, myteams}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sort, setSort] = useState({field: "name", direction: "ascending"});
    const [teams, setTeams] = useState([]);
    const [displayedTeams, setDisplayedTeams] = useState([]);
    const [searching, setSearching] = useState(false);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const searchInputRef = useRef(null);

    const updateDisplayedTeams = useCallback(() => {
        const toDisplay = [...teams];
        toDisplay.sort((a, b) => (a[sort.field] > b[sort.field]) ? 1 : -1);
        if (sort.direction !== "ascending") {
            toDisplay.reverse()
        }
        setDisplayedTeams(toDisplay);
    }, [teams, sort])

    useEffect(
        () => {
            if (debouncedSearchQuery.trim().length > 0) {
                setSearching(true);
                autoCompleteTeam(debouncedSearchQuery).then(teams => {
                    setTeams(teams);
                    setSearching(false);
                });
            } else {
                setTeams([]);
            }
        },
        [debouncedSearchQuery] // Only call effect if debounced search term changes
    );

    useEffect(() => {
        updateDisplayedTeams()
    }, [sort, updateDisplayedTeams]);

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
            emptyHeader: true,
            sortable: false
        }
    ]

    const renderPublicTeamsRow = (team, index) => {
        const description = removeMd(team.description);
        const shouldTruncateDescription = description.length > 50;
        const isMember = myteams.some(myteam => myteam.id === team.id);

        return (
            <tr key={index}>
                <td data-label={"title"}>
                    {(!isMember && !isSuperAdmin) && <Link to={`/join-request/${team.id}`}>{team.name}</Link>}
                    {(isMember || isSuperAdmin) && <Link to={`/team-details/${team.id}`}>{team.name}</Link>}
                </td>
                <td data-label={"description"}>
                    <span className="team-description">
                        {shouldTruncateDescription ? description.substring(0, 50) + "..." : description}
                        {shouldTruncateDescription && <TooltipIcon tooltip={description}
                                                                   name={`desc${index}}`}/>}
                    </span>
                </td>
                <td data-label={"join"}>
                    {(!isMember && !isSuperAdmin) &&
                    <Link to={`/join-request/${team.id}`}>
                        {I18n.t("publicTeams.joinRequest")}
                        <span className={"visually-hidden"}> to team {team.name}</span>
                    </Link>}
                    {(!isMember && isSuperAdmin) && I18n.t("publicTeams.superAdmin")}
                    {(isMember) && I18n.t("publicTeams.alreadyMember")}
                </td>
            </tr>)
    }

    return (
        <div className="public-teams-tab">
            <h2>{I18n.t("myteams.tabs.publicTeams")}</h2>
            <span className="public-teams-actions-bar">
                <SearchBar searchQuery={searchQuery}
                           setSearchQuery={setSearchQuery}
                           searchInputRef={searchInputRef}/>
            </span>
            {searching && <SpinnerField/>}
            {(!searching && teams.length === 0 && debouncedSearchQuery.trim().length > 0) &&
            <h3 className="zero-state">{I18n.t("myteams.zeroStates.noResults")}</h3>}

            {(!searching && displayedTeams.length === 11) &&
            <div className="more-results">
                <img src={informational} alt="" aria-hidden="true"/>
                <span id="search-box">{I18n.t("publicTeams.moreResults")}</span>
            </div>}
            {(!searching && displayedTeams.length > 0) &&
            <div id="announce" aria-busy={searching} aria-live="polite">
                <SortableTable columns={columns}
                               currentSort={sort}
                               setSort={setSort}>
                    {displayedTeams.map((team, index) => renderPublicTeamsRow(team, index))}
                </SortableTable>
            </div>}
        </div>
    )
}