import {Link, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";

import {deleteJoinRequest, deleteTeam, getMyTeams} from "../api";
import I18n from "i18n-js";
import {ROLES} from "../utils/roles";
import {Page} from "../components/Page";
import {DropDownMenu} from "../components/DropDownMenu";
import {ReactComponent as BinIcon} from "../icons/bin-1.svg";

import "./MyTeams.scss"
import {Button} from "../components/Button";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {Tab, Tabs} from "../components/Tabs";
import {SortableTable} from "../components/SortableTable";
import {SearchBar} from "../components/SearchBar";
import {PublicTeamsTab} from "../components/PublicTeamsTab";
import {PrivateTeamLabel} from "../components/PrivateTeamLabel";
import {SpinnerField} from "../components/SpinnerField";


export const MyTeams = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [teamsFilter, setTeamsFilter] = useState({value: "ALL", label: ""});
    const [sort, setSort] = useState({field: "name", direction: "ascending"});
    const [displayedTeams, setDisplayedTeams] = useState([]);

    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const searchInputRef = useRef(null);

    const updateAllTeams = useCallback(() => {
        getMyTeams().then(teams => {
            const teamSummaries = teams.teamSummaries;
            const joinRequests = teams.myJoinRequests.map(joinRequest => ({
                name: joinRequest.teamName,
                description: joinRequest.teamDescription,
                role: "JOINREQUEST",
                isJoinRequest: true,
                membershipCount: "",
                created: joinRequest.joinRequest.created,
                message: joinRequest.joinRequest.message,
                id: joinRequest.joinRequest.id,
                teamId: joinRequest.teamId
            }));
            const allTeams = teamSummaries.concat(joinRequests);
            setTeams(allTeams);
            const hasJoinRequests = joinRequests.length > 0;
            setTeamsFilter(hasJoinRequests ? {
                value: "ALL",
                label: `${I18n.t(`myteams.filters.all`)} (${allTeams.length})`
            } : {
                value: "ALLTEAMS",
                label: `${I18n.t(`myteams.filters.allteams`)} (${allTeams.length})`
            });
            setLoaded(true);
            setTimeout(() => searchInputRef.current.focus(), 500);
        });
    }, []);

    useEffect(() => {
        updateAllTeams();
    }, [updateAllTeams]);

    useEffect(() => {
        const updateDisplayedTeams = () => {
            const toDisplay = teams.filter(team => {
                const roleMatch =
                    teamsFilter.value === team.role ||
                    teamsFilter.value === "ALL" ||
                    (!team.isJoinRequest && teamsFilter.value === "ALLTEAMS")
                return roleMatch && (searchQuery.trim() === "" || team.name.toLowerCase().includes(searchQuery.toLowerCase()))
            });
            toDisplay.sort((a, b) => (a[sort.field] > b[sort.field]) ? 1 : -1);
            if (sort.direction !== "ascending") {
                toDisplay.reverse()
            }
            setDisplayedTeams(toDisplay);
        }
        updateDisplayedTeams();
    }, [teams, searchQuery, teamsFilter, sort])


    const processDelete = (team, showConfirmation) => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => processDelete(team, false),
                warning: false,
                question: I18n.t(`myteams.confirmations.delete${team.isJoinRequest ? "JoinRequest" : ""}`)
            });
            setConfirmationOpen(true);
        } else {
            const promise = team.isJoinRequest ? deleteJoinRequest : deleteTeam;
            promise(team.id).then(() => {
                updateAllTeams();
            });
            setConfirmationOpen(false);
        }
    }

    const renderFilterDropdown = () => {
        class FilterCount {
            constructor(value) {
                this.action = () => {
                    setTeamsFilter({value: this.value, label: this.name})
                }
                this.value = value;
                if (value === "ALL") {
                    this.count = teams.length;
                } else if (value === "ALLTEAMS") {
                    this.count = teams.filter(team => !team.isJoinRequest).length;
                } else {
                    this.count = 0;
                }
            }

            get name() {
                return `${I18n.t(`myteams.filters.${this.value.toLowerCase()}`)} (${this.count})`
            }
        }

        const defaultFilters = [ROLES.OWNER, ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER];
        const filters = [];
        const hasJoinRequests = teams.some(team => team.isJoinRequest);
        const hasTeams = teams.some(team => !team.isJoinRequest);
        if (hasJoinRequests && hasTeams) {
            filters.push("ALL");
        }
        if (hasTeams) {
            filters.push("ALLTEAMS");
        }
        if (hasJoinRequests) {
            filters.push("JOINREQUEST");
        }
        const options = filters.concat(defaultFilters).map(filter => new FilterCount(filter))

        teams.forEach(team => {
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

    const renderNewTeamButton = () => {
        const buttonClicked = () => {
            navigate("/new-team");
        }
        return <Button onClick={buttonClicked} txt={I18n.t(`myteams.new_team`)} className="new-team-button"/>
    }

    const renderTeamsRow = (team, index) => {
        const linkUrl = team.isJoinRequest ? `/join-request/${team.teamId}/${team.id}` : `/team-details/${team.id}`;
        return (<tr key={index}>
            <td data-label={I18n.t("myteams.columns.title")}>
                <Link to={linkUrl}>{team.name}</Link>
            </td>
            <td data-label={I18n.t("myteams.columns.members")} className={"membership-count"}>{team.membershipCount}</td>
            <td data-label={I18n.t("myteams.columns.private")}>{(!team.viewable && !team.isJoinRequest) &&
            <PrivateTeamLabel/>}</td>
            <td data-label={I18n.t("myteams.columns.member")}>{renderAddMemberLink(team)}</td>
            <td data-label={I18n.t("myteams.columns.bin")}>{renderDeleteButton(team)}</td>
        </tr>)
    }

    const renderAddMemberLink = team => {
        if (team.role === ROLES.MEMBER) {
            return I18n.t("myteams.member");
        }
        if (team.role === "JOINREQUEST") {
            return I18n.t("myteams.joinRequest");
        }
        return <Link to={`/team-details/${team.id}?add-members=true`}>{I18n.t("myteams.add_members")}</Link>
    }

    const renderDeleteButton = team => {
        const icon = <span className="bin-icon" onClick={() => processDelete(team, true)}><BinIcon/></span>
        return (<>{[ROLES.OWNER, ROLES.ADMIN, "JOINREQUEST"].includes(team.role) ? icon : I18n.t("myteams.empty")}</>)
    }

    const renderMyTeams = () => {
        const columns = [
            {
                name: "title",
                displayedName: I18n.t(`myteams.columns.title`),
                sortable: true,
                sortField: "name"
            },
            {
                name: "members",
                displayedName: I18n.t(`myteams.columns.members`),
                sortable: true,
                sortField: "membershipCount"
            },
            {
                name: "private",
                displayedName: I18n.t(`myteams.columns.private`),
                sortable: false
            },
            {
                name: "member",
                displayedName: I18n.t(`myteams.columns.member`),
                sortable: false
            },
            {
                name: "bin",
                displayedName: I18n.t(`myteams.columns.bin`),
                sortable: false
            }
        ]
        if (!loaded) {
            return <SpinnerField/>;
        }
        return (
            <Tabs>
                <Tab title={I18n.t(`myteams.tabs.myTeams`)}>
                    <Page>
                        <h2>{I18n.t("myteams.tabs.myTeams")}</h2>
                        <span className="team-actions-bar">
                        {renderFilterDropdown()}
                            <SearchBar searchQuery={searchQuery}
                                       setSearchQuery={setSearchQuery}
                                       searchInputRef={searchInputRef}/>
                            {renderNewTeamButton()}
                        </span>

                        {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                                 cancel={confirmation.cancel}
                                                                 confirm={confirmation.action}
                                                                 isWarning={confirmation.warning}
                                                                 question={confirmation.question}/>}

                        {teams.length === 0 &&
                        <h3 className="zero-state">{I18n.t("myteams.zeroStates.noTeams")}</h3>}
                        {(displayedTeams.length === 0 && teams.length > 0) &&
                        <h3 className="zero-state">{I18n.t("myteams.zeroStates.noResults")}</h3>
                        }
                        {displayedTeams.length > 0 &&
                        <SortableTable columns={columns} currentSort={sort} setSort={setSort}>
                            {displayedTeams.map((team, index) => renderTeamsRow(team, index))}
                        </SortableTable>
                        }
                    </Page>
                </Tab>
                <Tab title={I18n.t(`myteams.tabs.publicTeams`)}>
                    <Page>
                        <PublicTeamsTab myteams={teams}/>
                    </Page>
                </Tab>
            </Tabs>
        )
    }

    return (
        <div className="my-teams-container">
            {renderMyTeams()}
        </div>
    );

}