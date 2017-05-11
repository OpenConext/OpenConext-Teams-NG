import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import CopyToClipboard from "react-copy-to-clipboard";
import {NavLink} from "react-router-dom";

import CheckBox from "./checkbox";
import TeamsIconLegend from "./teams_icon_legend";
import {isEmpty} from "../utils/utils";

export default class LinkedInstitutionTeams extends React.Component {

    constructor(props) {
        super(props);
        const institutionTeams = [...(props.institutionTeams || [])].sort(this.sort(props.team));
        this.state = {
            filteredTeams: institutionTeams,
            hasInstitutionsTeams: institutionTeams.length > 0,
            copiedToClipboard: {},
        };
    }

    sort = team => (a, b) => {
        if (isEmpty(team)) {
            return a.name.localeCompare(b.name);
        }
        const linkedA = this.isInstitutionalTeamLinked(a, team);
        const linkedB = this.isInstitutionalTeamLinked(b, team);
        if ((linkedA && linkedB) || (!linkedA && !linkedB)) {
            return a.name.localeCompare(b.name);
        }
        return linkedA ? -1 : 1;
    };

    search = e => {
        const query = e.target.value;
        const {institutionTeams} = this.props;
        if (isEmpty(query)) {
            this.setState({filteredTeams: [...institutionTeams]});
        } else {
            const input = query.toLowerCase();
            const filteredTeams = institutionTeams.filter(team => {
                const description = team.description || "";
                return team.name.toLowerCase().indexOf(input) > -1 || description.toLowerCase().indexOf(input) > -1;
            });
            this.setState({filteredTeams: [...filteredTeams.sort(this.sort(this.props.team))]});
        }

    };

    copiedToClipboard = identifier => () => {
        const newState = {...this.state.copiedToClipboard};
        newState[identifier] = true;
        this.setState({copiedToClipboard: newState});

        const newStateAfterTimeout = {...this.state.copiedToClipboard};
        newStateAfterTimeout[identifier] = false;
        setTimeout(() => this.setState({copiedToClipboard: newStateAfterTimeout}), 5000);
    };

    renderNameCell = team => {
        const copiedToClipboard = this.state.copiedToClipboard[team.identifier];
        const copiedToClipBoardClassName = copiedToClipboard ? "copied" : "";
        const tooltip = I18n.t(copiedToClipboard ? "team_detail.copied" : "team_detail.copy");
        const tooltipId = `copy-to-clipboard-${team.identifier}`;
        return (
            <td data-label={I18n.t("institution_teams.name")} className="name">
                <span className="name"><i className="fa fa-building-o"></i>{team.name}</span>
                <CopyToClipboard text={team.identifier} onCopy={this.copiedToClipboard(team.identifier)}>
                                    <span className="identifier">{team.identifier}
                                        <a data-for={tooltipId} data-tip>
                                            <i className={`fa fa-clone ${copiedToClipBoardClassName}`}></i>
                                        </a>
                                        <ReactTooltip id={tooltipId} place="right"
                                                      getContent={[() => tooltip, 500]}/>
                                    </span>
                </CopyToClipboard>
            </td>
        );
    };

    linkOrUnlink = institutionTeam => e => {
        const value = e.target.checked;
        const identifier = institutionTeam.identifier;
        this.props.institutionTeamLinked(identifier, value);
    };

    isInstitutionalTeamLinked = (institutionTeam, team) => {
        if (isEmpty(team)) {
            return false;
        }
        return team.externalTeams
                .filter(et => et.identifier === institutionTeam.identifier).length > 0;
    };


    renderLinkedTeamsCellSelectionMode = (institutionTeam, team) =>
        <td data-label={I18n.t("team_detail.linked")} className="team-linked">
            <CheckBox name={institutionTeam.identifier}
                      value={this.isInstitutionalTeamLinked(institutionTeam, team)}
                      onChange={this.linkOrUnlink(institutionTeam)}/>
        </td>;

    renderLinkedTeamsCellReadOnlyMode = linkedTeams =>
        <td data-label={I18n.t("institution_teams.linked_teams")} className="linked-teams">
            {linkedTeams.map((linkedTeam, index) =>
                <NavLink key={`${linkedTeam.id}_${index}`} className="linked-team" to={`/teams/${linkedTeam.id}`}>
                    <i className="fa fa-users"></i>{linkedTeam.name}
                </NavLink>
            )}
        </td>;

    renderTeamsTable(filteredTeams, linkedTeams, team) {
        const columns = ["name", "description", "linked"];
        const th = index => (
            <th key={index} className={columns[index]}>
                <span>{I18n.t(`team_detail.${columns[index]}`)}</span>
            </th>
        );
        if (filteredTeams.length !== 0) {
            return (
                <table className="institution_teams">
                    <thead>
                    <tr>{columns.map((column, index) => th(index))}</tr>
                    </thead>
                    <tbody>
                    {filteredTeams.map((institutionTeam, index) =>
                        <tr key={`${institutionTeam.identifier}_${index}`}
                            className={this.isInstitutionalTeamLinked(institutionTeam, team) ? "linked-institutional-team" : ""}>
                            {this.renderNameCell(institutionTeam)}
                            <td data-label={I18n.t("institution_teams.description")}
                                className="description">{institutionTeam.description}</td>
                            {team && this.renderLinkedTeamsCellSelectionMode(institutionTeam, team)}
                            {linkedTeams && this.renderLinkedTeamsCellReadOnlyMode(linkedTeams[institutionTeam.identifier] || [])}
                        </tr>
                    )}
                    </tbody>
                </table>
            );
        }
        return (
            <div>
                <em>{I18n.t(`institution_teams.${this.state.hasInstitutionsTeams ? "filtered" : "no_teams"}`)}</em>
            </div>
        );
    }

    render() {
        const {filteredTeams} = this.state;
        const {team, linkedTeams, includeLegend} = this.props;
        const filteredSortedTeams = isEmpty(team) ? filteredTeams : [...filteredTeams].sort(this.sort(team));

        return (
            <div className="institution_teams">
                {includeLegend && <TeamsIconLegend currentUser={this.props.currentUser}/>}
                <section className="card-institution-teams">
                    <section className="options-institution-teams">
                        <section className="search-institution-teams">
                            <input placeholder={I18n.t("institution_teams.searchPlaceHolder")} type="text"
                                   onChange={this.search}/>
                            <i className="fa fa-search"></i>
                        </section>
                    </section>
                    {this.renderTeamsTable(filteredSortedTeams, linkedTeams, team)}
                </section>
            </div>
        );
    }
}

LinkedInstitutionTeams.propTypes = {
    institutionTeams: PropTypes.array.isRequired,
    currentUser: PropTypes.object.isRequired,
    team: PropTypes.object,
    linkedTeams: PropTypes.object,
    includeLegend: PropTypes.bool,
    institutionTeamLinked: PropTypes.func
};

