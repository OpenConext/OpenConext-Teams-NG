import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import I18n from "i18n-js";
import CopyToClipboard from "react-copy-to-clipboard";

import {changeRole, deleteTeam, getTeamDetail, leaveTeam, saveTeam} from "../api";
import {handleServerError, setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";
import moment from "moment";
import SortDropDown from "../components/sort_drop_down";
import FilterDropDown from "../components/filter_drop_down";
import InlineEditable from "../components/inline_editable";
import CheckBox from "../components/checkbox";
import {
    allowedToLeave,
    currentUserRoleInTeam,
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
            filteredMembers: [],
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
            roleInTeam: ROLES.MEMBER.role
        };
        moment.locale(I18n.locale);
    }

    componentWillMount = () => getTeamDetail(this.props.match.params.id).then(team => this.stateTeam(team, true));

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

        if (displayOneAdminWarning && !allowedToLeave(team, this.props.currentUser)) {
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
            filteredMembers: sortedMembers,
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

    handleAcceptJoinRequest = team => e => {
        stop(e);
        //TODO - reload everything
        this.props.history.replace("/team/" + team.urn);
    };

    handleDeleteTeam = team => e => {
        stop(e);
        if (confirm(I18n.t("team_detail.confirmation", {name: team.name}))) {
            deleteTeam(team.id).then(() => {
                this.props.history.replace("/my-teams");
                setFlash(I18n.t("team_detail.deleted", {name: team.name}));
            });
        }
    };

    handleLeaveTeam = myMembershipId => e => {
        stop(e);
        const i18nHash = {name: this.state.team.name};
        if (confirm(I18n.t("team_detail.leave_confirmation", i18nHash))) {
            leaveTeam(myMembershipId).then(() => {
                this.props.history.replace("/my-teams");
                setFlash(I18n.t("team_detail.left", i18nHash));
            });
        }
    };

    handleInvite = () => this.props.history.replace(`/invite/${this.state.team.id}`);

    handleLinkExternalTeam = () => this.props.history.replace(`/external/${this.state.team.id}`);

    search = e => {
        const input = e.target.value;
        if (isEmpty(input)) {
            this.setState({filteredMembers: this.state.members});
        } else {
            this.setState({filteredMembers: this.filterMembers(input.toLowerCase())});
        }
    };

    filterMembers = input => this.state.members.filter(member =>
    member.person.name.toLowerCase().indexOf(input) > -1 ||
    member.person.email.toLowerCase().indexOf(input) > -1);


    filter = item => {
        const {filteredMembers, filterAttributes} = this.state;
        const newFilterAttributes = [...filterAttributes];
        newFilterAttributes.forEach(attr => {
            if (attr.name === item.name) {
                attr.selected = !attr.selected;
            }
        });
        const newFilteredMembers = filteredMembers.filter(member => newFilterAttributes.filter(attr => attr.name === member.filterAttribute)[0].selected);
        const currentSorted = this.currentSorted();
        const sortedMembers = [...newFilteredMembers.sort(this.sortByAttribute(currentSorted.name, item.order === "up"))];

        this.setState({filteredMembers: sortedMembers, filterAttributes: newFilterAttributes});
    };

    sort = item => {
        const {filteredMembers, sortAttributes} = this.state;
        const sortedMembers = filteredMembers.sort(this.sortByAttribute(item.name, item.current && item.order === "down"));
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
        this.setState({filteredMembers: sortedMembers, sortAttributes: newSortAttributes});
    };

    sortByAttribute = (name, reverse = false) => (a, b) => {
        if (name === "status") {
            return this.sortByStatus(a, b) * (reverse ? -1 : 1);
        }
        if (a[name]) {
            return a[name].toString().localeCompare(b[name].toString()) * (reverse ? -1 : 1);
        }
        if (a["person"][name]) {
            return a["person"][name].toString().localeCompare(b["person"][name].toString()) * (reverse ? -1 : 1);
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

    changeMembershipRole = member => role => {
        const {currentUser} = this.props;
        const downgrade = member.urnPerson === currentUser.urn;
        let confirmed = true;
        if (downgrade) {
            confirmed = confirm(I18n.t("team_detail.downgrade_current_user", {name: this.state.team.name}));
        }
        if (confirmed) {
            changeRole({id: member.id, role: role.value})
                .then(membership => {
                    const team = {...this.state.team};
                    team.memberships.filter(m => m.id === membership.id)[0].role = membership.role;
                    this.stateTeam(team, true);
                    setFlash(I18n.t("team_detail.role_changed", {
                        name: membership.person.name,
                        role: labelForRole(membership.role)
                    }));
                })
                .catch(err => handleServerError(err));
        }
    };

    copiedToClipboard = () => {
        this.setState({copiedToClipboard: true});
        setTimeout(() => this.setState({copiedToClipboard: false}), 5000);
    };

    teamDetailHeader(team, role, currentUser) {
        const myMembershipId =
            team.memberships.filter(membership => membership.urnPerson === currentUser.urn).map(membership => membership.id)[0];
        const mayLeave = allowedToLeave(team, currentUser);
        return (
            <section className="team-header">
                <Link className="back" to="/my-teams"><i className="fa fa-arrow-left"></i>
                    {I18n.t("team_detail.back")}
                </Link>
                <div className="actions">
                    <h2>{team.name}</h2>
                    {mayLeave && <a className="button" href="#"
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

    currentSorted = () => this.state.sortAttributes.filter(attr => attr.current)[0];

    statusOfMembership = member => {
        if (member.isMembership) {
            return moment.unix(member.created).format("LLL");
        } else if (member.isJoinRequest) {
            const toolTipId = `join_request_tooltip_${member.id}`;
            const label = labelForRole(ROLES.JOIN_REQUEST.role);
            return (
                <span data-for={toolTipId} data-tip>
                {label}
                    <i className="fa fa-info-circle"></i>
                <ReactTooltip id={toolTipId} type="light" class="tool-tip" effect="solid">
                    <span className="label">{label}</span>
                    <span className="label">{I18n.t("teams.created")}<span
                        className="value">{moment.unix(member.created).format("LLL")}</span></span>
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
                <span data-for={toolTipId} data-tip>
                {label}
                    <i className="fa fa-info-circle"></i>
                <ReactTooltip id={toolTipId} type="light" class="tool-tip" effect="solid">
                    <span className="label">{label}</span>
                    <span className="label">{I18n.t("teams.created")}<span
                        className="value">{moment(latestMessage.timestamp).format("LLL")}</span></span>
                    <span className="label">{I18n.t("teams.message")}</span>
                    <span>{latestMessage.message}</span>
                </ReactTooltip>
                </span>
            );
        }
        throw new Error(`Unknown kind of member ${JSON.stringify(member)}`);
    };

    userIconClassName = (member, currentUser) => {
        const userIcon = iconForRole(member.role);
        return member.person.id !== currentUser.person.id ? `${userIcon} me` : userIcon;
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

    renderMembersTable(currentUser, filteredMembers) {
        const currentSorted = this.currentSorted();
        const sortColumnClassName = name => currentSorted.name === name ? "sorted" : "";
        const columns = ["name", "email", "status", "role", "actions"];
        const th = index => (
            <th key={index} className={columns[index]}>
                <span
                    className={sortColumnClassName(columns[index])}>{I18n.t(`team_detail.membership.${columns[index]}`)}</span>
            </th>
        );

        if (filteredMembers.length !== 0) {
            return (
                <table className="members">
                    <thead>
                    <tr>{columns.map((column, index) => th(index))}</tr>
                    </thead>
                    <tbody>
                    {filteredMembers.map((member, index) =>
                        <tr key={`${index}`}>
                            <td className={member.isJoinRequest ? "join_request" : member.isInvitation ? "invitation" : "membership"}>
                                <i className={this.userIconClassName(member, currentUser)}></i>
                                {member.person.name}
                            </td>
                            <td className="email">{member.person.email}</td>
                            <td className="status">{this.statusOfMembership(member)}</td>
                            <td className="role">
                                {this.roleCell(member)}
                            </td>
                            <td className="actions"><i className="fa fa-ellipsis-h"></i></td>
                        </tr>
                    )}
                    </tbody>
                </table>
            );
        }
        return <div><em>{I18n.t("team_detail.no_found")}</em></div>;
    }

    render() {
        const {team, filteredMembers, sortAttributes, filterAttributes, loaded} = this.state;
        const {currentUser} = this.props;
        if (!loaded) {
            return null;
        }
        const role = currentUserRoleInTeam(team, currentUser);
        const joinRequests = team.joinRequests || [];
        const hasExternalTeams = !isEmpty(currentUser.externalTeams);
        const mayInvite = role !== "MEMBER";

        return (
            <div className="team-detail">
                {this.teamDetailHeader(team, role, currentUser)}
                {this.teamDetailAttributes(team, role, currentUser)}
                <h2 className="members">{`${I18n.t("team_detail.team_members")} (${team.memberships.length + joinRequests.length})`}</h2>
                <section className="card">
                    <section className="team-detail-controls">
                        <SortDropDown items={sortAttributes} sortBy={this.sort}/>
                        <FilterDropDown items={filterAttributes} filterBy={this.filter}/>
                        <section className="search">
                            <input placeholder={I18n.t("team_detail.search_members_placeholder")} type="text"
                                   onChange={this.search}/>
                            <i className="fa fa-search"></i>
                        </section>
                        {(mayInvite || hasExternalTeams) &&
                        <a className="button green" href="#" onClick={() => 1}>
                            {I18n.t("team_detail.add")}<i className="fa fa-plus"></i>
                        </a>}
                    </section>
                    {this.renderMembersTable(currentUser, filteredMembers)}
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