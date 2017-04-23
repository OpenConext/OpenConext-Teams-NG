import React from "react";
import I18n from "i18n-js";
import PropTypes from "prop-types";

export default function TeamAutocomplete({suggestions, query, selectedTeam, itemSelected}) {
    const name = item => {
        const name = item.name;
        const nameToLower = name.toLowerCase();
        const indexOf = nameToLower.indexOf(query.toLowerCase());
        return (
            <span>
                {name.substring(0, indexOf)}<span className="matched">{query}</span>{name.substring(indexOf + query.length)}
            </span>
        );
    };
    return (
        <section className="teams-autocomplete">
            {(!suggestions || suggestions.length === 0) &&
            <div className="no-results">{I18n.t("auto_complete.no_results")}</div>
            }
            <ul>
                {suggestions.map((item, index) => (
                        <li key={index}
                            className={selectedTeam === index ? "active" : ""}
                            onClick={() => itemSelected(item)}>
                            {name(item)}
                            {item.role && <span className="role">{item.role}</span>}
                        </li>
                    )
                )}
            </ul>
        </section>
);

}

TeamAutocomplete.propTypes = {
    suggestions: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired,
    selectedTeam: PropTypes.number.isRequired,
    itemSelected: PropTypes.func.isRequired
};


