import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

import {deleteTeam, getMyTeams} from "../api";
import I18n from "i18n-js";
import {ROLES} from "../utils/roles";
import {Page} from "../components/Page";
import {DropDownMenu} from "../components/DropDownMenu";
import {ReactComponent as SearchIcon} from "../icons/search.svg";
import {ReactComponent as BinIcon} from "../icons/bin-1.svg";
import blockedIcon from "../icons/allowances-no-talking.svg";

import "./MyTeams.scss"
import {Button} from "../components/Button";
import {SortButton} from "../components/SortButton";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {Tab, Tabs} from "../components/Tabs";


export const MyTeams = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState({teamSummaries: []});

    const [searchQuery, setSearchQuery] = useState("");
    const [teamsFilter, setTeamsFilter] = useState({value: "ALL", label: ""});
    const [sort, setSort] = useState({field: "membershipCount", direction: "ascending"});
    const [displayedTeams, setDisplayedTeams] = useState([]);

    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    useEffect(() => {
        getMyTeams().then(teams => {
            setTeams(teams);
            setTeamsFilter({value: "ALL", label: `${I18n.t(`myteams.filters.all`)} (${teams.teamSummaries.length})`});
        })
    }, []);

    useEffect(() => {
        const updateDisplayedTeams = () => {
            const toDisplay = teams.teamSummaries.filter(team => {
                if (teamsFilter.value !== team.role && teamsFilter.value !== 'ALL') {
                    return false;
                }
                return searchQuery === "" || team.name.toLowerCase().includes(searchQuery.toLowerCase());
            })
            toDisplay.sort((a, b) => (a[sort.field] > b[sort.field]) ? 1 : -1);
            if (sort.direction !== "ascending") {
                toDisplay.reverse()
            }
            setDisplayedTeams(toDisplay)
        }
        updateDisplayedTeams();
    }, [teams, searchQuery, teamsFilter, sort])

    const processDelete = (team, showConfirmation) => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => processDelete(team, false),
                warning: false,
                question: I18n.t("myteams.confirmations.delete")
            });
            setConfirmationOpen(true);
            return;
        }
        deleteTeam(team.id).then(() => {
            getMyTeams().then(teams => {
                setTeams(teams);
            })
        })
        setConfirmationOpen(false);
    }

    const renderFilterDropdown = () => {
        class FilterCount {
            constructor(value) {
                this.action = () => {
                    setTeamsFilter({value: this.value, label: this.name})
                }
                this.value = value
                if (value === 'ALL') {
                    this.count = teams.teamSummaries.length;
                    return this;
                }
                this.count = 0
            }

            get name() {
                return `${I18n.t(`myteams.filters.${this.value.toLowerCase()}`)} (${this.count})`
            }
        }

        const filters = ['ALL', ROLES.OWNER, ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER]
        const options = filters.map(filter => new FilterCount(filter))

        teams.teamSummaries.forEach(team => {
            options.forEach(option => {
                if (option.value === team.role) {
                    option.count++;
                }
            })
        })

        return (
            <span className={"filter-dropdown-span"}>
                <DropDownMenu title={teamsFilter.label} actions={options.filter(option => option.count !== 0)}/>
            </span>
        )
    }

    const renderTeamsSearch = () => {
        return (<span className="teams-search-bar">
            <input placeholder="Search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}/>
            <SearchIcon/>
        </span>)
    }

    const renderNewTeamButton = () => {
        const buttonClicked = () => {
            navigate("/new-team");
        }
        return <Button onClick={buttonClicked} txt={I18n.t(`myteams.new_team`)} className="new-team-button"/>
    }

    const renderTeamsRow = (team, index) => {
        return (<tr key={index}>
            <td data-label={I18n.t("myteams.columns.title")}><Link to={`/team-details/${team.id}`}>{team.name}</Link>
            </td>
            <td data-label={I18n.t("myteams.columns.members")}>{team.membershipCount}</td>
            <td data-label={I18n.t("myteams.columns.private")}>{renderPrivateTag(team.viewable)}</td>
            <td data-label={I18n.t("myteams.columns.member")}>{renderAddMemberLink(team)}</td>
            <td data-label={I18n.t("myteams.columns.bin")}>{renderDeleteButton(team)}</td>
        </tr>)
    }

    const renderPrivateTag = viewable => {
        const tag = <span className="private-label">
            <span><img src={blockedIcon} alt="Private"/>{I18n.t("myteams.private")}</span>

        </span>
        return (<>{viewable ? I18n.t("myteams.empty") : tag}</>)
    }

    const renderAddMemberLink = team => {
        const link = <Link to={{pathname: "/", state: {team: team}}}>{I18n.t("myteams.add_members")}</Link>
        return (<>{ROLES.MEMBER !== team.role ? link : I18n.t("myteams.member")}</>)
    }

    const renderDeleteButton = team => {
        const icon = <span className="bin-icon" onClick={() => processDelete(team, true)}><BinIcon/></span>
        return (<>{[ROLES.OWNER, ROLES.ADMIN].includes(team.role) ? icon : I18n.t("myteams.empty")}</>)
    }

    const renderMyTeams = () => {
        const headers = ["title", "members", "private", "member", "bin"];
        const renderHeader = (header) => {
            const sortField = header === "title" ? "name" : "membershipCount";
            const handleSort = (direction) => {
                setSort({field: sortField, direction: direction})
            }
            return (<th className={header} key={header}>
                <div className={`${header}-wrapper`}>
                    {I18n.t(`myteams.columns.${header}`)}
                    {["title", "members"].includes(header) ? <SortButton onSort={handleSort}/> : null}
                </div>
            </th>)
        }

        return (<Page>
            <Tabs>
                <Tab title={I18n.t(`myteams.tabs.myteams`)}>

                    <h2>{I18n.t("myteams.tabs.myteams")}</h2>
                    <span
                        className="team-actions-bar"> {renderFilterDropdown()}{renderTeamsSearch()}{renderNewTeamButton()}
                    </span>

                    {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                             cancel={confirmation.cancel}
                                                             confirm={confirmation.action}
                                                             isWarning={confirmation.warning}
                                                             question={confirmation.question}/>}

                    <table>
                        <thead>
                        <tr>
                            {headers.map(header => renderHeader(header))}
                        </tr>
                        </thead>
                        <tbody>
                        {displayedTeams.map((team, index) => renderTeamsRow(team, index))}
                        </tbody>
                    </table>
                </Tab>
                <Tab title={I18n.t(`myteams.tabs.publicteams`)}>
                    <h2>{I18n.t("myteams.tabs.publicteams")}</h2>
                </Tab>
            </Tabs>
        </Page>)
    }

    return (<div className="my-teams-container">
        {renderMyTeams()}
    </div>);

}