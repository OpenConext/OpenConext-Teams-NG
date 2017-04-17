import React from "react";
import I18n from "i18n-js";
import { getTeamDetail } from "../api";
import { setFlash } from "../utils/flash";
import { stop } from "../utils/utils";
import moment from 'moment';

export default class TeamDetail extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            team: {},
            filteredMembers: [],
            sorted: {name: "status", order: "down"}
        };
    }

    fetchTeam() {
        getTeamDetail(this.props.params.id).then(team => {
            this.setState({
                team: team,
                filteredMembers: team.memberships.sort(this.sortByStatus)
            });
        });
    }

    sortByStatus = (member, otherMember) => {
      return member.status.localeCompare(otherMember.status);
    };

    componentWillMount = () => this.fetchTeam();

    componentDidUpdate = () => document.body.scrollTop = document.documentElement.scrollTop = 0;

    handleAcceptJoinRequest = (team) => (e) => {
        stop(e);
        this.props.history.replace("/team/" + team.urn);
    };

    handleDeleteTeam = (team) => (e) => {
        stop(e);
        if (confirm(I18n.t("teams.confirmation", {name: team.name}))) {
            deleteTeam(team.id).then(() => this.fetchMyTeams())
            setFlash(I18n.t("teams.flash", { policyName: team.name, action: I18n.t("teams.flash_deleted") }));
        }
    };

    renderActions = (team) => (<div className="actions">
        <a href="#" onClick={this.handleShowTeam(team)}>
            <i className="fa fa-edit"></i>
        </a>
        <a href="#" onClick={this.handleDeleteTeam(team)}>
            <i className="fa fa-remove"></i>
        </a>
    </div>);

    search = (e) => {
        let input = e.target.value;
        if (input === undefined || input === null || input.trim().length === 0) {
            this.setState({filteredTeams: this.state.teams});
        } else {
            this.setState({filteredTeams: this.filterTeams(input.toLowerCase())});
        }
    };

    filterTeams(input) {
        return this.state.teams.filter((team) =>
            team.name.toLowerCase().includes(input) || team.description.toLowerCase().includes(input)
        )
    }

    sort = (column, teams) => (e) => {
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
        this.setState({sortedTeams: sortedTeams, sorted: {name: column.sort, order: newOrder}})
    };

    sortByAttribute = (name) =>  (a, b) => a[name].localeCompare(b[name]);

    iconClassName(column) {
        const sorted = this.state.sorted.name === column.sort ? (this.state.sorted.order + " active") : "down";
        return "fa fa-arrow-" + sorted;
    }

    renderMembersTable() {
        let columns = [
            {title: I18n.t("teams.name"), sort: "name", sortFunction: this.sortByAttribute("name")},
            {title: I18n.t("teams.description"), sort: "description", sortFunction: this.sortByAttribute("description")},
            {title: I18n.t("teams.role"), sort: "role", sortFunction: this.sortByAttribute("role")},
            {title: I18n.t("teams.membershipCount"), sort: "membershipCount", sortFunction: (a, b) => a > b ? -1 : a < b ? 1 : 0 },
            {title: I18n.t("teams.actions")}
        ];
        if (this.state.filteredTeams.length !== 0) {
            return (<table>
                <thead>
                <tr>
                    {columns.map((column) =>
                        <th key={column.title} onClick={this.sort(column, this.state.filteredTeams)}>
                            <span>{column.title}
                                {column.sortFunction && <i className={this.iconClassName(column)}></i>}
                            </span>
                        </th>)}
                </tr>
                </thead>
                <tbody>
                {this.state.filteredTeams.map((team) =>
                    <tr key={team.urn}>
                        <td>{team.name}</td>
                        <td>{moment(member.created).format('LLLL')}</td>
                        <td>{team.role.substring(0,1) + team.role.substring(1).toLowerCase()}</td>
                        <td className="membership-count">{team.membershipCount}</td>
                        <td>{this.renderActions(team)}</td>
                    </tr>
                )}

                </tbody>
            </table>)
        } else {
            return <div><em>{I18n.t("teams.no_found")}</em></div>
        }
    }

    render() {
        return (
                <div className="team_detail">
                    <div className="search">
                        <input placeholder={I18n.t("teams.searchPlaceHolder")} type="text" onChange={this.search}/>
                        <i className="fa fa-search"></i>
                    </div>
                    {this.renderTeamTable()}
                </div>
        );
    }
}
