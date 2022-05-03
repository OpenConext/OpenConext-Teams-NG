import {Page} from "../components/Page";
import {SubHeader} from "../components/SubHeader";
import {BreadCrumb} from "../components/BreadCrumb";
import {useNavigate, useParams} from "react-router-dom";
import {useCallback, useEffect, useRef, useState} from "react";
import {deleteInvitation, deleteJoinRequest, deleteMember, deleteTeam, getTeamDetail,} from "../api";
import I18n from "i18n-js";
import {ActionMenu} from "../components/ActionMenu";
import {actionDropDownTitle, getRole, ROLES} from "../utils/roles";
import {SpinnerField} from "../components/SpinnerField";
import "./TeamDetails.scss";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {ReactComponent as CopyIcon} from "../icons/copy.svg";
import {ReactComponent as BinIcon} from "../icons/bin-1.svg";
import {ReactComponent as IDPIcon} from "../icons/single-neutral-id-card-valid.svg";
import {ReactComponent as GuestIDPIcon} from "../icons/single-neutral-id-card-3.svg";
import {ReactComponent as EmailIcon} from "../icons/email-action-send-2.svg";
import {ReactComponent as EnvelopeIcon} from "../icons/envelope.svg";
import {PrivateTeamLabel} from "../components/PrivateTeamLabel";
import {SortableTable} from "../components/SortableTable";
import {SearchBar} from "../components/SearchBar";
import {DropDownMenu} from "../components/DropDownMenu";
import {Button} from "../components/Button";
import {AddTeamMembersForm} from "../components/AddTeamMembersForm";

