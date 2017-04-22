import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

import SortDropDown from "../components/sort_drop_down";
import {deleteTeam, getMyTeams} from "../api";
import {clearFlash, setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";

export default class MyTeams extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            filteredTeams: [],
            sorted: {name: "name", order: "down"},
            actions: {show: false, id: 0},
            sortAttributes: [
                {name: "name", order: "down", current: true},
                {name: "description", order: "down", current: false},
                {name: "role", order: "down", current: false},
                {name: "members", order: "down", current: false}
            ],

        };
    }

    fetchMyTeams() {
        clearFlash();
        getMyTeams().then(myTeams => {
            const teams = myTeams.sort((team, otherTeam) => team.name.localeCompare(otherTeam.name));
            this.setState({teams: teams, filteredTeams: teams});
        });
    }

    componentWillMount = () => this.fetchMyTeams();

    componentDidUpdate = () => document.body.scrollTop = document.documentElement.scrollTop = 0;

    showTeam = team => e => {
        stop(e);
        //http://stackoverflow.com/questions/42123261/programmatically-navigate-using-react-router-v4
        this.props.history.push("/teams/" + team.id);
    };

    handleDeleteTeam = team => e => {
        stop(e);
        if (confirm(I18n.t("teams.confirmation", {name: team.name}))) {
            deleteTeam(team.id).then(() => this.fetchMyTeams());
            setFlash(I18n.t("teams.flash", {policyName: team.name, action: I18n.t("teams.flash_deleted")}));
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

    search = e => {
        const input = e.target.value;
        if (isEmpty(input)) {
            this.setState({filteredTeams: this.state.teams});
        } else {
            this.setState({filteredTeams: this.filterTeams(input.toLowerCase())});
        }
    };

    filterTeams(input) {
        return this.state.teams.filter(team =>
        team.name.toLowerCase().includes(input) || team.description.toLowerCase().includes(input));
    }

    sort = item => {
        debugger;
        const {teams} = this.state;
        let sortedTeams = teams.sort(this.sortByAttribute(item.name));
        //TODO sort an update the sortedAttributes state object
        let newOrder = "down";
        this.setState({sortedTeams: sortedTeams, sorted: {name: column.sort, order: newOrder}});
    };

    sortByAttribute = name => (a, b) => a[name].localeCompare(b[name]);

    handleClickAction = (actions, team) => e => {
        stop(e);
        const show = actions.id === team.id ? !actions.show : true;
        this.setState({actions: {show: show, id: team.id}})
    };

    addTeam = e => {
        stop(e);
        this.props.history.replace("/add-team");
    };

    renderTeamsTable() {
        const {filteredTeams, actions} = this.state;

        if (filteredTeams.length !== 0) {
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
                    {filteredTeams.map(team =>
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
        const {sortAttributes} = this.state;
        return (
            <div className="my_teams">
                <div className="search">
                    <input placeholder={I18n.t("teams.searchPlaceHolder")} type="text" onChange={this.search}/>
                    <i className="fa fa-search"></i>
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

