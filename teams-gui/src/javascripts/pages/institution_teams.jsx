import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import CopyToClipboard from "react-copy-to-clipboard";
import {linkedTeams} from "../api";
import {isEmpty, stop} from "../utils/utils";
import {clearFlash} from "../utils/flash";

export default class InstitutionTeams extends React.Component {

    constructor(props) {
        super(props);
        const institutionTeams = [...(props.currentUser.externalTeams || [])].sort((a, b) => a.name.localeCompare(b.name));
        this.state = {
            institutionTeams: institutionTeams,
            filteredTeams: institutionTeams,
            linkedTeams: {},
            copiedToClipboard: {},
        };
    }

    componentWillMount = () => {
        clearFlash();
        linkedTeams().then(linked => this.setState({linkedTeams: linked}));
    };

    showTeam = team => e => {
        stop(e);
        this.props.history.push("/teams/" + team.id);
    };

    search = e => {
        const query = e.target.value;
        const {institutionTeams} = this.state;
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

    renderIconLegend = () => {
        return (
            <div className="icon-legend">
                <section className="roles">
                    <span className="role" ><i className="fa fa-building-o"></i>{I18n.t("institution_teams.institution_team")}</span>
                    <span className="role" ><i className="fa fa-users"></i>{this.props.currentUser.productName}</span>
                </section>
            </div>);

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

    renderLinkedTeamsCell = linkedTeams =>
        <td data-label={I18n.t("institution_teams.linked_teams")} className="linked-teams">
            {linkedTeams.map((team, index) =>
                <a key={`${team.id}_${index}`} className="linked-team" href=""
                   onClick={this.showTeam(team)}><i className="fa fa-users"></i>{team.name}</a>
            )}
        </td>;


    renderTeamsTable(filteredTeams, linkedTeams) {
        const columns = ["name", "description", "linked_teams"];
        const th = index => (
            <th key={index} className={columns[index]}>
                <span>{I18n.t(`institution_teams.${columns[index]}`)}</span>
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
                            {this.renderLinkedTeamsCell(linkedTeams[team.identifier] || [])}
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
        const {filteredTeams, linkedTeams} = this.state;
        return (
            <div className="institution_teams">
                {this.renderIconLegend()}
                <section className="card">
                    <section className="options">
                        <section className="search">
                            <input placeholder={I18n.t("institution_teams.searchPlaceHolder")}
                                   type="text"
                                   onChange={this.search}/>
                            <i className="fa fa-search"></i>
                        </section>
                    </section>
                    {this.renderTeamsTable(filteredTeams, linkedTeams)}
                </section>
            </div>
        );
    }
}

InstitutionTeams.propTypes = {
    history: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired
};

