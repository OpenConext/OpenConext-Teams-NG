import {Page} from "../components/Page";
import {SubHeader} from "../components/SubHeader";
import {BreadCrumb} from "../components/BreadCrumb";
import {useNavigate, useParams} from "react-router-dom";
import Tippy from '@tippyjs/react';

import React, {useCallback, useEffect, useRef, useState} from "react";
import {
    acceptInvitation,
    acceptPublicLink,
    changeExpiryDate,
    changeRole,
    deleteInvitation,
    deleteMember,
    deleteTeam,
    delinkExternalTeam,
    getInvitationInfo,
    getPublicLink,
    getTeamDetail,
    getTeamDetailByHash,
    getTeamDetailByPublicLink,
    rejectJoinRequest,
    resetPublicLink,
    teamInviteAppMigrate,
} from "../api";
import I18n from "i18n-js";
import {ActionMenu} from "../components/ActionMenu";
import {actionDropDownTitle, allowedToLeave, getRole, isOnlyAdmin, ROLES} from "../utils/roles";
import {addDays, getDateString, stopEvent} from "../utils/utils";
import {SpinnerField} from "../components/SpinnerField";
import "./TeamDetails.scss";
import ConfirmationDialog from "../components/ConfirmationDialog";
import {ReactComponent as CopyIcon} from "../icons/copy.svg";
import {ReactComponent as ReloadIcon} from "../icons/random.svg";
import {ReactComponent as BinIcon} from "../icons/bin-1.svg";
import {ReactComponent as IDPIcon} from "../icons/idp-institutionn.svg";
import {ReactComponent as GuestIDPIcon} from "../icons/idp-guest.svg";
import {ReactComponent as UnknownIDPIcon} from "../icons/idp-unknown.svg";
import {ReactComponent as EmailIcon} from "../icons/email-action-send-2.svg";
import {ReactComponent as JoinRequestIcon} from "../icons/person-circle-plus-solid.svg";
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
import TeamWelcomeDialog from "../components/TeamWelcomeDialog";
import {MarkDown} from "../components/MarkDown";
import {DateField} from "../components/DateField";
import {MigrateTeamForm} from "../components/MigrateTeamForm";

let currentExpiryDate;

