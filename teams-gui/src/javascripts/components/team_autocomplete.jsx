import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import scrollIntoView from "scroll-into-view";

import {isEmpty} from "../utils/utils";

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
        return (
            <span>{name.substring(0, indexOf)}
                <span className="matched">{query}</span>{name.substring(indexOf + query.length)}
        </span>
        );
    };

    itemDescription = (item, index) => {
        const description = item.description;
        if (isEmpty(description)) {
            return "";
        }
        if (description.length > 45) {
            const id = `description${index}`;
            return (
                <span data-for={id} data-tip>
                {`${description.substring(0, Math.min(description.substring(30).indexOf(" ") + 30, 40))}...`}
                    <i className="fa fa-info-circle"></i>
                <ReactTooltip id={id} type="light" class="tool-tip" effect="solid">
                    <span>{description}</span>
                </ReactTooltip>
            </span>
            );
        }
        return description;
    };

    render() {
        const {suggestions, query, selectedTeam, itemSelected} = this.props;
        const showSuggestions = (suggestions && suggestions.length > 0);
        return (
            <section className="teams-autocomplete">
                {!showSuggestions &&
                <div className="no-results">{I18n.t("auto_complete.no_results")}</div>
                }
                {showSuggestions && <table className="result">
                    <thead>
                    <tr>
                        <th className="name">{I18n.t("teams.name")}</th>
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
                                    <td className="role">{item.role ? <span>{item.role}</span> :
                                        <span className="join">{I18n.t("teams.join")}</span>}</td>
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
    query: PropTypes.string.isRequired,
    selectedTeam: PropTypes.number.isRequired,
    itemSelected: PropTypes.func.isRequired
};


