import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

import {deleteTeam, getMyTeams} from "../api";
import {setFlash} from "../utils/flash";
import {isEmpty, stop} from "../utils/utils";

export default class MyTeams extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            filteredTeams: [],
            sorted: {name: "name", order: "down"}
        };
    }

    fetchMyTeams() {
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

    renderActions = team => (<div className="actions">
        <a href="#" onClick={this.showTeam(team)}>
            <i className="fa fa-edit"></i>
        </a>
        <a href="#" onClick={this.handleDeleteTeam(team)}>
            <i className="fa fa-remove"></i>
        </a>
    </div>);

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

    sort = (column, teams) => e => {
        stop(e);
        if (column.sortFunction === undefined) {
            return;
        }
        let sortedTeams = teams.sort(column.sortFunction);
        let newOrder = "down";
        if (this.state.sorted.name === column.sort) {
            newOrder = this.state.sorted.order === "down" ? "up" : "down";
            if (newOrder === "up") {
                sortedTeams = sortedTeams.reverse();
            }
        }
        this.setState({sortedTeams: sortedTeams, sorted: {name: column.sort, order: newOrder}});
    };

    sortByAttribute = name => (a, b) => a[name].localeCompare(b[name]);

    iconClassName(column) {
        const sorted = this.state.sorted.name === column.sort ? (this.state.sorted.order + " active") : "down";
        return "fa fa-arrow-" + sorted;
    }

    renderTeamsTable() {
        const columns = [
            {title: I18n.t("teams.name"), sort: "name", sortFunction: this.sortByAttribute("name")},
            {
                title: I18n.t("teams.description"),
                sort: "description",
                sortFunction: this.sortByAttribute("description")
            },
            {title: I18n.t("teams.role"), sort: "role", sortFunction: this.sortByAttribute("role")},
            {
                title: I18n.t("teams.membershipCount"),
                sort: "membershipCount",
                sortFunction: (a, b) => a > b ? -1 : a < b ? 1 : 0
            },
            {title: I18n.t("teams.actions")}
        ];
        const filteredTeams = this.state.filteredTeams;
        if (filteredTeams.length !== 0) {
            return (
                <table>
                    <thead>
                    <tr>
                        {columns.map(column =>
                            <th key={column.title} onClick={this.sort(column, filteredTeams)}>
                            <span>{column.title}
                                {column.sortFunction && <i className={this.iconClassName(column)}></i>}
                            </span>
                            </th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {filteredTeams.map(team =>
                        <tr key={team.urn} onClick={this.showTeam(team)}>
                            <td>{team.name}</td>
                            <td>{team.description}</td>
                            <td>{team.role.substring(0, 1) + team.role.substring(1).toLowerCase()}</td>
                            <td className="membership-count">{team.membershipCount}</td>
                            <td>{this.renderActions(team)}</td>
                        </tr>
                    )}

                    </tbody>
                </table>
            );
        }
        return <div><em>{I18n.t("teams.no_found")}</em></div>;
    }

    renderUserDropDown() {
        return (
            <div className="btn-group open">
                <a className="btn btn-primary" href="#"><i className="fa fa-user fa-fw"></i> User</a>
                <a className="btn btn-primary dropdown-toggle" data-toggle="dropdown" href="#">
                    <span className="fa fa-caret-down" title="Toggle dropdown menu"></span>
                </a>
                <ul className="dropdown-menu">
                    <li><a href="#"><i className="fa fa-pencil fa-fw"></i> Edit</a></li>
                    <li><a href="#"><i className="fa fa-trash-o fa-fw"></i> Delete</a></li>
                    <li><a href="#"><i className="fa fa-ban fa-fw"></i> Ban</a></li>
                    <li className="divider"></li>
                    <li><a href="#"><i className="fa fa-unlock"></i> Make admin</a></li>
                </ul>
            </div>
        );
    }

    render() {
        return (
            <div className="my_teams">
                {this.renderUserDropDown()}
                <div className="search">
                    <input placeholder={I18n.t("teams.searchPlaceHolder")} type="text" onChange={this.search}/>
                    <i className="fa fa-search"></i>
                </div>
                {this.renderTeamsTable()}
            </div>
        );
    }
}

MyTeams.propTypes = {
    history: PropTypes.object.isRequired
};

