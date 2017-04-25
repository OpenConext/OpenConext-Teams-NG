import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";

import {isEmpty} from "../utils/utils";

const itemName = (item, query) => {
    const name = item.name;
    const nameToLower = name.toLowerCase();
    const indexOf = nameToLower.indexOf(query.toLowerCase());
    return (
        <span>{name.substring(0, indexOf)}
            <span className="matched">{query}</span>{name.substring(indexOf + query.length)}
        </span>
    );
};

const itemDescription = (item, index) => {
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

export default function TeamAutocomplete({suggestions, query, selectedTeam, itemSelected}) {
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
                                onClick={() => itemSelected(item)}>
                                <td>{itemName(item, query)}</td>
                                <td>{itemDescription(item, index)}</td>
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

TeamAutocomplete.propTypes = {
    suggestions: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired,
    selectedTeam: PropTypes.number.isRequired,
    itemSelected: PropTypes.func.isRequired
};


