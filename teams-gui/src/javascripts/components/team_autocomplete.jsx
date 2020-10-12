import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import scrollIntoView from "scroll-into-view";
import TeamDescriptionTooltip from "./team_description_tooltip";

export default class TeamAutocomplete extends React.PureComponent {

    componentDidUpdate(prevProps) {
        if (this.selectedRow && prevProps.selectedTeam !== this.props.selectedTeam) {
            scrollIntoView(this.selectedRow);
        }
    }

    itemName = (item, query) => {
        const name = item.name;
        const nameToLower = name.toLowerCase();
        const indexOf = nameToLower.indexOf(query.toLowerCase());
        const first = name.substring(0, indexOf);
        const middle = name.substring(indexOf, indexOf + query.length);
        const last = name.substring(indexOf + query.length);
        return <span>{first}<span className="matched">{middle}</span>{last}</span>;
    };

    itemDescription = (item, index) => {
        return <TeamDescriptionTooltip mdDescription={item.description} index={`description${index}`}/>;
    };

    render() {
        const {suggestions, query, selectedTeam, itemSelected, hasMoreResults, superAdminModus} = this.props;
        const showSuggestions = (suggestions && suggestions.length > 0);
        return (
            <section className="teams-autocomplete">
                {!showSuggestions &&
                <div className="no-results">{I18n.t("auto_complete.no_results")}</div>
                }
                {(showSuggestions && hasMoreResults) &&
                <div className="has-more-reesults">{I18n.t("teams_autocomplete.results_limited")}</div>}
                {showSuggestions && <table className="result">
                    <thead>
                    <tr>
                        <th className="name">{I18n.t("teams_autocomplete.name")}</th>
                        <th className="description">{I18n.t("teams.description")}</th>
                        <th className="role"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {suggestions
                        .filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1)
                        .map((item, index) => (
                                <tr key={index}
                                    className={selectedTeam === index ? "active" : ""}
                                    onClick={() => itemSelected(item)}
                                    ref={ref => {
                                        if (selectedTeam === index) {
                                            this.selectedRow = ref;
                                        }
                                    }}>
                                    <td>{this.itemName(item, query)}</td>
                                    <td>{this.itemDescription(item, index)}</td>
                                    <td className="role">{superAdminModus ? <span>{I18n.t("teams.view")}</span> :
                                        item.role ? <span>{item.role}</span> :
                                            <span className="join">{I18n.t("teams.join")}</span>}
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>}
            </section>
        );
    }

}

TeamAutocomplete.propTypes = {
    suggestions: PropTypes.array.isRequired,
    hasMoreResults: PropTypes.bool.isRequired,
    superAdminModus: PropTypes.bool.isRequired,
    query: PropTypes.string.isRequired,
    selectedTeam: PropTypes.number.isRequired,
    itemSelected: PropTypes.func.isRequired
};


