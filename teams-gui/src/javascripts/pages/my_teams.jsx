import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

import SortDropDown from "../components/sort_drop_down";
import TeamAutocomplete from "../components/team_autocomplete";
import {autoComplete, deleteTeam, getMyTeams} from "../api";
import {clearFlash, setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";

export default class MyTeams extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            sorted: {name: "name", order: "down"},
            actions: {show: false, id: 0},
            sortAttributes: [
                {name: "name", order: "down", current: true},
                {name: "description", order: "down", current: false},
                {name: "role", order: "down", current: false},
                {name: "members", order: "down", current: false}
            ],
            selectedTeam: -1,
            suggestions: [],
            query: ""

        };
    }

    fetchMyTeams() {
        clearFlash();
        getMyTeams().then(myTeams => {
            const teams = myTeams.sort((team, otherTeam) => team.name.localeCompare(otherTeam.name));
            this.setState({teams: teams});
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
        const input = e.target.value;
        if (isEmpty(input) || input.length < 3) {
            this.setState({query: input, suggestions: [], selectedTeam: -1});
        } else {
            autoComplete(input).then(results => this.setState({query: input, suggestions: results}));
        }
    };

    sort = item => {
        return item;
        // const {teams} = this.state;
        // let sortedTeams = teams.sort(this.sortByAttribute(item.name));
        //TODO sort an update the sortedAttributes state object
//        let newOrder = "down";
        //     this.setState({sortedTeams: sortedTeams, sorted: {name: column.sort, order: newOrder}});
    };

    sortByAttribute = name => (a, b) => a[name].localeCompare(b[name]);

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

    renderTeamsTable() {
        const {teams, actions} = this.state;

        if (teams.length !== 0) {
            return (
                <table>
                    <thead>
                    <tr>
                        <th>{I18n.t("teams.name")}</th>
                        <th>{I18n.t("teams.description")}</th>
                        <th>{I18n.t("teams.role")}</th>
                        <th>{I18n.t("teams.membershipCount")}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map(team =>
                        <tr key={team.urn} onClick={this.showTeam(team)}>
                            <td>{team.name}</td>
                            <td>{team.description}</td>
                            <td>{team.role.substring(0, 1) + team.role.substring(1).toLowerCase()}</td>
                            <td className="membership-count">{team.membershipCount}</td>
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
        const {sortAttributes, selectedTeam, suggestions, query} = this.state;
        const showAutocompletes = query.length > 2;
        return (
            <div className="my_teams">
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
                <div className="options">
                    <SortDropDown items={sortAttributes} sortBy={this.sort}/>
                    {!currentUser.person.guest && <a className="button blue" href="#"
                                                     onClick={this.addTeam}>{I18n.t("teams.add")}
                        <i className="fa fa-user"></i>
                    </a>}

                </div>
                {this.renderTeamsTable()}
            </div>
        );
    }
}

MyTeams.propTypes = {
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};

