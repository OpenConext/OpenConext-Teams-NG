import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

import CheckBox from "./checkbox";
import CopyToClipboard from "react-copy-to-clipboard";
import {isEmpty} from "../utils/utils";

export default class LinkedInstitutionTeams extends React.Component {

    constructor(props) {
        super(props);
        const institutionTeams = [...(props.institutionTeams || [])].sort((a, b) => a.name.localeCompare(b.name));
        this.state = {
            filteredTeams: institutionTeams,
            copiedToClipboard: {},
        };
    }

    search = e => {
        const query = e.target.value;
        const {institutionTeams} = this.props;
        if (isEmpty(query)) {
            this.setState({filteredTeams: institutionTeams});
        } else {
            const input = query.toLowerCase();
            const filteredTeams = institutionTeams.filter(team => {
                const description = team.description || "";
                return team.name.toLowerCase().indexOf(input) > -1 || description.toLowerCase().indexOf(input) > -1;
            });
            this.setState({filteredTeams: filteredTeams});
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
        const target = e.target;
        // const value = target.type === "checkbox" ? target.checked : target.value;
        const identifier = institutionTeam.identifier;
        //TODO delegate to parent
        return [target, identifier];
    };

    isInstitutionalTeamLinked = (institutionTeam, linkedTeams) => linkedTeams
        .filter(et => et.identifier === institutionTeam.identifier).length > 0;


    renderLinkedTeamsCell = (institutionTeam, linkedTeams) =>
        <td data-label={I18n.t("team_detail.linked")} className="team-linked">
            <CheckBox name={institutionTeam.identifier}
                      value={this.isInstitutionalTeamLinked(institutionTeam, linkedTeams)}
                      onChange={this.linkOrUnlink(institutionTeam)}/>
        </td>;


    renderTeamsTable(filteredTeams, linkedTeams) {
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
                    {filteredTeams.map((team, index) =>
                        <tr key={`${team.identifier}_${index}`}>
                            {this.renderNameCell(team)}
                            <td data-label={I18n.t("institution_teams.description")}
                                className="description">{team.description}</td>
                            {this.renderLinkedTeamsCell(team, linkedTeams)}
                        </tr>
                    )}
                    </tbody>
                </table>
            );
        }
        return (
            <div>
                <em>{I18n.t(`institution_teams.${this.state.institutionTeams.length > 0 ? "filtered" : "no_teams"}`)}</em>
            </div>
        );
    }

    render() {
        const {filteredTeams} = this.state;
        const {team} = this.props;

        return (
            <section className="card">
                <section className="team-detail-controls">
                    <section className="search">
                        <input placeholder={I18n.t("institution_teams.searchPlaceHolder")} type="text"
                               onChange={this.search}/>
                        <i className="fa fa-search"></i>
                    </section>
                </section>
                {this.renderTeamsTable(filteredTeams, team.externalTeams)}
            </section>
        );
    }
}

LinkedInstitutionTeams.propTypes = {
    institutionTeams: PropTypes.array.isRequired,
    team: PropTypes.object.isRequired,
};

