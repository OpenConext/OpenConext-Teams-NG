import {Page} from "../components/Page";
import {SubHeader} from "../components/SubHeader";
import {BreadCrumb} from "../components/BreadCrumb";
import {useNavigate, useParams} from "react-router-dom";
import Tippy from '@tippyjs/react';

import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    acceptInvitation,
    changeRole,
    deleteInvitation,
    deleteJoinRequest,
    deleteMember,
    deleteTeam,
    getInvitationInfo,
    getTeamDetail,
    getTeamDetailByHash,
} from "../api";
import I18n from "i18n-js";
import {ActionMenu} from "../components/ActionMenu";
import {actionDropDownTitle, allowedToLeave, getRole, isOnlyAdmin, ROLES} from "../utils/roles";
import {getDateString} from "../utils/utils";
import {SpinnerField} from "../components/SpinnerField";
import "./TeamDetails.scss";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {ReactComponent as CopyIcon} from "../icons/copy.svg";
import {ReactComponent as BinIcon} from "../icons/bin-1.svg";
import {ReactComponent as IDPIcon} from "../icons/single-neutral-id-card-valid.svg";
import {ReactComponent as GuestIDPIcon} from "../icons/single-neutral-id-card-3.svg";
import {ReactComponent as EmailIcon} from "../icons/email-action-send-2.svg";
import {ReactComponent as EnvelopeIcon} from "../icons/person-circle-plus-solid.svg";
import {PrivateTeamLabel} from "../components/PrivateTeamLabel";
import {SortableTable} from "../components/SortableTable";
import {SearchBar} from "../components/SearchBar";
import {DropDownMenu} from "../components/DropDownMenu";
import {Button} from "../components/Button";
import {AddTeamMembersForm} from "../components/AddTeamMembersForm";
import {InvitationForm} from "../components/InvitationForm";
import {JoinRequestForm} from "../components/JoinRequestForm";
import {CheckBox} from "../components/CheckBox";
import {ExternalTeamsForm} from "../components/ExternalTeamsForm";
import {setFlash} from "../flash/events";
import rehypeSanitize from "rehype-sanitize";
import MDEditor from "@uiw/react-md-editor";
import TeamWelcomeDialog from "../components/TeamWelcomeDialog";

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
    const [selectedJoinRequest, setSelectedJoinRequest] = useState(null);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [showExternalTeams, setShowExternalTeams] = useState(false);
    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [welcomeOpen, setWelcomeOpen] = useState(false);
    const [invitation, setInvitation] = useState({});

    const searchInputRef = useRef(null);

    const updateTeam = useCallback(() => {
        setLoaded(false);
        const promise = params.teamId ? getTeamDetail(params.teamId, false) : getTeamDetailByHash(params.hash, false)
        promise.then((res) => {
            if (res.memberships) {
                const totalMembers = res.memberships.length + (res.invitations || []).length +
                    (res.joinRequests || []).length;
                setMembersFilter({
                    value: "ALL",
                    label: `${I18n.t(`teamDetails.filters.all`)} (${totalMembers})`,
                });
                const userMembershipRole = (res.memberships.find(m => m.person.id === user.person.id) || {role: ROLES.MEMBER}).role;

                const adminAlert =
                    res.memberships.filter(member => member.role === ROLES.ADMIN || member.role === ROLES.OWNER).length < 2 &&
                    [ROLES.ADMIN].includes(userMembershipRole);
                setAlerts(adminAlert ? [I18n.t(`teamDetails.alerts.singleAdmin`)] : []);

                const pendingInvitation = (res.invitations || [])
                    .filter(invitation => !invitation.expired && !invitation.accepted && !invitation.denied)
                    .map(invitation => ({
                        person: {name: "-", email: invitation.email},
                        created: invitation.timestamp / 1000,
                        isInvitation: true,
                        filters: ["INVITEE"],
                        role: invitation.intendedRole,
                        invitationID: invitation.id,
                        id: invitation.id,
                    }));

                const joinRequests = (res.joinRequests || [])
                    .map(joinRequest => ({
                        ...joinRequest,
                        isJoinRequest: true,
                        filters: ["JOIN_REQUEST"],
                        role: ROLES.MEMBER
                    }))
                const newMemberList = [...res.memberships];
                newMemberList.forEach(member => member.filters = [member.role]);
                const members = newMemberList.concat(pendingInvitation).concat(joinRequests);
                setTeam(res);
                setMembersList(members);
                setUserRoleInTeam(userMembershipRole);
                setLoaded(true);
                setTimeout(() => searchInputRef.current && searchInputRef.current.focus(), 750);
            } else {
                navigate(`/join-request/${params.teamId}`);
            }
        })
            .catch(e => {
                navigate("/404");
            });
    }, [params, user, navigate]);

    useEffect(() => {
        const searchParam = new URLSearchParams(window.location.search);
        if (searchParam.has("add-members")) {
            setShowAddMembersForm(true);
        }
        if (params.hash) {
            getInvitationInfo(params.hash).then(invitation => {
                setInvitation(invitation);
                setWelcomeOpen(true);
                updateTeam();
            })
        } else {
            updateTeam();
        }

    }, [updateTeam, params]);

    useEffect(() => {
        const updateDisplayedMembers = () => {
            const getSortField = (targetObject) => {
                return sort.field
                    .split(".")
                    .reduce((p, c) => (p && p[c]) || null, targetObject);
            };
            const toDisplay = memberList.filter((member) => {
                const filterMatches = member.filters.includes(membersFilter.value) || membersFilter.value === "ALL";
                const searchQueryMatches = searchQuery.trim() === "" || member.person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    member.person.email.toLowerCase().includes(searchQuery.toLowerCase());
                return filterMatches && searchQueryMatches;
            });
            toDisplay.sort((a, b) => (getSortField(a) > getSortField(b) ? 1 : -1));
            if (sort.direction !== "ascending") {
                toDisplay.reverse();
            }
            setDisplayedMembers(toDisplay.filter(m => hideInvitees ? !m.isInvitation : true));
        };
        updateDisplayedMembers();
    }, [memberList, sort, searchQuery, membersFilter, hideInvitees]);

    const renderAlertBanners = () => {
        return alerts.map((alert, index) => {
            return (
                <div key={index} className="alert-banner-wrapper">
                    <span className="alert-banner">{alert}</span>
                </div>
            );
        });
    };

    const renderFilterDropdown = () => {
        class FilterCount {
            constructor(value) {
                this.action = () => setMembersFilter({value: this.value, label: this.name});
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
            <span className="filter-dropdown-span">
                <DropDownMenu title={membersFilter.label}
                              actions={options.filter((option) => option.count !== 0)}/>
            </span>);
    };

    const doAcceptInvitation = () => {
        acceptInvitation(params.hash)
            .then(() => {
                setWelcomeOpen(false);
                navigate(`/team-details/${team.id}`);
            });
    }

    const doDenyInvitation = () => {
        navigate("/my-teams");
    }

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
            <>{[ROLES.OWNER, ROLES.ADMIN].includes(userRoleInTeam) ? icon : I18n.t("myteams.empty")} </>
        );
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
                sortable: true,
                sortField: "role",
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

    const processChangeMemberRole = (member, role, showConfirmation) => {
        if (showConfirmation && member.urnPerson === user.urn && ![ROLES.OWNER, ROLES.ADMIN].includes(role)) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => processChangeMemberRole(member, role, false),
                warning: false,
                question: I18n.t("teamDetails.confirmations.downgrade"),
            });
            setConfirmationOpen(true);
        } else {
            setConfirmationOpen(false);
            changeRole({id: member.id, role: role}).then(() => {
                updateTeam();
                setFlash(I18n.t("teamDetails.flash.memberChanged", {
                    name: member.person.name,
                    newRole: I18n.t(`roles.${role.toLowerCase()}`)
                }));
            });
        }
    };

    const tdClassName = member => {
        return (member.isJoinRequest || member.isInvitation) ? "clickable" : "";
    }

    const tdClick = member => {
        if (member.isJoinRequest) {
            setSelectedJoinRequest(member);
        } else if (member.isInvitation) {
            setSelectedInvitation(member);
        }
    }

    const roleOptions = member => {
        const isUser = member.urnPerson === user.urn;
        const onlyAdmin = isOnlyAdmin(team, user);

        if (isUser && onlyAdmin) {
            return [ROLES.ADMIN, ROLES.OWNER];
        }
        if (userRoleInTeam === ROLES.ADMIN || userRoleInTeam === ROLES.OWNER) {
            return [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER, ROLES.MEMBER];
        }
        return [ROLES[member.role]];
    };

    const renderMembersRow = (member, index) => {
        const roleActions = roleOptions(member).map(
            role => ({
                name: I18n.t(`roles.${role.toLowerCase()}`),
                action: () => processChangeMemberRole(member, role, true)
            }));
        return (
            <tr key={index} className={tdClassName(member)}>
                <td data-label={I18n.t(`teamDetails.columns.name`)}
                    className={`${tdClassName(member)} ${member.urnPerson === user.urn ? "me" : ""}`}
                    onClick={() => tdClick(member)}>
                    {member.isInvitation ? <span>{member.person.name}</span> : <Tippy content={member.person.urn}>
                        <span>{member.person.name}</span>
                    </Tippy>}
                </td>
                {[ROLES.ADMIN, ROLES.OWNER].includes(userRoleInTeam) && (
                    <td data-label={I18n.t(`teamDetails.columns.idp`)}
                        className={tdClassName(member)}
                        onClick={() => tdClick(member)}>
                        <span className="idp">
                            {!member.isInvitation && <Tippy content={<span dangerouslySetInnerHTML={{
                                __html: I18n.t(`teamDetails.idp.${member.person.guest ? "guest" : "idp"}`)
                            }}/>}>
                                {member.person.guest ? <GuestIDPIcon/> : <IDPIcon/>}
                            </Tippy>}
                        </span>
                    </td>
                )}
                <td data-label={I18n.t(`teamDetails.columns.email`)}
                    className={tdClassName(member)}
                    onClick={() => tdClick(member)}>
                    {member.person.email}
                </td>
                <td data-label={I18n.t(`teamDetails.columns.role`)}
                    className={`roles-entry ${tdClassName(member)}`}
                    onClick={() => tdClick(member)}>
                    {((userRoleInTeam === ROLES.ADMIN || userRoleInTeam === ROLES.OWNER) && !member.isInvitation && !member.isJoinRequest) ?
                        <DropDownMenu title={I18n.t(`roles.${member.role.toLowerCase()}`)} actions={roleActions}/> :
                        I18n.t(`roles.${member.role.toLowerCase()}`)}
                </td>
                <td data-label={I18n.t(`teamDetails.columns.joined`)}
                    className={`joined-entry ${tdClassName(member)}`}
                    onClick={() => tdClick(member)}>
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
        const actions = []
        if (allowedToLeave(team, user)) {
            actions.push({
                name: I18n.t("details.leave"),
                action: leaveTeam(true),
            })
        }
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

    const paths = selectedJoinRequest ? [
        {name: I18n.t("breadcrumbs.myTeams"), to: "/my-teams"},
        {name: team.name, to: `/team-details/${team.id}`, action: () => setSelectedJoinRequest(null)},
        {name: I18n.t("breadcrumbs.joinRequest", {name: selectedJoinRequest.person.name})}
    ] : selectedInvitation ? [
        {name: I18n.t("breadcrumbs.myTeams"), to: "/my-teams"},
        {name: team.name, to: `/team-details/${team.id}`, action: () => setSelectedInvitation(null)},
        {name: I18n.t("breadcrumbs.invitation", {email: selectedInvitation.person.email})}
    ] : [
        {name: I18n.t("breadcrumbs.myTeams"), to: "/my-teams"},
        {name: team.name},
    ];

    return (
        <Page>
            <SubHeader>
                <BreadCrumb
                    paths={paths}
                />
            </SubHeader>
            <SubHeader>
                <div className="team-actions">
                    <div>
                        <h1 onClick={() => setShowAddMembersForm(false)}>{team.name}</h1>
                        <div className="team-access-bar">
                            {!team.viewable && <PrivateTeamLabel/>}
                            <div className="urn-container">
                                <label>{`${user.groupNameContext}${team.urn}`}</label>
                                <span onClick={() => navigator.clipboard.writeText(`${user.groupNameContext}${team.urn}`)}>
                                    <CopyIcon/>
                                </span>
                        </div>
                        </div>
                        <MDEditor.Markdown source={team.description} rehypePlugins={[[rehypeSanitize]]}/>
                    </div>
                    <ActionMenu title={actionDropDownTitle(team, user)}
                                actions={getActions()}/>
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
            {welcomeOpen && (
                <TeamWelcomeDialog
                    isOpen={welcomeOpen}
                    team={team}
                    invitation={invitation}
                    accept={doAcceptInvitation}
                    denied={doDenyInvitation}
                />
            )}
            {renderAlertBanners()}
            {(!showAddMembersForm && !selectedJoinRequest && !selectedInvitation && !showExternalTeams) && (
                <div className="team-members">
                    <h2>{I18n.t("teamDetails.members")} ({memberList.length})</h2>
                    <span className="team-actions-bar">
                        {renderFilterDropdown()}
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            searchInputRef={searchInputRef}
                        />
                        {[ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER].includes(userRoleInTeam) && (
                            <span className="hide-invitees-wrapper">
                                <CheckBox name="hide-invitees-checkbox"
                                          info={team.invitations && team.invitations.length > 0
                                              ? I18n.t("teamDetails.hideInvitees")
                                              : I18n.t("teamDetails.noInvitees")}
                                          onChange={() => setHideInvitees(!hideInvitees)}
                                          value={hideInvitees}
                                          readOnly={!team.invitations || team.invitations.length === 0}/>
                            </span>
                        )}
                        {[ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER].includes(userRoleInTeam) && (
                            <span className="action-button-wrapper">
                                {(user.externalTeams && user.externalTeams.length > 0) &&
                                <Button onClick={() => setShowExternalTeams(true)}
                                        txt={I18n.t(`teamDetails.includeTeam`)}
                                        className="cancel"/>}
                                {<Button onClick={() => setShowAddMembersForm(true)}
                                         txt={I18n.t(`teamDetails.addMembers.buttons.add`)}
                                         className="add-member-button"/>}
                            </span>
                        )}
                    </span>
                    {renderMembersTable()}
                </div>
            )}
            {showAddMembersForm && (
                <AddTeamMembersForm updateTeam={updateTeam} team={team} user={user}
                                    setShowForm={setShowAddMembersForm}/>
            )}
            {selectedInvitation && <InvitationForm updateTeam={updateTeam}
                                                   setShowForm={setSelectedInvitation}
                                                   invitation={selectedInvitation}/>}
            {selectedJoinRequest && <JoinRequestForm updateTeam={updateTeam}
                                                     setShowForm={setSelectedJoinRequest}
                                                     joinRequest={selectedJoinRequest}/>}
            {showExternalTeams && <ExternalTeamsForm updateTeam={updateTeam}
                                                     user={user}
                                                     team={team}
                                                     setShowForm={setShowExternalTeams}/>}
        </Page>
    );
};
export default TeamDetail;
