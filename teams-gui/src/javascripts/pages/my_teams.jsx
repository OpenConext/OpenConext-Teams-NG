import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import debounce from "lodash/debounce";

import SortDropDown from "../components/sort_drop_down";
import TeamAutocomplete from "../components/team_autocomplete";
import {autoComplete, deleteTeam, getMyTeams} from "../api";
import {clearFlash, setFlash} from "../utils/flash";
import {stop} from "../utils/utils";

export default class MyTeams extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            joinRequests: [],
            invitationsSend: [],
            invitationsReceived: [],
            sorted: {name: "name", order: "down"},
            actions: {show: false, id: 0},
            sortAttributes: [
                {name: "name", order: "down", current: true},
                {name: "description", order: "down", current: false},
                {name: "role", order: "down", current: false},
                {name: "membershipCount", order: "down", current: false}
            ],
            selectedTeam: -1,
            suggestions: [],
            query: ""

        };
    }

    fetchMyTeams() {
        clearFlash();
        getMyTeams().then(myTeams => {
            const teams = myTeams.teamSummaries.sort(this.sortByAttribute("name"));
            this.setState({
                teams: teams,
                joinRequests: myTeams.joinRequests,
                invitationsSend: myTeams.invitationsSend,
                invitationsReceived: myTeams.invitationsReceived
            });
        });
    }

    componentWillMount = () => this.fetchMyTeams();

    componentDidUpdate = () => document.body.scrollTop = document.documentElement.scrollTop = 0;

    showTeam = team => () => {
        this.props.history.push("/teams/" + team.id);
    };

    handleDeleteTeam = team => e => {
        stop(e);
        if (confirm(I18n.t("teams.confirmation", {name: team.name}))) {
            deleteTeam(team.id).then(() => this.fetchMyTeams());
            setFlash(I18n.t("teams.flash", {name: team.name, action: I18n.t("teams.flash_deleted")}));
        }
    };

    renderActions = (actions, team) => e => {
        stop(e);
        const showActions = (actions.show && actions.id === team.id);
        return showActions &&
            (
                <div className="actions">
                    <a href="#" onClick={this.showTeam(team)}>
                        <i className="fa fa-edit"></i>
                    </a>
                    <a href="#" onClick={this.handleDeleteTeam(team)}>
                        <i className="fa fa-remove"></i>
                    </a>
                </div>
            );
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
        this.delayedAutocomplete();
    };

    delayedAutocomplete = debounce(() =>
        autoComplete(this.state.query).then(results => this.setState({suggestions: results})), 200);

    sort = item => {
        const {teams, sortAttributes} = this.state;
        const sortedTeams = teams.sort(this.sortByAttribute(item.name, item.current && item.order === "down"));
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
        this.setState({teams: sortedTeams, sortAttributes: newSortAttributes});
    };

    sortByAttribute = (name, reverse = false) => (a, b) => a[name].toString().localeCompare(b[name].toString()) * (reverse ? -1 : 1);

    itemSelected = team => {
        this.showTeam(team)();
    };

    handleClickAction = (actions, team) => e => {
        stop(e);
        const show = actions.id === team.id ? !actions.show : true;
        this.setState({actions: {show: show, id: team.id}});
    };

    addTeam = e => {
        stop(e);
        this.props.history.replace("/add-team");
    };

    membershipCountCell = team => {
        const joinRequestsCount = this.state.joinRequests.filter(joinRequest => joinRequest.teamIdentifier === team.id).length;
        const invitationsCount = this.state.invitationsSend.filter(invitation => invitation.teamIdentifier === team.id).length;
        const tooltip = joinRequestsCount > 0 || invitationsCount > 0;
        const toolTipId = `team_tooltip_${team.id}`;
        return (
            <td className="membership-count">
                {tooltip && <i className="fa fa-info-circle"></i>}
                <span className="membership-count" data-for={toolTipId} data-tip>{team.membershipCount}
                    {joinRequestsCount > 0 && <span className="join-requests-count"><span
                        className="count-divider"> / </span>{joinRequestsCount}</span> }
                    {invitationsCount > 0 && <span className="invitations-count"><span
                        className="count-divider"> / </span>{invitationsCount}</span> }
                    {tooltip &&
                    <ReactTooltip id={toolTipId} type="light" class="tool-tip" effect="solid">
                        <ul>
                            {joinRequestsCount > 0 &&
                            <li>{I18n.t("teams.outstanding_join_request", {count: joinRequestsCount})}</li>}
                            {invitationsCount > 0 &&
                            <li>{I18n.t("teams.outstanding_invitations", {count: invitationsCount})}</li>}
                        </ul>
                    </ReactTooltip>}
             </span>
            </td>
        );
    };

    renderTeamsTable(teams, actions) {
        const currentSorted = this.state.sortAttributes.filter(attr => attr.current)[0];
        const sortColumnClassName = name => currentSorted.name === name ? "sorted" : "";
        const userIconClassName = team => team.role === "PENDING" ? "fa fa-clock-o" : `fa fa-user ${team.role.toLowerCase()}`;
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
                    {teams.map(team =>
                        <tr key={team.urn} onClick={this.showTeam(team)}>
                            <td className="name"><i className={userIconClassName(team)}></i>{team.name}</td>
                            <td className="description">{team.description}</td>
                            <td className={`role ${team.role.toLowerCase()}`}>{team.role.substring(0, 1) + team.role.substring(1).toLowerCase()}</td>
                            {this.membershipCountCell(team)}
                            <td className="actions" onClick={this.handleClickAction(actions, team)}>
                                <i className="fa fa-ellipsis-h"></i>
                                <div className="actionsHolder">{this.renderActions(actions, team)}</div>
                            </td>
                        </tr>
                    )}

                    </tbody>
                </table>
            );
        }
        return <div><em>{I18n.t("teams.no_found")}</em></div>;
    }

    render() {
        const {currentUser} = this.props;
        const {
            teams, joinRequests, invitationsSend, invitationsReceived, actions, sortAttributes,
            selectedTeam, suggestions, query
        } = this.state;
        const showAutocompletes = query.length > 2;
        return (
            <div className="my_teams">
                <div className="operations">
                    <h2>{I18n.t("teams.title")}</h2>
                    <span className="first">{I18n.t("teams.member_requests")}<span
                        className="number">{joinRequests.length}</span></span>
                    <span>{I18n.t("teams.invitations_send")}<span
                        className="number">{invitationsSend.length}</span></span>
                    <span>{I18n.t("teams.invitations_received")}<span
                        className="number">{invitationsReceived.length}</span></span>
                </div>
                <div className="card">
                    <div className="options">
                        <SortDropDown items={sortAttributes} sortBy={this.sort}/>
                        <div className="search">
                            <input ref={self => this.searchInput = self}
                                   placeholder={I18n.t("teams.searchPlaceHolder")}
                                   type="text"
                                   onChange={this.search}
                                   value={query}
                                   onKeyDown={this.onSearchKeyDown}/>
                            <i className="fa fa-search"></i>
                            {showAutocompletes && <TeamAutocomplete suggestions={suggestions}
                                                                    query={query}
                                                                    selectedTeam={selectedTeam}
                                                                    itemSelected={this.itemSelected}/>}
                        </div>
                        {!currentUser.person.guest &&
                        <a className="button green" href="#" onClick={this.addTeam}>
                            <i className="fa fa-plus"></i>
                        </a>}
                    </div>
                    {this.renderTeamsTable(teams, actions)}
                </div>
            </div>
        );
    }
}

MyTeams.propTypes = {
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};

