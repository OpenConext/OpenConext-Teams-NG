import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import I18n from "i18n-js";
import CopyToClipboard from "react-copy-to-clipboard";
import moment from "moment";

import {
    approveJoinRequest,
    changeRole,
    deleteInvitation,
    deleteMember,
    deleteTeam,
    delinkExternalTeam,
    getTeamDetail,
    leaveTeam,
    linkExternalTeam,
    rejectJoinRequest,
    resetPublicLink,
    saveTeam,
    teamIdFromUrn
} from "../api";
import {setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";

import LinkedInstitutionTeams from "../components/linked_institution_teams";
import ConfirmationDialog from "../components/confirmation_dialog";
import SortDropDown from "../components/sort_drop_down";
import FilterDropDown from "../components/filter_drop_down";
import DropDownActions from "../components/drop_down_actions";
import InlineEditable from "../components/inline_editable";
import CheckBox from "../components/checkbox";
import RolesIconLegend from "../components/roles_icon_legend";
import TeamsIconLegend from "../components/teams_icon_legend";

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
import TeamsDetailsLegend from "../components/teams_details_legend";

export default class TeamDetail extends React.PureComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {
            team: {},
            members: [],
            owners: [],
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
            copiedToClipboardPublicLink: false,
            isOnlyAdmin: false,
            roleInTeam: ROLES.MEMBER.role,
            searchQuery: "",
            tab: "details",
            confirmationDialogOpen: false,
            confirmationDialogQuestion: "",
            confirmationDialogAction: () => false
        };
    }

    handleNotFound = err => {
        if (err.response && err.response.status === 404) {
            this.props.history.push("/404");
        } else {
            throw err;
        }
    };

    componentWillMount = () => {
        const params = this.props.match.params;
        if (params.id) {
            this.refreshTeamState(params.id);
        } else if (params.name) {
            teamIdFromUrn(params.name)
                .then(id => this.refreshTeamState(id))
                .catch(this.handleNotFound);
        } else {
            this.props.history.push("/404/");
        }

    };


    refreshTeamState = (teamId, callback = () => 1, displayOneAdminWarning = true) =>
        getTeamDetail(teamId, false)
            .then(team => {
                this.stateTeam(team, displayOneAdminWarning);
                callback();
            })
            .catch(this.handleNotFound);

    stateTeam(team, displayOneAdminWarning) {
        //prevent url guessing
        if (isEmpty(team.memberships)) {
            this.props.history.push(`/join-requests/${team.id}`);
            return;
        }

        const joinRequests = (team.joinRequests || []).map(joinRequest => {
            return {
                ...joinRequest,
                role: ROLES.MEMBER.role, isJoinRequest: true,
                name: joinRequest.person.name, email: joinRequest.person.email,
                filterAttribute: ROLES.JOIN_REQUEST.role, order: 1
            };
        });

        const invitations = (team.invitations || [])
            .filter(invitation => !invitation.accepted)
            .map(invitation => {
                return {
                    ...invitation,
                    role: invitation.intendedRole, isInvitation: true, person: {name: "", email: invitation.email},
                    filterAttribute: ROLES.INVITATION.role, order: 2
                };
            });

        const members = team.memberships
            .filter(member => member.role !== ROLES.OWNER.role)
            .map(member => ({...member, isMembership: true, filterAttribute: member.role, order: 3}))
            .concat(joinRequests).concat(invitations);

        const owners = team.memberships
            .filter(member => member.role === ROLES.OWNER.role)
            .map(member => ({...member, isMembership: true, filterAttribute: member.role, order: 3}));

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
            owners: owners,
            visibleMembers: sortedMembers,
            filterAttributes: newFilterAttributes.filter(attr => attr.count > 0),
            loaded: true,
            isOnlyAdmin: isOnlyAdmin(team, currentUser),
            roleInTeam: currentUserRoleInTeam(team, currentUser)
        });

    }

    confirmation = (question, action) => this.setState({
        confirmationDialogOpen: true,
        confirmationDialogQuestion: question,
        confirmationDialogAction: () => {
            this.cancelConfirmation();
            action();
        }
    });

    cancelConfirmation = () => this.setState({confirmationDialogOpen: false});

    handleDeleteTeam = team => e => {
        stop(e);
        this.confirmation(I18n.t("team_detail.confirmations.delete_team", {name: team.name}), () => {
            deleteTeam(team.id).then(() => {
                this.props.history.replace("/my-teams");
                setFlash(I18n.t("team_detail.flash.deleted", {name: team.name}));
            });
        });
    };

    handleResetPublicLink = team => e => {
        stop(e);
        this.confirmation(I18n.t("team_detail.public_link_reset_confirmation"), () => {
            resetPublicLink(team.id).then(updatedTeam => {
                this.stateTeam(updatedTeam, false);
            });
        });
    };

    handleLeaveTeam = myMembershipId => e => {
        stop(e);
        const i18nHash = {name: this.state.team.name};
        this.confirmation(I18n.t("team_detail.confirmations.leave_team", i18nHash), () => {
            leaveTeam(myMembershipId).then(() => {
                this.props.history.replace("/my-teams");
                setFlash(I18n.t("team_detail.flash.left", i18nHash));
            });
        });
    };

    handleInvite = () => this.props.history.replace(`/invite/${this.state.team.id}`);

    handleDeleteInvitation = invitation => e => {
        stop(e);
        const i18nHash = {name: invitation.email};
        this.confirmation(I18n.t("team_detail.confirmations.delete_invitation", i18nHash), () =>
            deleteInvitation(invitation.id).then(() =>
                this.refreshTeamState(this.state.team.id, () => setFlash(I18n.t("team_detail.flash.deleted_invitation", i18nHash))))
        );
    };

    handleAcceptJoinRequest = member => e => {
        stop(e);
        const i18nHash = {name: member.name};
        this.confirmation(I18n.t("team_detail.confirmations.accept_join_request", i18nHash), () =>
            approveJoinRequest(member.id).then(() =>
                this.refreshTeamState(this.state.team.id, () => setFlash(I18n.t("team_detail.flash.accepted_join_request", i18nHash))))
        );
    };

    handleRejectJoinRequest = member => e => {
        stop(e);
        const i18nHash = {name: member.name};
        this.confirmation(I18n.t("team_detail.confirmations.reject_join_request", i18nHash), () =>
            rejectJoinRequest(member.id).then(() =>
                this.refreshTeamState(this.state.team.id, () => setFlash(I18n.t("team_detail.flash.rejected_join_request", i18nHash))))
        );
    };

    institutionTeamLinked = (institutionTeam, value) => {
        const teamId = this.state.team.id;
        const identifier = institutionTeam.identifier;
        const promise = value ? linkExternalTeam(teamId, identifier) : delinkExternalTeam(teamId, identifier);
        return promise.then(team => {
            this.stateTeam(team, false);
            const message = I18n.t(`team_detail.flash.${value ? "linked_institutional_team" : "unlinked_institutional_team"}`,
                {team: institutionTeam.name, name: team.name});
            setFlash(message);
        });
    };

    handleDeleteMember = (member, teamId) => e => {
        stop(e);
        const i18nHash = {name: member.person.name};
        this.confirmation(I18n.t("team_detail.confirmations.delete_member", i18nHash), () =>
            deleteMember(member.id).then(() =>
                this.refreshTeamState(teamId, () => setFlash(I18n.t("team_detail.flash.deleted_member", i18nHash))))
        );
    };

    changeMembershipRole = member => role => {
        const {currentUser} = this.props;
        const {name, id} = this.state.team;
        const i18nHash = {name: member.person.name, role: labelForRole(role.value)};
        const currentRole = currentUserRoleInTeam(this.state.team, currentUser);
        const action = () => changeRole({id: member.id, role: role.value}).then(() =>
            this.refreshTeamState(id, () => setFlash(I18n.t("team_detail.flash.role_changed", i18nHash))));
        const currentRoleLocal = I18n.t(`icon_legend.${currentRole.toLowerCase()}`);
        if (member.urnPerson === currentUser.urn) {
            const msg = (role.value === ROLES.OWNER.role || role.value === ROLES.ADMIN.role) ?
                "team_detail.confirmations.equalgrade_current_user" : "team_detail.confirmations.downgrade_current_user";
            this.confirmation(I18n.t(msg,
                {role: currentRoleLocal, name: name}), action);
        } else {
            action();
        }
    };

    saveTeamProperties = changedAttribute => {
        const {team} = this.state;
        const teamProperties = {
            id: team.id,
            description: team.description,
            personalNote: team.personalNote,
            viewable: team.viewable,
            publicLinkDisabled: team.publicLinkDisabled
        };
        saveTeam({...teamProperties, ...changedAttribute})
            .then(team => {
                this.stateTeam(team, false);
                setFlash(I18n.t("teams.flash.team", {name: team.name, action: I18n.t("teams.flash.updated")}));
            });
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

    sortByStatus = (member, otherMember) => {
        if (member.isMembership && otherMember.isMembership) {
            return member.created > otherMember.created ? 1 : member.created === otherMember.created ? 0 : -1;
        }
        return member.order > otherMember.order ? 1 : member.order === otherMember.order ? 0 : -1;
    };

    isNotNull = attr => attr !== undefined && attr !== null;

    sortByAttribute = (name, reverse = false) => (a, b) => {
        if (name === "status") {
            return this.sortByStatus(a, b) * (reverse ? -1 : 1);
        }
        if (this.isNotNull(a["person"][name]) && this.isNotNull(b["person"][name])) {
            return a["person"][name].toString().localeCompare(b["person"][name].toString()) * (reverse ? -1 : 1);
        }
        if (a[name] || b[name]) {
            const aNameSafe = a[name] ? a[name].toString() : "";
            const bNameSafe = b[name] ? b[name].toString() : "";
            return aNameSafe.localeCompare(bNameSafe) * (reverse ? -1 : 1);
        }
        const aSafe = a || "";
        const bSafe = b || "";
        return aSafe.toString().localeCompare(bSafe.toString()) * (reverse ? -1 : 1);
    };

    changePersonalNote = personalNote => {
        this.saveTeamProperties({personalNote: personalNote});
    };

    changeDescription = description => {
        this.saveTeamProperties({description: description});
    };

    changeViewable = e => {
        const newTeamProperties = {viewable: !this.state.team.viewable};
        if (!e.target.checked) {
            newTeamProperties.publicLinkDisabled = true;
        }
        this.saveTeamProperties(newTeamProperties);
    };

    changePublicLinkDisabled = e => {
        const newTeamProperties = {publicLinkDisabled: !this.state.team.publicLinkDisabled};
        if (e.target.checked) {
            newTeamProperties.viewable = true;
        }
        this.saveTeamProperties(newTeamProperties);
    };

    copiedToClipboard = () => {
        this.setState({copiedToClipboard: true});
        setTimeout(() => this.setState({copiedToClipboard: false}), 5000);
    };

    copiedToClipboardPublicLink = () => {
        this.setState({copiedToClipboardPublicLink: true});
        setTimeout(() => this.setState({copiedToClipboardPublicLink: false}), 5000);
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
                    {(role === ROLES.ADMIN.role || role === ROLES.OWNER.role) &&
                    <a className="button" href="#"
                       onClick={this.handleDeleteTeam(team)}>{I18n.t("team_detail.delete")}
                        <i className="fa fa-trash"></i>
                    </a>}
                </div>
            </section>
        );
    }

    teamDetailAttributes(team, role, currentUser, owners, actions) {
        const isAdmin = (role === ROLES.ADMIN.role || role === ROLES.OWNER.role);
        const {copiedToClipboard, copiedToClipboardPublicLink} = this.state;
        const copiedToClipBoardClassName = copiedToClipboard ? "copied" : "";
        const copiedToClipBoardPublicLinkClassName = copiedToClipboardPublicLink ? "copied" : "";
        const tooltip = I18n.t(copiedToClipboard ? "team_detail.copied" : "team_detail.copy");
        const tooltipPublicLink = I18n.t(copiedToClipboardPublicLink ? "team_detail.copied" : "team_detail.copy");

        const universalUrn = `${currentUser.groupNameContext}${team.urn}`;
        const location = window.location;
        const universalPublicLink = `${location.protocol}//${location.hostname}${location.port ? ":" + location.port : ""}/public/${team.publicLink}`;
        return (
            <section className="team-attributes">
                <InlineEditable name="team_detail.description" mayEdit={isAdmin} value={team.description || ""}
                                onChange={this.changeDescription}/>
                {isAdmin &&
                <InlineEditable name="team_detail.personalNote" mayEdit={isAdmin} value={team.personalNote || ""}
                                onChange={this.changePersonalNote}/>}
                <div className="team-attribute">
                    <label className="title">{I18n.t("team_detail.urn")}</label>
                    <CopyToClipboard text={universalUrn} onCopy={this.copiedToClipboard}>
                        <span className="attribute">{universalUrn}
                            <a data-for="copy-to-clipboard" data-tip>
                                <i className={`fa fa-clone ${copiedToClipBoardClassName}`}></i>
                            </a>
                            <ReactTooltip id="copy-to-clipboard" place="right" getContent={[() => tooltip, 500]}/>
                        </span>
                    </CopyToClipboard>
                </div>
                <div className="team-attribute">
                    <label className="title info-after" htmlFor="viewable">{I18n.t("team_detail.viewable")}</label>
                </div>
                <CheckBox name="viewable" value={team.viewable} readOnly={!isAdmin}
                          info={I18n.t("team_detail.viewable_info")} onChange={this.changeViewable}/>
                <div className="separator"/>
                {(isAdmin || currentUser.superAdminModus) && <div className="team-attribute">
                    <label className="title info-after">{I18n.t("team_detail.public_link")}</label>
                    <CheckBox name="publicLinkDisable" value={!team.publicLinkDisabled} readOnly={!isAdmin}
                              info={I18n.t("team_detail.public_link_disabled")}
                              onChange={this.changePublicLinkDisabled}/>

                    {!team.publicLinkDisabled &&
                    <CopyToClipboard text={universalPublicLink} onCopy={this.copiedToClipboardPublicLink}>
                        <span className="attribute">{universalPublicLink}
                            <a onClick={this.handleResetPublicLink(team)} data-for="public-link-reset" data-tip>
                                <i className="fa fa-refresh"></i>
                            </a>
                            <ReactTooltip id="public-link-reset" place="right">
                                {I18n.t("team_detail.public_link_reset")}
                            </ReactTooltip>
                            <a data-for={universalPublicLink} data-tip>
                                <i className={`fa fa-clone ${copiedToClipBoardPublicLinkClassName}`}></i>
                            </a>
                            <ReactTooltip id={universalPublicLink} place="right"
                                          getContent={[() => tooltipPublicLink, 500]}/>
                        </span>
                    </CopyToClipboard>}
                    {team.publicLinkDisabled &&
                    <span className="attribute disabled">{universalPublicLink}
                        </span>}
                    <div>
                        <label className="title">{I18n.t("team_detail.owners")}</label>
                        {this.renderMembersTable(currentUser, owners, actions, team, role, false)}
                    </div>
                </div>}

            </section>
        );
    }

    renderTabs = (tab, team) => {
        return (
            <div className="members-tab">
               <span className={tab === "details" ? "active" : ""} onClick={() => this.setState({tab: "details"})}>
                        {I18n.t("team_detail.team_details")}
               </span>
                <span className={tab === "members" ? "active" : ""} onClick={() => this.setState({tab: "members"})}>
                        {I18n.t("team_detail.team_members", {count: team.memberships.filter(m => m.role !== ROLES.OWNER.role).length})}
               </span>
                <span className={tab === "groups" ? "active" : ""} onClick={() => this.setState({tab: "groups"})}>
                        {I18n.t("team_detail.team_groups", {count: (team.externalTeams || []).length})}
                </span>
            </div>
        );
    };

    tabsAndIconLegend = (team, tab) => {
        switch (tab) {
            case "details":
                return (
                    <TeamsDetailsLegend>
                        {this.renderTabs(tab, team)}
                    </TeamsDetailsLegend>
                );
            case "members":
                return (
                    <RolesIconLegend includeInvitation={true} includeOwner={false}>
                        {this.renderTabs(tab, team)}
                    </RolesIconLegend>
                );
            case "groups":
                return (
                    <TeamsIconLegend currentUser={this.props.currentUser}>
                        {this.renderTabs(tab, team)}
                    </TeamsIconLegend>
                );
            default:
                throw new Error(`Unknown tab ${tab}`);
        }
    };

    currentSorted = () => this.state.sortAttributes.filter(attr => attr.current)[0];

    statusOfMembership = (member, isMember) => {
        if (member.isMembership && isMember) {
            return moment.unix(member.created).format("LLL");
        } else if (member.isMembership && !isMember) {
            const toolTipId = `member_tooltip_${member.id}`;
            const origin = member.origin ? I18n.t(`team_detail.membership.origin.${member.origin.toLowerCase()}`) :
                I18n.t("team_detail.membership.origin.unknown");
            const approvedBy = member.approvedBy || I18n.t("team_detail.membership.origin.unknown");
            const approvedByLabel = member.origin ? I18n.t(`team_detail.membership.origin.${member.origin.toLowerCase()}_label`) :
                I18n.t("team_detail.membership.origin.join_request_accepted_label");
            return <span className="membership" data-for={toolTipId} data-tip>
                {moment.unix(member.created).format("LLL")}
                {member.id && <i className="fa fa-info-circle"></i>}
                {member.id &&
                <ReactTooltip id={toolTipId} type="light" class="tool-tip" effect="solid">
                    <div className="inner-tooltip">
                        <span className="label">{I18n.t("team_detail.membership.origin.name")}</span>
                        <span className="value">{origin}</span>
                        <span className="label">{approvedByLabel}</span>
                        <span className="value">{approvedBy}</span>
                    </div>
                </ReactTooltip>}
            </span>;
        } else if (member.isJoinRequest) {
            const toolTipId = `join_request_tooltip_${member.id}`;
            const label = labelForRole(ROLES.JOIN_REQUEST.role);
            return (
                <span className="join-request" data-for={toolTipId} data-tip>
                <i className={iconForRole(ROLES.JOIN_REQUEST.role)}></i>{label}
                    <i className="fa fa-info-circle"></i>
                <ReactTooltip id={toolTipId} type="light" class="tool-tip" effect="solid">
                    <div className="inner-tooltip">
                        <span className="label">{label}</span>
                        <span className="label">{I18n.t("teams.created")}</span>
                        <span className="value">{moment.unix(member.created).format("LLL")}</span>
                        <span className="label">{I18n.t("team_detail.email")}</span>
                        <span className="value">{member.person.email}</span>
                        <span className="label">{I18n.t("teams.message")}</span>
                        <span>{member.message}</span>
                    </div>
                </ReactTooltip>
                </span>
            );
        } else if (member.isInvitation) {
            const label = labelForRole(ROLES.INVITATION.role);
            const toolTipId = `invitation_${member.id}`;
            const latestMessage = member.invitationMessages.sort((m1, m2) => m1.id < m2.id ? 1 : -1)[0]
                || {message: "", timestamp: new Date().getTime()};
            const className = member.declined ? "declined" : "";
            return (
                <span className={`invitation ${className}`} data-for={toolTipId} data-tip>
                    <i className={`${iconForRole(ROLES.INVITATION.role)} ${className}`}></i>
                    {label}
                    <i className="fa fa-info-circle"></i>
                <ReactTooltip id={toolTipId} type="light" class="tool-tip" effect="solid">
                    <div className="inner-tooltip">
                        <span className="label">{label}</span>
                        {member.declined && <span className="label">{I18n.t("invitation.denied")}</span>}
                        <span className="label">{I18n.t("teams.created")}</span>
                        <span className="value">{moment(latestMessage.timestamp).format("LLL")}</span>
                        <span className="label">{I18n.t("team_detail.intended_role")}</span>
                        <span className="value">{member.intendedRole}</span>
                        <span className="label">{I18n.t("team_detail.email")}</span>
                        <span className="value">{member.person.email}</span>
                        <span className="label">{I18n.t("teams.message")}</span>
                        <span>{latestMessage.message}</span>
                    </div>
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
        const isMemberCurrentUser = member.urnPerson === currentUser.urn;
        const currentRole = currentUserRoleInTeam(team, currentUser);
        const isMember = currentRole === ROLES.MEMBER.role || currentRole === ROLES.SUPER_ADMIN.role;
        const isAdmin = currentRole === ROLES.ADMIN.role || currentRole === ROLES.OWNER.role;
        const isManager = currentRole === ROLES.MANAGER.role;

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
            if (!isMemberCurrentUser && (isAdmin || (isManager && member.role === ROLES.MEMBER.role))) {
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

    renderMembersTable(currentUser, visibleMembers, actions, team, role, displayHeaders = true) {
        const currentSorted = this.currentSorted();
        const sortColumnClassName = name => currentSorted.name === name ? "sorted" : "";
        const columns = ["name", "email", "status", "expiry_date", "role", "actions"];
        const isMember = role === ROLES.MEMBER.role || role === ROLES.SUPER_ADMIN.role;

        if (!this.props.currentUser.featureToggles["EXPIRY_DATE_MEMBERSHIP"]) {
            columns.splice(3, 1);
        }

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
                    <td data-label={I18n.t("team_detail.name")} className="name" data-for={member.person.urn} data-tip>
            <span className="person-name">
            {member.person.name}
            </span>
                        {!isEmpty(member.person.name) &&
                        <ReactTooltip id={member.person.urn} class="tool-tip" effect="solid">
                            <span className="person-urn">{member.person.urn}</span>
                        </ReactTooltip>}
                    </td>
                    <td data-label={I18n.t("team_detail.email")} className="email">
                        <a href={`mailto:${member.person.email}`}>{member.person.email}</a>
                    </td>
                    <td data-label={I18n.t("team_detail.status")} className="status">
                        {this.statusOfMembership(member, isMember)}
                    </td>
                    {this.props.currentUser.featureToggles["EXPIRY_DATE_MEMBERSHIP"] &&
                    <td data-label={I18n.t("team_detail.expiry_date")} className="expiry_date">
                        {member.expiryDate ? moment.unix(member.expiryDate).format("LLL") : ""}
                    </td>}
                    <td data-label={I18n.t("team_detail.role")} className="role">
                        {this.roleCell(member)}
                    </td>
                    <td data-label={I18n.t("team_detail.actions_phone")} className="actions"
                        onClick={this.toggleActions(member, actions)}
                        tabIndex="1"
                        onBlur={() => setTimeout(() => this.setState({actions: {show: false, id: ""}}), 350)}>
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
                    {displayHeaders && <tr>{columns.map((column, index) => th(index))}</tr>}
                    </thead>
                    <tbody>
                    {visibleMembers.map((member, index) => tr(member, index))}
                    </tbody>
                </table>
            );
        }
        const msg = displayHeaders ? "team_detail.no_found" : "team_detail.no_found_owners";
        return <div><em>{I18n.t(msg)}</em></div>;
    }

    teamMembers = (sortAttributes, filterAttributes, mayInvite, currentUser, visibleMembers, actions, team, role) => {
        return <section className="card">
            <section className="team-detail-controls">
                <SortDropDown items={sortAttributes} sortBy={this.sort}/>
                <FilterDropDown items={filterAttributes} filterBy={this.filter}/>
                <section className="search">
                    <input className={mayInvite ? "allowed" : ""}
                           placeholder={I18n.t("team_detail.search_members_placeholder")}
                           type="text"
                           onChange={this.search}/>
                    <i className="fa fa-search"></i>
                </section>
                {mayInvite &&
                <a className="button green" href="#" onClick={this.handleInvite}>
                    {I18n.t("team_detail.add")}<i className="fa fa-plus"></i>
                </a>}
            </section>
            {this.renderMembersTable(currentUser, visibleMembers, actions, team, role)}
        </section>;
    };

    render() {
        const {
            team, tab, actions, visibleMembers, sortAttributes, filterAttributes, loaded,
            confirmationDialogOpen, confirmationDialogAction, confirmationDialogQuestion, owners
        } = this.state;
        const {currentUser} = this.props;
        if (!loaded) {
            return null;
        }
        const role = currentUserRoleInTeam(team, currentUser);
        const mayInvite = role !== "MEMBER" && role !== "SUPER_ADMIN";

        return (
            <div className="team-detail">
                <ConfirmationDialog isOpen={confirmationDialogOpen}
                                    cancel={this.cancelConfirmation}
                                    confirm={confirmationDialogAction}
                                    question={confirmationDialogQuestion}/>
                {this.teamDetailHeader(team, role, currentUser)}
                {this.tabsAndIconLegend(team, tab)}
                {tab === "details" && this.teamDetailAttributes(team, role, currentUser, owners, actions)}
                {tab === "members" && this.teamMembers(sortAttributes, filterAttributes, mayInvite, currentUser, visibleMembers, actions, team, role)}
                {tab === "groups" &&
                <LinkedInstitutionTeams currentUser={currentUser}
                                        institutionTeams={currentUser.externalTeams}
                                        team={team}
                                        institutionTeamLinked={this.institutionTeamLinked}/>}
            </div>
        );
    }
}

TeamDetail.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};