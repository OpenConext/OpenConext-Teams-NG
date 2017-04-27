import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import I18n from "i18n-js";
import CopyToClipboard from "react-copy-to-clipboard";
import {deleteTeam, getTeamDetail, leaveTeam, saveTeam} from "../api";
import {setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";
import moment from "moment";
import SortDropDown from "../components/sort_drop_down";
import InlineEditable from "../components/inline_editable";
import CheckBox from "../components/checkbox";
import {allowedToLeave, currentUserRoleInTeam, roleOfMembership} from "../validations/memberships";

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
            loaded: false,
            copiedToClipboard: false
        };
        moment.locale(I18n.locale);
    }

    componentWillMount = () => getTeamDetail(this.props.match.params.id).then(team => this.stateTeam(team));

    stateTeam(team) {
        //TODO add invites pending
        const joinRequests = team.joinRequests || [];
        const members = team.memberships.concat(joinRequests);
        if (!this.state.loaded && !allowedToLeave(team, this.props.currentUser)) {
            setFlash(I18n.t("team_detail.one_admin_warning"), "warning");
        }
        const currentSorted = this.currentSorted();
        const sortedMembers = [...members].sort(this.sortByAttribute(currentSorted.name, currentSorted.order === "up"));

        this.setState({
            team: team,
            members: members,
            filteredMembers:  sortedMembers,
            loaded: true
        });

    }

    sortByStatus = (member, otherMember) => {
        const isJoinRequestMember = !member.role;
        const isJoinRequestOtherMember = !otherMember.role;
        if ((isJoinRequestMember && isJoinRequestOtherMember) ||
            (!isJoinRequestMember && !isJoinRequestOtherMember)) {
            return member.created > otherMember.created ? 1 : member.created === otherMember.created ? 0 : -1;
        }
        return isJoinRequestMember ? -1 : 1;
    };

    handleAcceptJoinRequest = team => e => {
        stop(e);
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
        if (name === "role") {
            return roleOfMembership(a).localeCompare(roleOfMembership(b)) * (reverse ? -1 : 1);
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
                this.stateTeam(team);
                setFlash(I18n.t("teams.flash", {name: team.name, action: I18n.t("teams.flash_updated")}));
            })
            .catch(err => {
                err.response.json().then(this.handleError);
            });
    };

    handleError = json => {
        //console.log(json);
        return json ? true : false;
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
                    {role === "ADMIN" && <a className="button" href="#"
                                            onClick={this.handleDeleteTeam(team)}>{I18n.t("team_detail.delete")}
                        <i className="fa fa-trash"></i>
                    </a>}
                </div>
            </section>
        );
    }

    teamDetailAttributes(team, role, currentUser) {
        const isAdmin = role === "ADMIN";
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
                                <i className={`fa fa-copy ${copiedToClipBoardClassName}`}></i>
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

    statusOfMembership = member => member.role ? moment(member.created).format("LLL") :
        <span className="status-pending"><i className="fa fa-clock-o"></i>{I18n.t("team_detail.pending")}</span>;

    renderMembersTable(currentUser) {
        const currentSorted = this.currentSorted();
        const sortColumnClassName = name => currentSorted.name === name ? "sorted" : "";
        const userIconClassName = member => member.role ? (member.person.id !== currentUser.person.id ? `fa fa-user-o ${member.role.toLowerCase()}` : `fa fa-user ${member.role.toLowerCase()}`)
            : "fa fa-clock-o";
        const columns = ["name", "email", "status", "role", "actions"];
        const th = index => (
            <th key={index} className={columns[index]}>
                <span
                    className={sortColumnClassName(columns[index])}>{I18n.t(`team_detail.membership.${columns[index]}`)}</span>
            </th>
        );

        if (this.state.filteredMembers.length !== 0) {
            return (
                <table className="members">
                    <thead>
                    <tr>{columns.map((column, index) => th(index))}</tr>
                    </thead>
                    <tbody>
                    {this.state.filteredMembers.map((member, index) =>
                        <tr key={`${member.urnPerson}-${index}`}
                            className={member.role ? "" : "pending"}>
                            <td className={member.role ? "name" : "name pending"}>
                                <i className={userIconClassName(member)}></i>
                                {member.person.name}
                            </td>
                            <td className="email">{member.person.email}</td>
                            <td className="status">{this.statusOfMembership(member)}</td>
                            <td className="role">{roleOfMembership(member)}</td>
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
        const {team, sortAttributes, loaded} = this.state;
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
                        <div className="search">
                            <input placeholder={I18n.t("team_detail.search_members_placeholder")} type="text"
                                   onChange={this.search}/>
                            <i className="fa fa-search"></i>
                        </div>
                        {mayInvite && <a className="button blue" href="#"
                                         onClick={this.handleInvite}>{I18n.t("team_detail.invite")}
                            <i className="fa fa-user"></i>
                        </a>}
                        {hasExternalTeams && <a className="button blue" href="#"
                                                onClick={this.handleLinkExternalTeam}>{I18n.t("team_detail.link_to_institution_team")}
                            <i className="fa fa-users"></i>
                        </a>}
                    </section>
                    {this.renderMembersTable(currentUser)}
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