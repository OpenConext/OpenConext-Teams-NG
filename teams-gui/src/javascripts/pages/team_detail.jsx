import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import I18n from "i18n-js";
import CopyToClipboard from "react-copy-to-clipboard";

import {
    approveJoinRequest,
    changeRole,
    deleteInvitation,
    deleteMember,
    deleteTeam,
    getTeamDetail,
    leaveTeam,
    rejectJoinRequest,
    saveTeam
} from "../api";
import {handleServerError, setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";
import moment from "moment";
import SortDropDown from "../components/sort_drop_down";
import FilterDropDown from "../components/filter_drop_down";
import DropDownActions from "../components/drop_down_actions";
import InlineEditable from "../components/inline_editable";
import CheckBox from "../components/checkbox";
import IconLegend from "../components/icon_legend";
import {
    allowedToLeave,
    currentUserRoleInTeam,
    hasOneAdmin,
    iconForRole,
    isOnlyAdmin,
    labelForRole,
    ROLES
} from "../validations/memberships";
import SelectRole from "../components/select_role";

export default class TeamDetail extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            team: {},
            members: [],
            visibleMembers: [],
            actions: {show: false, id: ""},
            sortAttributes: [
                {name: "name", order: "down", current: false},
                {name: "email", order: "down", current: false},
                {name: "status", order: "down", current: true},
                {name: "role", order: "down", current: false}
            ],
            filterAttributes: [
                {name: ROLES.ADMIN.role, selected: true, count: 0},
                {name: ROLES.MANAGER.role, selected: true, count: 0},
                {name: ROLES.MEMBER.role, selected: true, count: 0},
                {name: ROLES.JOIN_REQUEST.role, selected: true, count: 0},
                {name: ROLES.INVITATION.role, selected: true, count: 0}
            ],
            loaded: false,
            copiedToClipboard: false,
            isOnlyAdmin: false,
            roleInTeam: ROLES.MEMBER.role,
            searchQuery: "",
            tab: "members"
        };
    }

    componentWillMount = () => this.refreshTeamState(this.props.match.params.id);

    refreshTeamState = (teamId, callback = () => 1) => getTeamDetail(teamId).then(team => {
        this.stateTeam(team, true);
        callback();
    }).catch(err => handleServerError(err));

    stateTeam(team, displayOneAdminWarning) {
        const joinRequests = (team.joinRequests || []).map(joinRequest => {
            return {
                ...joinRequest,
                role: ROLES.MEMBER.role, isJoinRequest: true,
                name: joinRequest.person.name, email: joinRequest.person.email,
                filterAttribute: ROLES.JOIN_REQUEST.role, order: 1
            };
        });

        const invitations = (team.invitations || []).map(invitation => {
            return {
                ...invitation,
                role: invitation.intendedRole, isInvitation: true, person: {name: "", email: invitation.email},
                filterAttribute: ROLES.INVITATION.role, order: 2
            };
        });

        const members = team.memberships.map(member => {
            return {...member, isMembership: true, filterAttribute: member.role, order: 3};
        }).concat(joinRequests).concat(invitations);

        if (displayOneAdminWarning && hasOneAdmin(team, this.props.currentUser)) {
            setFlash(I18n.t("team_detail.one_admin_warning"), "warning");
        }

        const currentSorted = this.currentSorted();
        const sortedMembers = [...members].sort(this.sortByAttribute(currentSorted.name, currentSorted.order === "up"));

        const newFilterAttributes = [...this.state.filterAttributes];
        newFilterAttributes.forEach(attr => attr.count = members.filter(member => member.filterAttribute === attr.name).length);

        const {currentUser} = this.props;
        this.setState({
            team: team,
            members: members,
            visibleMembers: sortedMembers,
            filterAttributes: newFilterAttributes.filter(attr => attr.count > 0),
            loaded: true,
            isOnlyAdmin: isOnlyAdmin(team, currentUser),
            roleInTeam: currentUserRoleInTeam(team, currentUser)
        });

    }

    sortByStatus = (member, otherMember) => {
        if (member.isMembership && otherMember.isMembership) {
            return member.created > otherMember.created ? 1 : member.created === otherMember.created ? 0 : -1;
        }
        return member.order > otherMember.order ? 1 : member.order === otherMember.order ? 0 : -1;
    };

    handleDeleteTeam = team => e => {
        stop(e);
        if (confirm(I18n.t("team_detail.confirmations.delete_team", {name: team.name}))) {
            deleteTeam(team.id).then(() => {
                this.props.history.replace("/my-teams");
                setFlash(I18n.t("team_detail.flash.deleted", {name: team.name}));
            });
        }
    };

    handleLeaveTeam = myMembershipId => e => {
        stop(e);
        const i18nHash = {name: this.state.team.name};
        if (confirm(I18n.t("team_detail.confirmations.leave_team", i18nHash))) {
            leaveTeam(myMembershipId).then(() => {
                this.props.history.replace("/my-teams");
                setFlash(I18n.t("team_detail.flash.left", i18nHash));
            });
        }
    };

    handleInvite = () => this.props.history.replace(`/invite/${this.state.team.id}`);

    handleDeleteInvitation = invitation => e => {
        stop(e);
        const i18nHash = {name: invitation.email};
        if (confirm(I18n.t("team_detail.confirmations.delete_invitation", i18nHash))) {
            deleteInvitation(invitation.id).then(() =>
                this.refreshTeamState(this.state.team.id, () => setFlash(I18n.t("team_detail.flash.deleted_invitation", i18nHash))));
        }
    };

    handleAcceptJoinRequest = member => e => {
        stop(e);
        if (confirm(I18n.t("team_detail.confirmations.accept_join_request", {name: member.name}))) {
            const i18nHash = {name: member.name};
            approveJoinRequest(member.id).then(() =>
                this.refreshTeamState(this.state.team.id, () => setFlash(I18n.t("team_detail.flash.accepted_join_request", i18nHash))));
        }
    };

    handleRejectJoinRequest = member => e => {
        stop(e);
        if (confirm(I18n.t("team_detail.confirmations.reject_join_request", {name: member.name}))) {
            const i18nHash = {name: member.name};
            rejectJoinRequest(member.id).then(() =>
                this.refreshTeamState(this.state.team.id, () => setFlash(I18n.t("team_detail.flash.rejected_join_request", i18nHash))));
        }
    };

    handleLinkExternalTeam = () => this.props.history.replace(`/external/${this.state.team.id}`);

    saveTeamProperties = changedAttribute => {
        const {team} = this.state;
        const teamProperties = {
            id: team.id,
            description: team.description,
            personalNote: team.personalNote,
            viewable: team.viewable
        };
        saveTeam({...teamProperties, ...changedAttribute})
            .then(team => {
                this.stateTeam(team, false);
                setFlash(I18n.t("teams.flash", {name: team.name, action: I18n.t("teams.flash_updated")}));
            })
            .catch(err => handleServerError(err));
    };

    handleDeleteMember = (member, teamId) => e => {
        stop(e);
        const i18nHash = {name: member.name};
        if (confirm(I18n.t("team_detail.confirmations.delete_member", i18nHash))) {
            deleteMember(member.id).then(() =>
                this.refreshTeamState(teamId, () => setFlash(I18n.t("team_detail.flash.deleted_member", i18nHash))));
        }
    };

    changeMembershipRole = member => role => {
        const {currentUser} = this.props;
        const downgrade = member.urnPerson === currentUser.urn;
        let confirmed = true;
        if (downgrade) {
            confirmed = confirm(I18n.t("team_detail.confirmations.downgrade_current_user", {name: this.state.team.name}));
        }
        if (confirmed) {
            changeRole({id: member.id, role: role.value})
                .then(membership => {
                    const team = {...this.state.team};
                    team.memberships.filter(m => m.id === membership.id)[0].role = membership.role;
                    this.stateTeam(team, true);
                    setFlash(I18n.t("team_detail.flash.role_changed", {
                        name: membership.person.name,
                        role: labelForRole(membership.role)
                    }));
                })
                .catch(err => handleServerError(err));
        }
    };

    search = e => {
        const searchQuery = e.target.value ? e.target.value.toLowerCase() : "";
        const searchedMembers = this.invariantVisibleMembers(this.state.members, searchQuery,
            this.state.filterAttributes, this.currentSorted());
        this.setState({visibleMembers: searchedMembers, searchQuery: searchQuery});
    };

    filter = item => {
        const {members, filterAttributes} = this.state;
        const newFilterAttributes = [...filterAttributes];
        newFilterAttributes.forEach(attr => {
            if (attr.name === item.name) {
                attr.selected = !attr.selected;
            }
        });
        const newFilteredMembers = this.invariantVisibleMembers(members, this.state.searchQuery, newFilterAttributes,
            this.currentSorted());
        this.setState({visibleMembers: newFilteredMembers, filterAttributes: newFilterAttributes});
    };

    sort = item => {
        const {visibleMembers, sortAttributes} = this.state;
        const newSortAttributes = [...sortAttributes];
        newSortAttributes.forEach(attr => {
            if (attr.name === item.name) {
                attr.order = item.current ? (item.order === "down" ? "up" : "down") : "down";
                attr.current = true;
            } else {
                attr.order = "down";
                attr.current = false;
            }
        });
        const sortedMembers = this.doSort(visibleMembers, item);
        this.setState({visibleMembers: sortedMembers, sortAttributes: newSortAttributes});
    };

    doSearch = (members, input) => {
        let searchedMembers;
        if (isEmpty(input)) {
            searchedMembers = members;
        } else {
            searchedMembers = members.filter(member => member.person.name.toLowerCase().indexOf(input) > -1 ||
            member.person.email.toLowerCase().indexOf(input) > -1);
        }
        return searchedMembers;
    };

    doFilter = (members, filterAttributes) =>
        members.filter(member => filterAttributes.filter(attr => attr.name === member.filterAttribute)[0].selected);

    doSort = (members, currentSorted) =>
        [...members.sort(this.sortByAttribute(currentSorted.name, currentSorted.order === "up"))];

    invariantVisibleMembers = (members, searchQuery, filterAttributes, sortItem) =>
        this.doSort(this.doFilter(this.doSearch(members, searchQuery), filterAttributes), sortItem);

    sortByAttribute = (name, reverse = false) => (a, b) => {
        if (name === "status") {
            return this.sortByStatus(a, b) * (reverse ? -1 : 1);
        }
        if (a["person"][name] && b["person"][name]) {
            return a["person"][name].toString().localeCompare(b["person"][name].toString()) * (reverse ? -1 : 1);
        }
        if (a[name] && b[name]) {
            return a[name].toString().localeCompare(b[name].toString()) * (reverse ? -1 : 1);
        }
        return a.toString().localeCompare(b.toString()) * (reverse ? -1 : 1);
    };

    changePersonalNote = personalNote => {
        this.saveTeamProperties({personalNote: personalNote});
    };

    changeDescription = description => {
        this.saveTeamProperties({description: description});
    };

    changeViewable = () => {
        this.saveTeamProperties({viewable: !this.state.team.viewable});
    };

    copiedToClipboard = () => {
        this.setState({copiedToClipboard: true});
        setTimeout(() => this.setState({copiedToClipboard: false}), 5000);
    };

    teamDetailHeader(team, role, currentUser) {
        const myMembershipId =
            team.memberships.filter(membership => membership.urnPerson === currentUser.urn).map(membership => membership.id)[0];
        return (
            <section className="team-header">
                <Link className="back" to="/my-teams"><i className="fa fa-arrow-left"></i>
                    {I18n.t("team_detail.back")}
                </Link>
                <div className="actions">
                    <h2>{team.name}</h2>
                    {allowedToLeave(team, currentUser) && <a className="button" href="#"
                                                             onClick={this.handleLeaveTeam(myMembershipId)}>{I18n.t("team_detail.leave")}
                        <i className="fa fa-sign-out"></i>
                    </a>}
                    {role === ROLES.ADMIN.role && <a className="button" href="#"
                                                     onClick={this.handleDeleteTeam(team)}>{I18n.t("team_detail.delete")}
                        <i className="fa fa-trash"></i>
                    </a>}
                </div>
            </section>
        );
    }

    teamDetailAttributes(team, role, currentUser) {
        const isAdmin = role === ROLES.ADMIN.role;
        const {copiedToClipboard} = this.state;
        const copiedToClipBoardClassName = copiedToClipboard ? "copied" : "";
        const tooltip = I18n.t(copiedToClipboard ? "team_detail.copied" : "team_detail.copy");

        const universalUrn = `${currentUser.groupNameContext}${team.urn}`;

        return (
            <section className="team-attributes">
                <div className="team-attribute">
                    <label>{I18n.t("team_detail.urn")}</label>
                    <CopyToClipboard text={universalUrn} onCopy={this.copiedToClipboard}>
                        <span>{universalUrn}
                            <a data-for="copy-to-clipboard" data-tip>
                                <i className={`fa fa-clone ${copiedToClipBoardClassName}`}></i>
                            </a>
                            <ReactTooltip id="copy-to-clipboard" place="right" getContent={[() => tooltip, 500]}/>
                        </span>
                    </CopyToClipboard>

                </div>
                <InlineEditable name="team_detail.description" mayEdit={isAdmin} value={team.description || ""}
                                onChange={this.changeDescription}/>
                {isAdmin &&
                <InlineEditable name="team_detail.personalNote" mayEdit={isAdmin} value={team.personalNote || ""}
                                onChange={this.changePersonalNote}/>}
                <div className="team-attribute">
                    <label className="info-after" htmlFor="viewable">{I18n.t("team_detail.viewable")}</label>
                    <em className="info" htmlFor="viewable">{I18n.t("team_detail.viewable_info")}</em>
                </div>
                <CheckBox name="viewable" value={team.viewable || false} readOnly={!isAdmin}
                          onChange={this.changeViewable}/>
            </section>
        );
    }

    tabsAndIconLegend = (team, tab) => {
        const memberCount = team.memberships.length;
        const externalCount = (team.externalTeams || []).length;
        return (
            <IconLegend>
                <div className="members-tab">
                    <span className={tab === "members" ? "active" : ""} onClick={() => this.setState({tab: "members"})}>
                        {I18n.t("team_detail.team_members", {count: memberCount})}
                        </span>
                    <span className={tab === "groups" ? "active" : ""} onClick={() => this.setState({tab: "groups"})}>
                        {I18n.t("team_detail.team_groups", {count: externalCount})}</span>
                </div>
            </IconLegend>
        );
    };

    currentSorted = () => this.state.sortAttributes.filter(attr => attr.current)[0];

    statusOfMembership = member => {
        if (member.isMembership) {
            return moment.unix(member.created).format("LLL");
        } else if (member.isJoinRequest) {
            const toolTipId = `join_request_tooltip_${member.id}`;
            const label = labelForRole(ROLES.JOIN_REQUEST.role);
            return (
                <span className="join-request" data-for={toolTipId} data-tip>
                <i className={iconForRole(ROLES.JOIN_REQUEST.role)}></i>{label}
                    <i className="fa fa-info-circle"></i>
                <ReactTooltip id={toolTipId} type="light" class="tool-tip" effect="solid">
                    <span className="label">{label}</span>
                    <span className="label">{I18n.t("teams.created")}<span
                        className="value">{moment.unix(member.created).format("LLL")}</span></span>
                    <span className="label">{I18n.t("team_detail.email")}<span
                        className="value">{member.person.email}</span></span>
                    <span className="label">{I18n.t("teams.message")}</span>
                    <span>{member.message}</span>
                </ReactTooltip>
                </span>
            );
        } else if (member.isInvitation) {
            const label = labelForRole(ROLES.INVITATION.role);
            const toolTipId = `invitation_${member.id}`;
            const latestMessage = member.invitationMessages[member.invitationMessages.length - 1];
            return (
                <span className="invitation" data-for={toolTipId} data-tip>
                    <i className={iconForRole(ROLES.INVITATION.role)}></i>
                    {label}
                    <i className="fa fa-info-circle"></i>
                <ReactTooltip id={toolTipId} type="light" class="tool-tip" effect="solid">
                    <span className="label">{label}</span>
                    <span className="label">{I18n.t("teams.created")}<span
                        className="value">{moment(latestMessage.timestamp).format("LLL")}</span></span>
                    <span className="label">{I18n.t("team_detail.intended_role")}<span
                        className="value">{member.intendedRole}</span></span>
                    <span className="label">{I18n.t("team_detail.email")}<span
                        className="value">{member.person.email}</span></span>

                    <span className="label">{I18n.t("teams.message")}</span>
                    <span>{latestMessage.message}</span>
                </ReactTooltip>
                </span>
            );
        }
        throw new Error(`Unknown kind of member ${JSON.stringify(member)}`);
    };

    roleCell = member => {
        const {roleInTeam, isOnlyAdmin} = this.state;
        return (
            <SelectRole onChange={this.changeMembershipRole(member)} role={member.role}
                        roleOfCurrentUserInTeam={roleInTeam} isOnlyAdmin={isOnlyAdmin}
                        isCurrentUser={member.urnPerson === this.props.currentUser.urn}
                        disabled={member.isJoinRequest || member.isInvitation}/>
        );
    };

    toggleActions = (member, actions) => e => {
        stop(e);
        const actionId = this.actionId(member);
        const newShow = actions.id === actionId ? !actions.show : true;
        this.setState({actions: {show: newShow, id: actionId}});
    };

    actionId = member => `${member.id}_${member.isJoinRequest ? "join_request" : member.isInvitation ? "invitation" : "member"}`;

    actionOptions = (currentUser, member, team) => {
        const isMemberCurrentUser = member.urnPerson !== currentUser.urn;
        const currentRole = currentUserRoleInTeam(team, currentUser);
        const isMember = currentRole === ROLES.MEMBER.role;
        const isAdmin = currentRole === ROLES.ADMIN.role;

        const options = [];
        if (member.isJoinRequest && !isMember) {
            options.push({
                icon: "fa fa-check",
                label: "join_request_accept",
                action: this.handleAcceptJoinRequest(member)
            });
            options.push({
                icon: "fa fa-times",
                label: "join_request_reject",
                action: this.handleRejectJoinRequest(member)
            });
        }
        if (member.isInvitation && !isMember) {
            options.push({
                icon: "fa fa-send-o",
                label: "invite_resend",
                action: () => this.props.history.replace(`/invite/${this.state.team.id}/${member.id}`)
            });
            options.push({
                icon: "fa fa-trash",
                label: "invite_delete",
                action: this.handleDeleteInvitation(member)
            });
        }
        if (member.isMembership) {
            if (!isMemberCurrentUser && isAdmin) {
                options.push({
                    icon: "fa fa-trash",
                    label: "member_delete",
                    action: this.handleDeleteMember(member, team.id)
                });
            }
            if (isMemberCurrentUser && allowedToLeave(team, currentUser)) {
                options.push({
                    icon: "fa fa-sign-out",
                    label: "member_leave",
                    action: this.handleLeaveTeam(member.id)
                });
            }
        }
        return options;
    };

    renderActions = (options, member, actions) => {
        const actionId = this.actionId(member);
        if (actions.id !== actionId || (actions.id === actionId && !actions.show) || isEmpty(options)) {
            return null;
        }
        return <DropDownActions options={options} i18nPrefix="team_detail.action_options"/>;
    };

    renderGroupsTable(userExternalTeams, teamExternalTeams) {
        return (
            <section><span>TODO .......{userExternalTeams.length}</span>
                <span>TODO .......{teamExternalTeams.length}</span>
            </section>
        );
    }

    renderMembersTable(currentUser, visibleMembers, actions, team) {
        const currentSorted = this.currentSorted();
        const sortColumnClassName = name => currentSorted.name === name ? "sorted" : "";
        const columns = ["name", "email", "status", "role", "actions"];
        const th = index => (
            <th key={index} className={columns[index]}>
                <span
                    className={sortColumnClassName(columns[index])}>{I18n.t(`team_detail.membership.${columns[index]}`)}</span>
            </th>
        );
        const tr = (member, index) => {
            const options = this.actionOptions(currentUser, member, team);
            return (
                <tr key={`${index}`} className={member.person.id === currentUser.person.id ? "me" : ""}>
                    <td data-label={I18n.t("team_detail.name")} className="name">
                        {member.person.name}
                    </td>
                    <td data-label={I18n.t("team_detail.email")} className="email">{member.person.email}</td>
                    <td data-label={I18n.t("team_detail.status")} className="status">
                        {this.statusOfMembership(member)}
                    </td>
                    <td data-label={I18n.t("team_detail.role")} className="role">
                        {this.roleCell(member)}
                    </td>
                    <td data-label={I18n.t("team_detail.actions_phone")} className="actions"
                        onClick={this.toggleActions(member, actions)}
                        tabIndex="1" /*onBlur={() => this.setState({actions: {show: false, id: ""}})}*/>
                        {!isEmpty(options) && <i className="fa fa-ellipsis-h"></i>}
                        {this.renderActions(options, member, actions)}
                    </td>
                </tr>
            );
        };

        if (visibleMembers.length !== 0) {

            return (
                <table className="members">
                    <thead>
                    <tr>{columns.map((column, index) => th(index))}</tr>
                    </thead>
                    <tbody>
                    {visibleMembers.map((member, index) => tr(member, index))}
                    </tbody>
                </table>
            );
        }
        return <div><em>{I18n.t("team_detail.no_found")}</em></div>;
    }

    render() {
        const {team, tab, actions, visibleMembers, sortAttributes, filterAttributes, loaded} = this.state;
        const {currentUser} = this.props;
        if (!loaded) {
            return null;
        }
        const role = currentUserRoleInTeam(team, currentUser);
        const mayInvite = role !== "MEMBER";

        return (
            <div className="team-detail">
                {this.teamDetailHeader(team, role, currentUser)}
                {this.teamDetailAttributes(team, role, currentUser)}
                {this.tabsAndIconLegend(team, tab)}
                <section className="card">
                    <section className="team-detail-controls">
                        <SortDropDown items={sortAttributes} sortBy={this.sort}/>
                        <FilterDropDown items={filterAttributes} filterBy={this.filter}/>
                        <section className="search">
                            <input placeholder={I18n.t("team_detail.search_members_placeholder")} type="text"
                                   onChange={this.search}/>
                            <i className="fa fa-search"></i>
                        </section>
                        {mayInvite &&
                        <a className="button green" href="#" onClick={this.handleInvite}>
                            {I18n.t("team_detail.add")}<i className="fa fa-plus"></i>
                        </a>}
                    </section>
                    {tab === "members" && this.renderMembersTable(currentUser, visibleMembers, actions, team)}
                    {tab === "groups" && this.renderGroupsTable(currentUser.externalTeams, team.externalTeams)}
                </section>
            </div>
        );
    }
}

TeamDetail.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};