const TeamDetail = ({user, showMembers = false}) => {
    const params = useParams();
    const navigate = useNavigate();
    const [loaded, setLoaded] = useState(false);
    const [membersFilter, setMembersFilter] = useState({
        value: "ALL",
        label: "",
    });
    const [team, setTeam] = useState({memberships: [], invitations: [], joinRequests: []});
    const [sort, setSort] = useState({
        field: "initial",
        direction: "descending",
    });
    const [isNewTeam, setIsNewTeam] = useState(showMembers);
    const [showAddMembersForm, setShowAddMembersForm] = useState(showMembers);
    const [showMigrateForm, setShowShowMigrateForm] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [memberList, setMembersList] = useState([]);
    const [displayedMembers, setDisplayedMembers] = useState([]);
    const [hideInvitees, setHideInvitees] = useState(false);
    const [showAddAdminsButton, setShowAddAdminsButton] = useState(true);
    const [userRoleInTeam, setUserRoleInTeam] = useState(ROLES.MEMBER);
    const [selectedJoinRequest, setSelectedJoinRequest] = useState(null);
    const [selectedInvitation, setSelectedInvitation] = useState(null);
    const [showExternalTeams, setShowExternalTeams] = useState(false);
    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [welcomeOpen, setWelcomeOpen] = useState(false);
    const [invitation, setInvitation] = useState({});
    const [initial, setInitial] = useState(true);
    const [copied, setCopied] = useState(false);
    const [universalLinkCopied, setUniversalLinkCopied] = useState(false);
    const [defaultRole, setDefaultRole] = useState(ROLES.MEMBER);
    const [expiryDate, setExpiryDate] = useState(null);
    const [showMemberExpiryDate, setShowMemberExpiryDate] = useState(false);

    const searchInputRef = useRef(null);

    const hideAddMembersForm = () => {
        setShowAddMembersForm(false);
        setShowAddAdminsButton(true);
        setIsNewTeam(false);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        if (window.location.search.indexOf("show-form") === -1) {
            setSelectedInvitation(null);
            setSelectedJoinRequest(null);
            setShowExternalTeams(false);
            setShowAddMembersForm(initial ? isNewTeam : false);
        }
        const urlSearchParams = new URLSearchParams(window.location.search);
        if (urlSearchParams.get("initial")) {
            setShowAddAdminsButton(false);
        }
        // eslint-disable-next-line
    }, [window.location.search])

    useEffect(() => {
        currentExpiryDate = expiryDate;
    }, [expiryDate])

    const updateTeam = useCallback(() => {
        setLoaded(false);
        const promise = params.teamId ? getTeamDetail(params.teamId, false) :
            params.publicLink ? getTeamDetailByPublicLink(params.publicLink) : getTeamDetailByHash(params.hash, false)

        promise.then((res) => {
            if (res.memberships) {
                const userMembershipRole = (res.memberships.find(m => m.person.id === user.person.id) || {role: ROLES.GUEST}).role;
                const adminAlert = userMembershipRole !== ROLES.MEMBER &&
                    res.memberships.filter(member => member.role === ROLES.ADMIN || member.role === ROLES.OWNER).length < 2 &&
                    [ROLES.ADMIN].includes(userMembershipRole) &&
                    (res.invitations || []).filter(inv => inv.intendedRole === ROLES.ADMIN).length === 0;
                setAlerts(adminAlert ? [I18n.t(`teamDetails.alerts.singleAdmin`)] : []);

                const pendingInvitations = (res.invitations || [])
                    .filter(invitation => !invitation.expired && !invitation.accepted && !invitation.declined)
                    .map(invitation => ({
                        person: {name: "-", email: invitation.email},
                        created: invitation.timestamp / 1000,
                        isInvitation: true,
                        isExternalTeam: false,
                        filters: ["INVITEE"],
                        role: invitation.intendedRole,
                        invitationID: invitation.id,
                        id: invitation.id,
                    }));

                const joinRequests = (res.joinRequests || [])
                    .map(joinRequest => ({
                        ...joinRequest,
                        isJoinRequest: true,
                        isExternalTeam: false,
                        filters: ["JOIN_REQUEST"],
                        role: ROLES.MEMBER
                    }))
                const newMemberList = [...res.memberships];
                newMemberList.forEach(member => {
                    member.filters = [member.role];
                    member.isExternalTeam = false;
                    member.isMember = true;
                });
                const externalTeams = (res.externalTeams || [])
                    .map(externalTeam => ({
                        ...externalTeam,
                        isExternalTeam: true,
                        filters: [ROLES.MEMBER],
                        person: {
                            name: externalTeam.name,
                            email: I18n.t("teamDetails.externalTeam")
                        },
                        created: externalTeam.createdAt,
                        role: ROLES.MEMBER
                    }))
                const members = externalTeams.concat(newMemberList).concat(pendingInvitations).concat(joinRequests);
                setMembersFilter({
                    value: "ALL",
                    label: `${I18n.t(`teamDetails.filters.all`)} (${members.length})`,
                });
                setTeam(res);
                setMembersList(members);
                setUserRoleInTeam(userMembershipRole);
                setLoaded(true);
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
            setDefaultRole(ROLES.MEMBER);
            setShowAddAdminsButton(false);
        }
        if (params.hash) {
            getInvitationInfo(params.hash)
                .then(invitation => {
                    setInvitation(invitation);
                    if (invitation.accepted || invitation.declined) {
                        setConfirmation({
                            cancel: null,
                            confirmationTxt: I18n.t("invalidInvitation.confirm"),
                            action: () => navigate("/"),
                            warning: false,
                            question: I18n.t(`invalidInvitation.${invitation.accepted ? "alreadyAccepted" : "alreadyDeclined"}`),
                        });
                        setConfirmationOpen(true);
                        setLoaded(true);
                    } else {
                        setWelcomeOpen(true);
                        updateTeam();
                    }
                }).catch(() => navigate("/404"))
        } else if (params.publicLink) {
            getPublicLink(params.publicLink).then(publicLink => {
                setInvitation({alreadyMember: publicLink.alreadyMember, expired: false, intendedRole: ROLES.MEMBER});
                setWelcomeOpen(true);
                updateTeam();
            })
        } else {
            updateTeam();
        }

    }, [updateTeam, params, navigate]);

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
            if (sort.field === "initial") {
                toDisplay.sort((a, b) => (+b.isExternalTeam) - (+a.isExternalTeam) || a.person.name.localeCompare(b.person.name));
            } else {
                toDisplay.sort((a, b) => (getSortField(a) > getSortField(b) ? 1 : -1));
                if (sort.direction !== "ascending") {
                    toDisplay.reverse();
                }
            }
            setDisplayedMembers(toDisplay.filter(m => hideInvitees ? !m.isInvitation : true));
        };
        updateDisplayedMembers();
    }, [memberList, sort, searchQuery, membersFilter, hideInvitees]);

    const renderAlertBanners = () => {
        return alerts.map((alert, index) => {
            return (
                <div key={index} className="alert-banner-wrapper">
                    <div className="alert-banner-container">
                        <span className="alert-banner">{alert}</span>
                        {showAddAdminsButton && <Button
                            onClick={() => {
                                setShowAddMembersForm(true);
                                setDefaultRole(ROLES.ADMIN);
                                setShowAddAdminsButton(false);
                                setShowExternalTeams(false);
                            }}
                            txt={I18n.t(`teamDetails.addMembers.buttons.addAdministrator`)}
                            className="cancel"/>}
                    </div>
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
            <nav aria-label="team actions"
                 className="filter-dropdown-container">
                <DropDownMenu title={membersFilter.label}
                              actions={options.filter((option) => option.count !== 0)}/>
            </nav>);
    };

    const doAcceptInvitation = () => {
        const promise = params.hash ? acceptInvitation(params.hash) : acceptPublicLink(params.publicLink);
        promise.then(() => {
            setWelcomeOpen(false);
            navigate(`/team-details/${team.id}`);
        });
    }

    const doDenyInvitation = () => {
        navigate("/my-teams");
    }

    const processRemoveMember = (member, showConfirmation) => {
        const confPart = member.isInvitation ? "Invitation" : member.isJoinRequest ? "JoinRequest" : member.isExternalTeam ? "ExternalTeam" : "Member";
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => processRemoveMember(member, false),
                warning: false,
                question: I18n.t(`teamDetails.confirmations.remove${confPart}`),
            });
            setConfirmationOpen(true);
        } else {
            if (member.isInvitation) {
                deleteInvitation(member.invitationID).then(updateTeam);
            } else if (member.isJoinRequest) {
                rejectJoinRequest(member.id).then(updateTeam);
            } else if (member.isExternalTeam) {
                delinkExternalTeam(team.id, member.identifier).then(updateTeam);
            } else {
                deleteMember(member.id).then(updateTeam);
            }
            setConfirmationOpen(false);
        }
    };

    const handleResetPublicLink = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => handleResetPublicLink(false),
                warning: false,
                question: I18n.t(`newTeam.publicLinkResetConfirmation`),
            });
            setConfirmationOpen(true);
        } else {
            resetPublicLink(team.id).then(updateTeam);
            setConfirmationOpen(false);
        }
    };


    const renderDeleteButton = member => {
        const icon = (
            <button
                className="bin-icon"
                aria-hidden="true"
                onClick={() => processRemoveMember(member, true)}>
                <BinIcon/>
                <span className="visually-hidden">Remove member {member.name}</span>
            </button>
        );
        const isManagerWhoCanDeleteMembers = ROLES.MANAGER === userRoleInTeam && member.isMember && ROLES.MEMBER === member.role;
        const isOwnerOrAdmin = [ROLES.OWNER, ROLES.ADMIN].includes(userRoleInTeam);
        return (
            <>{(isManagerWhoCanDeleteMembers || isOwnerOrAdmin) ? icon : I18n.t("myteams.empty")} </>
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
                emptyHeader: true,
                sortable: false,
            },
        ];
        if (![ROLES.ADMIN, ROLES.OWNER, ROLES.GUEST].includes(userRoleInTeam)) {
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
        if (userRoleInTeam === ROLES.GUEST) {
            return "";
        }
        if (member.isJoinRequest || member.isInvitation) {
            return "clickable top-height";
        }
        if (member.isExternalTeam) {
            return "top-height";
        }
        return "";
    }

    const addHistoryState = () => {
        if (initial) {
            window.history.pushState({}, "Details", `/team-details/${team.id}?path=show-form`);
            setInitial(false);
        }
    }

    const tdClick = member => {
        if (userRoleInTeam === ROLES.GUEST) {
            return;
        }
        addHistoryState();
        if (member.isJoinRequest) {
            document.title = I18n.t("headerTitles.index", {page: I18n.t("headerTitles.join-request")});
            setSelectedJoinRequest(member);
        } else if (member.isInvitation) {
            document.title = I18n.t("headerTitles.index", {page: I18n.t("headerTitles.invitation")});
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

    const nameColumn = member => {
        if (member.isInvitation) {
            return <span>{member.person.name}</span>
        }
        if (member.isExternalTeam) {
            return <Tippy content={member.identifier}>
                <span>{member.name}</span>
            </Tippy>
        }
        return <Tippy content={member.person.urn}>
            <span>{member.person.name}</span>
        </Tippy>
    }

    const idpColumn = member => {
        if (member.isExternalTeam) {
            return null;
        }
        return (
            <span className="idp">
                <Tippy content={<span dangerouslySetInnerHTML={{
                    __html: I18n.t(`teamDetails.idp.${member.isInvitation ? "unknown" : member.person.guest ? "guest" : "idp"}`)
                }}/>}>
                    {member.isInvitation ? <UnknownIDPIcon/> : member.person.guest ? <GuestIDPIcon/> : <IDPIcon/>}
                </Tippy>
            </span>
        )
    }

    const processChangeExpiryDate = (memberId) => {
        const member = memberList.find(m => m.id === memberId && m.isMember === true);
        const membershipExpiryDate = {id: member.id, expiryDate: currentExpiryDate};
        setConfirmationOpen(false);
        setShowMemberExpiryDate(false);
        setLoaded(false);
        changeExpiryDate(membershipExpiryDate).then(() => {
            updateTeam();
            setFlash(I18n.t("teamDetails.flash.expiryDateChanged", {
                name: member.person.name
            }));
        });
    }

    const showExpiryDate = (e, memberId) => {
        stopEvent(e);
        const member = memberList.find(m => m.id === memberId && m.isMember === true);
        setShowMemberExpiryDate(true);
        setExpiryDate(member.expiryDate ? new Date(member.expiryDate * 1000) : null);
        setConfirmation({
            cancel: () => {
                setConfirmationOpen(false);
                setShowMemberExpiryDate(false);
            },
            action: () => processChangeExpiryDate(memberId),
            warning: false,
            question: I18n.t("teamDetails.confirmations.expiryDate"),
        });
        setConfirmationOpen(true);
    }

    const renderMembersRow = (member, index) => {
        const roleActions = roleOptions(member).map(
            role => ({
                name: I18n.t(`roles.${role.toLowerCase()}`),
                action: () => processChangeMemberRole(member, role, true)
            }));
        return (
            <tr key={index} className={`${tdClassName(member)} `}>
                <td data-label={I18n.t(`teamDetails.columns.name`)}
                    className={`${tdClassName(member)} ${member.urnPerson === user.urn ? "me" : ""}`}
                    onClick={() => !member.isExternalTeam && tdClick(member)}>
                    {nameColumn(member)}
                </td>
                {[ROLES.ADMIN, ROLES.OWNER, ROLES.GUEST].includes(userRoleInTeam) &&
                <td data-label={I18n.t(`teamDetails.columns.idp`)}
                    className={tdClassName(member)}
                    onClick={() => tdClick(member)}>
                    {idpColumn(member)}
                </td>
                }
                <td data-label={I18n.t(`teamDetails.columns.email`)}
                    className={tdClassName(member)}
                    onClick={() => tdClick(member)}>
                    {member.person.email}
                </td>
                <td data-label={I18n.t(`teamDetails.columns.role`)}
                    className={`roles-entry ${tdClassName(member)}`}
                    onClick={() => tdClick(member)}>
                    {((userRoleInTeam === ROLES.ADMIN || userRoleInTeam === ROLES.OWNER) && !member.isInvitation && !member.isJoinRequest && !member.isExternalTeam) ?
                        <DropDownMenu title={I18n.t(`roles.${member.role.toLowerCase()}`)} actions={roleActions}/> :
                        <span className="read-only-role">{I18n.t(`roles.${member.role.toLowerCase()}`)}</span>}
                </td>
                <td data-label={I18n.t(`teamDetails.columns.joined`)}
                    className={`joined-entry ${tdClassName(member)}`}
                    onClick={() => tdClick(member)}>
                    <span className="joined-wrapper">
                        <span className={"date-string"}>{getDateString(member.created)}</span>
                        {(member.isMember && [ROLES.ADMIN, ROLES.OWNER].includes(userRoleInTeam))
                        && <button className={"btn-icon link"}
                                   onClick={e => showExpiryDate(e, member.id)}>
                            {I18n.t(`teamDetails.${member.expiryDate ? "expires" : "noExpires"}`, {expiryDate: getDateString(member.expiryDate)})}
                        </button>}
                        {(member.isInvitation && [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER].includes(userRoleInTeam))
                        && <span className="details">
                            {I18n.t(`teamDetails.inviteSent`)}
                            <button className={"btn-icon"}
                                    aria-expanded={selectedInvitation && true}>
                                <span className="visually-hidden">Open invitation</span>
                                <EmailIcon/>
                                </button>
                            </span>
                        }
                        {(member.isInvitation && userRoleInTeam === ROLES.GUEST) && <span className="details">
                            {I18n.t(`teamDetails.inviteSent`)}<EmailIcon/>
                        </span>}
                        {(member.isJoinRequest && [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER].includes(userRoleInTeam))
                        && <span className="details">
                            {I18n.t(`teamDetails.joinRequest`)}
                            <button className={"btn-icon"}
                                    aria-expanded={selectedJoinRequest && true}>
                                <span className="visually-hidden">Open JoinRequest</span>
                                <JoinRequestIcon/>
                            </button>

                            </span>}
                        {(member.isJoinRequest && userRoleInTeam === ROLES.GUEST) && <span className="details">
                            {I18n.t(`teamDetails.joinRequest`)}
                            <JoinRequestIcon/>
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

    const copyToClipBoard = () => {
        navigator.clipboard.writeText(`${user.groupNameContext}${team.urn}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1250);
    }

    const copyPublicLinkToClipBoard = universalPublicLink => {
        navigator.clipboard.writeText(universalPublicLink);
        setUniversalLinkCopied(true);
        setTimeout(() => setUniversalLinkCopied(false), 1250);
    }

    const editTeam = () => {
        navigate(`/edit-team/${team.id}`);
    }

    const startMigrationForm = () => {
        addHistoryState();
        setShowAddMembersForm(false);
        setShowAddAdminsButton(false);
        setShowShowMigrateForm(true);
        document.title = I18n.t("headerTitles.index", {page: I18n.t("headerTitles.migrate")});
    }

    const migrateTeam = () => {
        setLoaded(false);
        teamInviteAppMigrate(team.id)
            .then(() => {
                navigate("/my-teams");
                setFlash(I18n.t("migrateTeam.success", {name: team.name}));
            })
            .catch(e => {
                setLoaded(true);
                if (e.response) {
                    e.response.json().then(res => {
                        setConfirmation({
                            cancel: null,
                            confirmationTxt: I18n.t("invalidInvitation.confirm"),
                            action: () => setConfirmationOpen(false),
                            warning: true,
                            question: I18n.t("migrateTeam.error", {error: JSON.stringify(res)}),
                        });
                        setConfirmationOpen(true);
                        setLoaded(true);
                    })
                } else {
                    setConfirmation({
                        cancel: null,
                        confirmationTxt: I18n.t("invalidInvitation.confirm"),
                        action: () => setConfirmationOpen(false),
                        warning: true,
                        question: I18n.t("migrateTeam.error", {error: JSON.stringify(e)}),
                    });
                    setConfirmationOpen(true);
                    setLoaded(true);
                }
            });
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
        setLoaded(false);
        deleteTeam(team.id).then(() => {
            navigate("/my-teams");
            setFlash(I18n.t(`myteams.flash.${team.isJoinRequest ? "joinRequestDeleted" : "teamDeleted"}`, {name: team.name}));
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
        if (user.superAdminModus) {
            actions.push({
                name: I18n.t("details.migrate"),
                action: () => startMigrationForm(),
            })
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

    const location = window.location;
    const universalPublicLink = `${location.protocol}//${location.hostname}${location.port ? ":" + location.port : ""}/public/${team.publicLink}`;

    const isMoreThenMember = [ROLES.ADMIN, ROLES.OWNER, ROLES.MANAGER].includes(userRoleInTeam);
    const invitationInvalid = invitation && (invitation.accepted || invitation.declined || invitation.expired);
    return (
        <Page>
            {!invitationInvalid && <SubHeader>
                <BreadCrumb paths={paths}/>
            </SubHeader>}
            {!invitationInvalid && <SubHeader>
                <div className="team-actions">
                    <div>
                        <h1 onClick={() => setShowAddMembersForm(false)}>{team.name}</h1>
                        <div className="team-access-bar">
                            {!team.viewable && <PrivateTeamLabel/>}
                            <div className="urn-container">
                                <span>{`${user.groupNameContext}${team.urn}`}</span>
                                <button onClick={copyToClipBoard}>
                                    <span className={"visually-hidden"}>Copy the group name</span>
                                    {!copied && <CopyIcon/>}
                                    {copied && <Tippy content={I18n.t("teamDetails.copied")} visible={true}>
                                        <CopyIcon/>
                                    </Tippy>}
                                </button>
                            </div>
                        </div>
                        {((userRoleInTeam === ROLES.ADMIN || userRoleInTeam === ROLES.OWNER) &&
                            !team.publicLinkDisabled) &&
                        <div className="team-access-bar">
                            <div className="urn-container">
                                <span>{universalPublicLink}</span>
                                <button onClick={() => copyPublicLinkToClipBoard(universalPublicLink)}>
                                    <span className={"visually-hidden"}>Copy the group universal link</span>
                                    {!universalLinkCopied && <CopyIcon/>}
                                    {universalLinkCopied &&
                                    <Tippy content={I18n.t("teamDetails.copied")} visible={true}>
                                        <CopyIcon/>
                                    </Tippy>}
                                </button>
                                <button onClick={() => handleResetPublicLink(true)}>
                                    <span className={"visually-hidden"}>Reset public link</span>
                                    <Tippy content={I18n.t("newTeam.publicLinkReset")}>
                                        <ReloadIcon/>
                                    </Tippy>
                                </button>
                            </div>
                        </div>}

                        <MarkDown markdown={team.description || ""}/>
                    </div>
                    <ActionMenu title={actionDropDownTitle(team, user)}
                                actions={getActions()}/>
                </div>
            </SubHeader>}
            {confirmationOpen && (
                <ConfirmationDialog
                    isOpen={confirmationOpen}
                    cancel={confirmation.cancel}
                    confirm={confirmation.action}
                    confirmationTxt={confirmation.confirmationTxt || I18n.t("confirmationDialog.confirm")}
                    isWarning={confirmation.warning}
                    question={confirmation.question}>
                    {showMemberExpiryDate && <div className={"change-expiry-date"}>
                        <DateField onChange={d => setExpiryDate(d)}
                                   value={expiryDate}
                                   isOpen={true}
                                   minDate={addDays(30)}
                        />
                    </div>}
                </ConfirmationDialog>
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
            {(!showAddMembersForm && !selectedJoinRequest && !selectedInvitation && !showExternalTeams && !invitationInvalid
            && !showMigrateForm) && (
                <div className="team-members">
                    {!team.hideMembers && <h2>{I18n.t("teamDetails.members")} ({memberList.length})</h2>}
                    {team.hideMembers && <h3>{I18n.t("teamDetails.hideMembers")}</h3>}
                    <div className="team-actions-bar">
                        {(isMoreThenMember || !team.hideMembers) && renderFilterDropdown()}
                        {(isMoreThenMember || !team.hideMembers) && <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            searchInputRef={searchInputRef}
                        />}
                        {isMoreThenMember &&
                        <span className="hide-invitees-wrapper">
                                <CheckBox name="hide-invitees-checkbox"
                                          info={team.invitations && team.invitations.length > 0
                                              ? I18n.t("teamDetails.hideInvitees")
                                              : I18n.t("teamDetails.noInvitees")}
                                          onChange={() => setHideInvitees(!hideInvitees)}
                                          value={hideInvitees}
                                          readOnly={!team.invitations || team.invitations.length === 0}/>
                            </span>
                        }
                        {isMoreThenMember &&
                        <div className="action-button-wrapper">
                            {(user.externalTeams && user.externalTeams.length > 0) &&
                            <Button onClick={() => {
                                addHistoryState();
                                setShowExternalTeams(true);
                                document.title = I18n.t("headerTitles.index", {page: I18n.t("headerTitles.include-team")});
                            }}
                                    txt={I18n.t(`teamDetails.includeTeam`)}
                                    className="cancel"/>}
                            {<Button onClick={() => {
                                addHistoryState();
                                setShowAddMembersForm(true);
                                setShowAddAdminsButton(false);
                                setDefaultRole(ROLES.MEMBER);
                                document.title = I18n.t("headerTitles.index", {page: I18n.t("headerTitles.add-members")});
                            }}
                                     txt={I18n.t(`teamDetails.addMembers.buttons.add`)}
                                     className="add-member-button"/>}
                        </div>
                        }
                    </div>
                    {renderMembersTable()}
                </div>
            )}
            {showAddMembersForm && (
                <AddTeamMembersForm updateTeam={updateTeam}
                                    team={team}
                                    user={user}
                                    setShowForm={hideAddMembersForm}
                                    isNewTeam={isNewTeam}
                                    defaultRole={defaultRole}/>
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

            {showMigrateForm && <MigrateTeamForm migrateTeam={migrateTeam}
                                                 team={team}
                                                 setShowForm={setShowShowMigrateForm}/>}
        </Page>
    );
};
export default TeamDetail;
