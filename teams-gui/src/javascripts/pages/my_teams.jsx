import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import debounce from "lodash/debounce";
import moment from "moment";

import SortDropDown from "../components/sort_drop_down";
import FilterDropDown from "../components/filter_drop_down";
import IconLegend from "../components/icon_legend";
import TeamAutocomplete from "../components/team_autocomplete";
import {autoCompleteTeam, deleteTeam, getMyTeams, deleteJoinRequest} from "../api";
import {clearFlash, setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";

const JOIN_REQUESTS_ROLE = "JOIN REQUEST";

export default class MyTeams extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isMemberOfTeam: false,
            teams: [],
            filteredTeams: [],
            joinRequests: [],
            invitationsSend: [],
            sorted: {name: "name", order: "down"},
            actions: {show: false, id: ""},
            sortAttributes: [
                {name: "name", order: "down", current: true},
                {name: "description", order: "down", current: false},
                {name: "role", order: "down", current: false},
                {name: "membershipCount", order: "down", current: false}
            ],
            filterAttributes: [
                {name: "ADMIN", selected: true, count: 0},
                {name: "MANAGER", selected: true, count: 0},
                {name: "MEMBER", selected: true, count: 0},
                {name: JOIN_REQUESTS_ROLE, selected: true, count: 0}
            ],
            selectedTeam: -1,
            suggestions: [],
            query: ""

        };
        moment.locale(I18n.locale);
    }

    fetchMyTeams() {
        clearFlash();
        getMyTeams().then(myTeams => {
            const joinRequests = myTeams.myJoinRequests.map(joinRequest => {
                return {
                    name: joinRequest.teamName, description: joinRequest.teamDescription,
                    role: JOIN_REQUESTS_ROLE, isJoinRequest: true, membershipCount: "",
                    created: joinRequest.joinRequest.created, message: joinRequest.joinRequest.message,
                    id: joinRequest.joinRequest.id, teamId: joinRequest.teamId
                };
            });
            const teams = myTeams.teamSummaries.concat(joinRequests).sort(this.sortByAttribute("name"));
            const newFilterAttributes = [...this.state.filterAttributes];
            newFilterAttributes.forEach(attr => attr.count = teams.filter(team => team.role === attr.name).length);
            this.setState({
                isMemberOfTeam: teams.length > 0,
                teams: teams,
                filteredTeams: [...teams],
                joinRequests: joinRequests,
                filterAttributes: newFilterAttributes.filter(attr => attr.count > 0)
            });
        });
    }

    componentWillMount = () => this.fetchMyTeams();

    showTeam = team => () => this.props.history.push("/teams/" + team.id);

    handleDeleteTeam = team => e => {
        stop(e);
        if (confirm(I18n.t("teams.confirmation", {name: team.name}))) {
            deleteTeam(team.id).then(() => this.fetchMyTeams());
            setFlash(I18n.t("teams.flash", {name: team.name, action: I18n.t("teams.flash_deleted")}));
        }
    };

    handleJoinRequest = joinRequest => () =>
        this.props.history.push(`/join-request/${joinRequest.teamId}/${joinRequest.id}`);

    handleDeleteJoinRequest = joinRequest => e => {
        stop(e);
        if (confirm(I18n.t("teams.confirmation_join_request", {name: joinRequest.teamName}))) {
            deleteJoinRequest(joinRequest.id).then(() => this.fetchMyTeams());
            setFlash(I18n.t("teams.flash_join_request", {name: joinRequest.teamName}));
        }
    };

    onSearchKeyDown = e => {
        const {suggestions, selectedTeam} = this.state;
        if (e.keyCode === 40 && selectedTeam < (suggestions.length - 1)) {
            stop(e);
            this.setState({selectedTeam: (selectedTeam + 1)});
        }
        if (e.keyCode === 38 && selectedTeam >= 0) {
            stop(e);
            this.setState({selectedTeam: (selectedTeam - 1)});
        }
        if (e.keyCode === 13 && selectedTeam >= 0) {
            stop(e);
            this.setState({selectedTeam: -1}, () => this.itemSelected(suggestions[selectedTeam]));
        }
        if (e.keyCode === 27) {
            stop(e);
            this.setState({selectedTeam: -1, query: "", suggestions: []});
        }

    };

    search = e => {
        const query = e.target.value;
        this.setState({query: query, selectedTeam: -1});
        if (!isEmpty(query) && query.trim().length > 1) {
            this.delayedAutocomplete();
        }
    };

    delayedAutocomplete = debounce(() =>
        autoCompleteTeam(this.state.query).then(results => this.setState({suggestions: results})), 200);

    sort = item => {
        const {filteredTeams, sortAttributes} = this.state;
        const sortedTeams = [...filteredTeams.sort(this.sortByAttribute(item.name, item.current && item.order === "down"))]
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
        this.setState({filteredTeams: sortedTeams, sortAttributes: newSortAttributes});
    };

    sortByAttribute = (name, reverse = false) => (a, b) => a[name].toString().localeCompare(b[name].toString()) * (reverse ? -1 : 1);

    currentSortedAttribute = () => this.state.sortAttributes.filter(attr => attr.current)[0];

    filter = item => {
        const {teams, filterAttributes} = this.state;
        const newFilterAttributes = [...filterAttributes];
        newFilterAttributes.forEach(attr => {
            if (attr.name === item.name) {
                attr.selected = !attr.selected;
            }
        });
        const filteredTeams = teams.filter(team => newFilterAttributes.filter(attr => attr.name === team.role)[0].selected);
        const currentSorted = this.currentSortedAttribute();
        const sortedTeams = [...filteredTeams.sort(this.sortByAttribute(currentSorted.name, item.order === "up"))];

        this.setState({filteredTeams: sortedTeams, filterAttributes: newFilterAttributes});
    };

    itemSelected = team => {
        //TODO join requests
        this.showTeam(team)();
    };

    addTeam = e => {
        stop(e);
        this.props.history.replace("/new-team");
    };

    roleCell = team => {
        const role = team.role;
        const isJoinRequest = team.isJoinRequest;
        const toolTipId = isJoinRequest ? `join_request_tooltip_${team.id}` : null;
        const userIconClassName = team => team.isJoinRequest ? "fa fa-envelope" :
            team.role === "ADMIN" ? "fa fa-star" :
                team.role === "MANAGER" ? "fa fa-user" : "fa fa-user-o";
        return (
            <td data-label={I18n.t("teams.role")} className={`role ${isJoinRequest ? "join_request" : role.toLowerCase()}`}>
                <span data-for={toolTipId} data-tip>
                    <i className={userIconClassName(team)}></i>
                    {role.toLowerCase()}
                    {isJoinRequest && <i className="fa fa-info-circle"></i>}
                    {isJoinRequest &&
                    <ReactTooltip id={toolTipId} type="light" class="tool-tip" effect="solid">
                        <span className="label">{I18n.t("teams.join_request")}<span className="value">{team.name}</span></span>
                        <span className="label">{I18n.t("teams.created")}<span className="value">{moment.unix(team.created).format("LLL")}</span></span>
                        <span className="label">{I18n.t("teams.message")}</span>
                        <span>{team.message}</span>
                    </ReactTooltip>}
                </span>
            </td>
        );
    };

    membershipCountCell = team => {
        const joinRequestsCount = team.joinRequestsCount;
        const invitationsCount = team.invitationsCount;
        const tooltip = joinRequestsCount > 0 || invitationsCount > 0;
        const toolTipId = `team_tooltip_${team.id}`;
        return (
            <td className="membership-count"  data-label={I18n.t("teams.membershipCount")}>
                <span className="membership-count" data-for={toolTipId} data-tip>{team.membershipCount}
                    {joinRequestsCount > 0 && <span className="join-requests-count"><span
                        className="count-divider"> / </span>{joinRequestsCount}</span> }
                    {invitationsCount > 0 && <span className="invitations-count"><span
                        className="count-divider"> / </span>{invitationsCount}</span> }
                    {tooltip && <i className="fa fa-info-circle"></i>}
                    {tooltip &&
                    <ReactTooltip id={toolTipId} type="light" class="tool-tip" effect="solid">
                        <ul>
                            {joinRequestsCount > 0 &&
                            <li>{joinRequestsCount === 1 ? I18n.t("received_join_request") :
                                I18n.t("teams.received_join_requests", {count: joinRequestsCount})}</li>}
                            {invitationsCount > 0 &&
                            <li>{invitationsCount === 1 ? I18n.t("teams.pending_invitation") :
                                I18n.t("teams.pending_invitations", {count: invitationsCount})}</li>}
                        </ul>
                    </ReactTooltip>}
             </span>
            </td>
        );
    };

    toggleActions = (team, actions) => e => {
        stop(e);
        this.setState({actions: {show: actions.id !== team.name, id: team.name}})
    };

    renderActions = (team, actions) => {
        if (actions.id !== team.name) {
            return null;
        }
        const options = [];
        if (team.role === JOIN_REQUESTS_ROLE) {
            options.push({icon: "fa fa-send-o", label: "resend", action: this.handleJoinRequest(team)});
            options.push({icon: "fa fa-thrash", label: "remove", action: this.handleDeleteJoinRequest(team)});
        }
        if (team.role !== JOIN_REQUESTS_ROLE) {
            options.push({icon: "fa fa-search-plus", label: "details", action: () => this.props.history.replace(`/teams/${team.id}`)});
        }
        if (team.role !== "MEMBER") {
            options.push({icon: "fa fa-clock-o", label: "invite", action: () => this.props.history.replace(`/invite/${team.id}`)});
        }
        if (team.role === "ADMIN") {
            options.push({icon: "fa fa-thrash", label: "remove", action: this.handleDeleteTeam(team)});
        }
        return (
            <ul className="actions" tabIndex="1" onBlur={() => this.toggleActions(team, actions)}>
               <li><i className="fa fa-thrash"></i>{`teamName ${team.name}`}</li>
            </ul>
        );
    };

    renderTeamsTable(teams, isMemberOfTeam, actions) {
        const currentSorted = this.currentSortedAttribute();
        const sortColumnClassName = name => currentSorted.name === name ? "sorted" : "";

        const columns = ["name", "description", "role", "membershipCount", "actions"];
        const th = index => (
            <th key={index} className={columns[index]}>
                <span className={sortColumnClassName(columns[index])}>{I18n.t(`teams.${columns[index]}`)}</span>
            </th>
        );
        if (teams.length !== 0) {
            return (
                <table className="teams">
                    <thead>
                    <tr>{columns.map((column, index) => th(index))}</tr>
                    </thead>
                    <tbody>
                    {teams.map((team, index) =>
                        <tr key={`${team.urn}_${index}`} onClick={this.showTeam(team)} className={team.isJoinRequest ? "join_request" : ""}>
                            <td data-label={I18n.t("teams.name")} className={team.isJoinRequest ? "join_request name" : "name"}>
                                {team.name}
                            </td>
                            <td data-label={I18n.t("teams.description")} className="description">{team.description}</td>
                            {this.roleCell(team)}
                            {this.membershipCountCell(team)}
                            <td data-label={I18n.t("teams.actions_phone")} className="actions" onClick={this.toggleActions(team, actions)}>
                                <i className="fa fa-ellipsis-h"></i>
                                {this.renderActions(team, actions)}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            );
        }
        return <div><em>{I18n.t(`teams.${isMemberOfTeam ? "filtered" : "no_found"}`)}</em></div>;
    }

    render() {
        const {currentUser} = this.props;
        const {
            filteredTeams, actions, sortAttributes, filterAttributes, selectedTeam, suggestions, query, isMemberOfTeam
        } = this.state;
        const showAutoCompletes = query.length > 1 && !isEmpty(suggestions);
        return (
            <div className="my_teams">
                <IconLegend/>
                <div className="card">
                    <div className="options">
                        <SortDropDown items={sortAttributes} sortBy={this.sort}/>
                        <FilterDropDown items={filterAttributes} filterBy={this.filter}/>
                        <section className="search">
                            <input placeholder={I18n.t("teams.searchPlaceHolder")}
                                   type="text"
                                   onChange={this.search}
                                   value={query}
                                   onKeyDown={this.onSearchKeyDown}/>
                            <i className="fa fa-search"></i>
                            {showAutoCompletes && <TeamAutocomplete suggestions={suggestions}
                                                                    query={query}
                                                                    selectedTeam={selectedTeam}
                                                                    itemSelected={this.itemSelected}
                            />}
                        </section>
                        {!currentUser.person.guest &&
                        <a className="button green" href="#" onClick={this.addTeam}>
                            {I18n.t("teams.add")}<i className="fa fa-plus"></i>
                        </a>}
                    </div>
                    {this.renderTeamsTable(filteredTeams, isMemberOfTeam, actions)}
                </div>
            </div>
        );
    }
}

MyTeams.propTypes = {
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};

