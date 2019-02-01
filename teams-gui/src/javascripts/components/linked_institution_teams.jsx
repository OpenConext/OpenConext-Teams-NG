import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import CopyToClipboard from "react-copy-to-clipboard";
import {NavLink} from "react-router-dom";

import CheckBox from "./checkbox";
import SortDropDown from "./sort_drop_down";
import TeamsIconLegend from "./teams_icon_legend";
import {isEmpty} from "../utils/utils";
import {currentUserRoleInTeam, ROLES} from "../validations/memberships";
import LinkedInstitutionTeamsExplain from "../components/linked_institution_teams_explain";

export default class LinkedInstitutionTeams extends React.PureComponent {

    constructor(props) {
        super(props);
        const institutionTeams = [...(props.institutionTeams || [])].sort(this.sortByAttribute("linked"));
        this.state = {
            filteredTeams: institutionTeams,
            sortAttributes: [
                {name: "name", order: "down", current: false},
                {name: "description", order: "down", current: false},
                {name: "linked", order: "down", current: true}
            ],
            hasInstitutionsTeams: institutionTeams.length > 0,
            copiedToClipboard: {},
            showExplanation: false
        };
    }

    currentSortedAttribute = () => this.state.sortAttributes.filter(attr => attr.current)[0];

    sortByAttribute = (name, reverse = false) => (a, b) => {
        if (name === "linked") {
            const team = this.props.team;
            if (isEmpty(team)) {
                const linkedTeams = this.props.linkedTeams;
                const l1 = linkedTeams[a.identifier] ? linkedTeams[a.identifier].length : 0;
                const l2 = linkedTeams[b.identifier] ? linkedTeams[b.identifier].length : 0;
                return (l1 > l2 ? -1 : l1 < l2 ? 1 : 0) * (reverse ? -1 : 1);
            }
            const linkedA = this.isInstitutionalTeamLinked(a, team);
            const linkedB = this.isInstitutionalTeamLinked(b, team);
            if ((linkedA && linkedB) || (!linkedA && !linkedB)) {
                return a.name.localeCompare(b.name);
            }
            return (linkedA ? -1 : 1) * (reverse ? -1 : 1);
        }
        const aSafe = a[name] || "";
        const bSafe = b[name] || "";
        return aSafe.toString().localeCompare(bSafe.toString()) * (reverse ? -1 : 1);
    };

    sort = item => {
        const {filteredTeams, sortAttributes} = this.state;
        const sortedTeams = [...filteredTeams.sort(this.sortByAttribute(item.name, item.current && item.order === "down"))];
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


    search = e => {
        const query = e.target.value;
        const {institutionTeams} = this.props;
        const currentSorted = this.currentSortedAttribute();
        if (isEmpty(query)) {
            this.setState({filteredTeams: [...institutionTeams.sort(this.sortByAttribute(currentSorted.name, currentSorted.order === "up"))]});
        } else {
            const input = query.toLowerCase();
            const filteredTeams = institutionTeams.filter(team => {
                const description = team.description || "";
                return team.name.toLowerCase().indexOf(input) > -1 || description.toLowerCase().indexOf(input) > -1;
            });
            this.setState({filteredTeams: [...filteredTeams.sort(this.sortByAttribute(currentSorted.name, currentSorted.order === "up"))]});
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
                                        <a className="identifier-copy-link" data-for={tooltipId} data-tip>
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
        this.props.institutionTeamLinked(institutionTeam, value).then(() => {
            const currentSorted = this.currentSortedAttribute();
            this.setState({filteredTeams: [...this.state.filteredTeams.sort(this.sortByAttribute(currentSorted.name, currentSorted.order === "up"))]});
        });
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
                      onChange={this.linkOrUnlink(institutionTeam)}
                      readOnly={currentUserRoleInTeam(team, this.props.currentUser) === ROLES.MEMBER.role}/>
        </td>;

    renderLinkedTeamsCellReadOnlyMode = linkedTeams =>
        <td data-label={I18n.t("institution_teams.linked_teams")} className="linked-teams">
            <section className="linked-teams-container">
            {linkedTeams.map((linkedTeam, index) =>
                <NavLink key={`${linkedTeam.id}_${index}`} className="linked-team" to={`/teams/${linkedTeam.id}`}>
                    <i className="fa fa-users"></i>{linkedTeam.name}
                </NavLink>
            )}
            </section>
        </td>;

    renderTeamsTable(filteredTeams, linkedTeams, team) {
        const columns = ["name", "description", "linked"];
        const currentSorted = this.currentSortedAttribute();
        const sortColumnClassName = name => currentSorted.name === name ? "sorted" : "";

        const th = index => (
            <th key={index} className={columns[index]}>
                <span className={sortColumnClassName(columns[index])}>{I18n.t(`team_detail.${columns[index]}`)}</span>
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
        const {filteredTeams, showExplanation, sortAttributes} = this.state;
        const {team, linkedTeams, includeLegend, currentUser} = this.props;
        return (
            <div className="institution_teams">
                <LinkedInstitutionTeamsExplain
                    locale={I18n.locale}
                    productName={currentUser.productName}
                    close={() => this.setState({showExplanation: false})}
                    isVisible={showExplanation}/>
                {includeLegend && <TeamsIconLegend currentUser={this.props.currentUser}/>}

                <section className="card-institution-teams">
                    <section className="options-institution-teams">
                        <section className="search-institution-teams">
                            <div className="help" onClick={() => this.setState({showExplanation: true})}>
                                <i className="fa fa-question-circle"></i>
                                <span>{I18n.t("institution_teams.help")}</span>
                            </div>
                            <SortDropDown items={sortAttributes} sortBy={this.sort}/>
                            <input placeholder={I18n.t("institution_teams.searchPlaceHolder")} type="text"
                                   onChange={this.search}/>
                            <i className="fa fa-search"></i>
                        </section>
                    </section>
                    {this.renderTeamsTable(filteredTeams, linkedTeams, team)}
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