const TeamDetail = ({user}) => {
    const params = useParams();
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [membersFilter, setMembersFilter] = useState({
        value: "ALL",
        label: "",
    });
    const [team, setTeam] = useState({memberships: [], invitations: [], joinRequests: []});
    const [sort, setSort] = useState({
        field: "person.name",
        direction: "ascending",
    });
    const [showAddMembersForm, setShowAddMembersForm] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [memberList, setMembersList] = useState([]);
    const [displayedMembers, setDisplayedMembers] = useState([]);
    const [hideInvitees, setHideInvitees] = useState(false);
    const [userRoleInTeam, setUserRoleInTeam] = useState(ROLES.MEMBER);

    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const searchInputRef = useRef(null);

    const updateTeam = useCallback(() => {
        getTeamDetail(params.teamId)
            .then((res) => {
                if (res.memberships) {
                    const totalMembers = res.memberships.length + (res.invitations || []).length +
                        (res.joinRequests || []).length;
                    setTeam(res);
                    setMembersFilter({
                        value: "ALL",
                        label: `${I18n.t(`teamDetails.filters.all`)} (${totalMembers})`,
                    });
                    setLoaded(true);
                    setTimeout(() => searchInputRef.current.focus(), 750);
                } else {
                    navigate(`/join-request/${params.teamId}`);
                }
            })
            .catch(() => navigate("/404"));
    }, [params.teamId, navigate]);

    useEffect(() => {
        updateTeam();
    }, [params.teamId, navigate, updateTeam]);

    useEffect(() => {
        const updateMembersList = () => {
            if (hideInvitees || !team.invitations) {
                setMembersList([...team.memberships].concat([...team.joinRequests]));
                return;
            }
            const pendingMembers = team.invitations.reduce((filtered, invitation) => {
                if (!invitation.expired) {
                    filtered.push({
                        person: {name: "-", email: invitation.email},
                        created: invitation.timestamp / 1000,
                        isInvitation: true,
                        role: invitation.intendedRole,
                        invitationID: invitation.id,
                    });
                }
                return filtered;
            }, []);
            const joinRequests = team.joinRequests.reduce((filtered, joinRequest) => {
                filtered.push({
                    ...joinRequest,
                    isJoinRequest: true,
                    role: ROLES.MEMBER
                });
                return filtered;
            }, []);
            const members = [...team.memberships].concat(pendingMembers).concat(joinRequests);
            setMembersList(members);
        };
        updateMembersList();
    }, [team, hideInvitees]);

    useEffect(() => {
        const updateDisplayedMembers = () => {
            const getSortField = (targetObject) => {
                return sort.field
                    .split(".")
                    .reduce((p, c) => (p && p[c]) || null, targetObject);
            };
            const toDisplay = memberList.filter((member) => {
                if (membersFilter.value !== member.role && membersFilter.value !== "ALL" &&
                    !(membersFilter.value === "INVITEE" && member.isInvitation) &&
                    !(membersFilter.value === "JOIN_REQUEST" && member.isJoinRequest)) {
                    return false;
                }
                if (searchQuery === "") {
                    return true;
                } else if (member.person.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                    return true;
                }
                return false;
            });
            toDisplay.sort((a, b) => (getSortField(a) > getSortField(b) ? 1 : -1));
            if (sort.direction !== "ascending") {
                toDisplay.reverse();
            }
            setDisplayedMembers(toDisplay);
        };
        updateDisplayedMembers();
    }, [memberList, sort, searchQuery, membersFilter]);

    useEffect(() => {
        const userMembership = team.memberships.find(
            membership => membership.person.id === user.person.id
        );
        setUserRoleInTeam(userMembership ? userMembership.role : ROLES.MEMBER);
    }, [team, user.person.id]);

    useEffect(() => {
        const updateAlertBanners = () => {
            const pendingAlerts = [];
            const adminAlert =
                memberList.filter((member) => member.role === ROLES.ADMIN).length < 2 &&
                [ROLES.ADMIN, ROLES.OWNER].includes(userRoleInTeam);
            if (adminAlert) {
                pendingAlerts.push(
                    <span>{I18n.t(`teamDetails.alerts.singleAdmin`)}</span>
                );
            }
            setAlerts(pendingAlerts);
        };
        updateAlertBanners();
    }, [memberList, userRoleInTeam]);

    const renderAlertBanners = () => {
        return alerts.map((alert) => {
            return (
                <div className="alert-banner-wrapper">
                    <span className="alert-banner">{alert}</span>
                </div>
            );
        });
    };

    const renderFilterDropdown = () => {
        class FilterCount {
            constructor(value) {
                this.action = () => {
                    setMembersFilter({value: this.value, label: this.name});
                };
                this.value = value;
                if (value === "ALL") {
                    this.count = memberList.length;
                    return this;
                }
                this.count = 0;
            }

            get name() {
                return `${I18n.t(`teamDetails.filters.${this.value.toLowerCase()}`)} (${
                    this.count
                })`;
            }
        }

        const filters = [
            "ALL",
            ROLES.OWNER,
            ROLES.ADMIN,
            ROLES.MANAGER,
            ROLES.MEMBER,
            "INVITEE",
            "JOIN_REQUEST"
        ];
        const options = filters.map((filter) => new FilterCount(filter));

        memberList.forEach((membership) => {
            options.forEach((option) => {
                if (option.value === membership.role && !membership.isInvitation && !membership.isJoinRequest) {
                    option.count++;
                }
                if (option.value === "INVITEE" && membership.isInvitation) {
                    option.count++;
                }
                if (option.value === "JOIN_REQUEST" && membership.isJoinRequest) {
                    option.count++;
                }
            });
        });

        return (
            <span className={"filter-dropdown-span"}>
        <DropDownMenu
            title={membersFilter.label}
            actions={options.filter((option) => option.count !== 0)}
        />
      </span>
        );
    };

    const processRemoveMember = (member, showConfirmation) => {
        const confPart = member.isInvitation ? "Invitation" : member.isJoinRequest ? "JoinRequest" : "Member";
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => processRemoveMember(member, false),
                warning: false,
                question: I18n.t(`teamDetails.confirmations.remove${confPart}`),
            });
            setConfirmationOpen(true);
            return;
        }
        if (member.isInvitation) {
            deleteInvitation(member.invitationID).then(updateTeam);
        } else if (member.isJoinRequest) {
            deleteJoinRequest(member.id).then(updateTeam);
        } else {
            deleteMember(member.id).then(updateTeam);
        }
        setConfirmationOpen(false);
    };

    const renderDeleteButton = (member) => {
        const icon = (
            <span
                className="bin-icon"
                onClick={() => processRemoveMember(member, true)}
            >
        <BinIcon/>
      </span>
        );
        return (
            <>
                {[ROLES.OWNER, ROLES.ADMIN].includes(userRoleInTeam)
                    ? icon
                    : I18n.t("myteams.empty")}
            </>
        );
    };
    const getDateString = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return `${date.getMonth()} ${date.toLocaleString("default", {
            month: "long",
        })}, ${date.getFullYear()}`;
    };

    const renderMembersTable = () => {
        const columns = [
            {
                name: "name",
                displayedName: I18n.t(`teamDetails.columns.name`),
                sortable: true,
                sortField: "person.name",
            },
            {
                name: "idp",
                displayedName: I18n.t(`teamDetails.columns.idp`),
                sortable: true,
                sortField: "person.guest",
            },
            {
                name: "email",
                displayedName: I18n.t(`teamDetails.columns.email`),
                sortable: true,
                sortField: "person.email",
            },
            {
                name: "role",
                displayedName: I18n.t(`teamDetails.columns.role`),
                sortable: false,
            },
            {
                name: "joined",
                displayedName: I18n.t(`teamDetails.columns.joined`),
                sortable: true,
                sortField: "created",
            },
            {
                name: "bin",
                displayedName: I18n.t(`teamDetails.columns.bin`),
                sortable: false,
            },
        ];
        if (![ROLES.ADMIN, ROLES.OWNER].includes(userRoleInTeam)) {
            columns.splice(1, 1);
        }
        return (
            <SortableTable columns={columns} currentSort={sort} setSort={setSort}>
                {displayedMembers.map((member, index) =>
                    renderMembersRow(member, index)
                )}
            </SortableTable>
        );
    };

    const processChangeMemberRole = (member, role) => {
        //TODO!
    };

    const renderMembersRow = (member, index) => {
        const roleActions = [ROLES.OWNER, ROLES.ADMIN, ROLES.MANAGER, ROLES.MEMBER].map(
            role => ({
                name: I18n.t(`roles.${role.toLowerCase()}`),
                action: () => processChangeMemberRole(member, role)
            }))
        return (
            <tr key={index}>
                <td data-label={I18n.t(`teamDetails.columns.name`)}>
                    {member.person.name}
                </td>
                {[ROLES.ADMIN, ROLES.OWNER].includes(userRoleInTeam) && (
                    <td data-label={I18n.t(`teamDetails.columns.idp`)}>
                        <span className="idp">
                            {!member.person.guest && <IDPIcon/>}
                            {member.person.guest && <GuestIDPIcon/>}
                        </span>
                    </td>
                )}
                <td data-label={I18n.t(`teamDetails.columns.email`)}>
                    {member.person.email}
                </td>
                <td data-label={I18n.t(`teamDetails.columns.role`)}
                    className="roles-entry">
                    {((userRoleInTeam === ROLES.ADMIN || userRoleInTeam === ROLES.OWNER)&& !member.isInvitation && !member.isJoinRequest) ?
                        <DropDownMenu title={I18n.t(`roles.${member.role.toLowerCase()}`)} actions={roleActions}/> :
                        I18n.t(`roles.${member.role.toLowerCase()}`)}
                </td>
                <td data-label={I18n.t(`teamDetails.columns.joined`)}
                    className="joined-entry">
                    <span className="joined-wrapper">
                        <span>{getDateString(member.created)}</span>
                        {(member.isInvitation && [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER].includes(userRoleInTeam))
                        && <span className="details">
                            {I18n.t(`teamDetails.inviteSent`)}
                            <EmailIcon/>
                            </span>}
                        {(member.isJoinRequest && [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER].includes(userRoleInTeam))
                        && <span className="details">
                            {I18n.t(`teamDetails.joinRequest`)}
                            <EnvelopeIcon/>
                            </span>}
                    </span>
                </td>
                <td data-label={I18n.t(`teamDetails.columns.bin`)}>
                    {renderDeleteButton(member)}
                </td>
            </tr>
        );
    };

    const leaveTeam = (showConfirmation) => () => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: leaveTeam(false),
                warning: false,
                question: I18n.t("details.confirmations.leave"),
            });
            setConfirmationOpen(true);
        } else {
            deleteMember(
                team.memberships.find(
                    (membership) => membership.person.id === user.person.id
                ).id
            ).then(() => {
                navigate("/my-teams");
            });
        }
    };

    const editTeam = () => {
        navigate(`/edit-team/${team.id}`);
    }

    const processDeleteTeam = (showConfirmation) => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => processDeleteTeam(false),
                warning: false,
                question: I18n.t("myteams.confirmations.delete"),
            });
            setConfirmationOpen(true);
            return;
        }
        deleteTeam(team.id).then(() => {
            navigate("/my-teams");
        });
    };

    const getActions = () => {
        const actions = [
            {
                name: I18n.t("details.leave"),
                action: leaveTeam(true),
            },
        ];
        const role = getRole(team, user);
        if (role === ROLES.ADMIN || role === ROLES.OWNER) {
            actions.push({
                name: I18n.t("details.edit"),
                action: () => editTeam(),
            });
            actions.push({
                name: I18n.t("details.delete"),
                action: () => processDeleteTeam(true),
            });
        }
        return actions;
    };

    if (!loaded) {
        return <SpinnerField/>;
    }

    return (
        <Page>
            <SubHeader>
                <BreadCrumb
                    paths={[
                        {name: I18n.t("breadcrumbs.myTeams"), to: "/my-teams"},
                        {name: team.name},
                    ]}
                />
            </SubHeader>
            <SubHeader>
                <div className="team-actions">
                    <div>
                        <h1 onClick={() => setShowAddMembersForm(false)}>{team.name}</h1>
                        <span className="team-access-bar">
              {!team.viewable && <PrivateTeamLabel/>}
                            <span className="urn-container">
                <label>{team.urn}</label>
                <span
                    onClick={() => {
                        navigator.clipboard.writeText(team.urn);
                    }}
                >
                  <CopyIcon/>
                </span>
              </span>
            </span>
                        <p>{team.description}</p>
                    </div>
                    <ActionMenu
                        title={actionDropDownTitle(team, user)}
                        actions={getActions()}
                    />
                </div>
            </SubHeader>
            {confirmationOpen && (
                <ConfirmationDialog
                    isOpen={confirmationOpen}
                    cancel={confirmation.cancel}
                    confirm={confirmation.action}
                    isWarning={confirmation.warning}
                    question={confirmation.question}
                />
            )}
            {renderAlertBanners()}
            {!showAddMembersForm && (
                <div className="team-members">
                    <h2>Members ({memberList.length})</h2>
                    <span className="team-actions-bar">
                        {renderFilterDropdown()}
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            searchInputRef={searchInputRef}
                        />
                        {[ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER].includes(userRoleInTeam) && (
                            <span className="hide-invitees-wrapper">
                             <input className="hide-invitees-checkbox"
                                    type="checkbox"
                                    disabled={team.invitations && team.invitations.length > 0 ? "" : "disabled"}
                                    checked={hideInvitees}
                                    onChange={() => setHideInvitees(!hideInvitees)}/>
                                {team.invitations && team.invitations.length > 0
                                    ? I18n.t("teamDetails.hideInvitees")
                                    : I18n.t("teamDetails.noInvitees")}
                            </span>
                        )}
                        {[ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER].includes(userRoleInTeam) && (
                            <span className="action-button-wrapper">
                                <Button onClick={() => navigate("/home")}
                                        txt={I18n.t(`teamDetails.includeTeam`)}
                                        className="include-team-button"/>
                                <Button onClick={() => setShowAddMembersForm(true)}
                                        txt={I18n.t(`teamDetails.addMembers.buttons.add`)}
                                        className="add-member-button"/>
                            </span>
                        )}
                    </span>
                    {renderMembersTable()}
                </div>
            )}
            {showAddMembersForm && (
                <AddTeamMembersForm team={team} setShowForm={setShowAddMembersForm}/>
            )}
        </Page>
    );
};
export default TeamDetail;
