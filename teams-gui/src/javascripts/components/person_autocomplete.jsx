import React from "react";
import PropTypes from "prop-types";
import scrollIntoView from "scroll-into-view";

export default class PersonAutocomplete extends React.PureComponent {

    componentDidUpdate(prevProps) {
        if (this.selectedRow && prevProps.selectedPerson !== this.props.selectedPerson) {
            scrollIntoView(this.selectedRow);
        }
    }

    matchedPart = (value, query, index, email = false) => {
        const toLower = value.toLowerCase();
        const indexOf = toLower.indexOf(query.toLowerCase());

        return indexOf > -1 ?
            <span key={`${email ? "email" : "name"}_${index}`}>
                {(email ? "<" : "") + value.substring(0, indexOf)}
                <span className="matched">{query}</span>
                {value.substring(indexOf + query.length) + (email ? ">" : "")}
            </span> :
            <span key={`${email ? "email" : "name"}_${index}`}>{(email ? " <" : "") + value + (email ? ">" : "")}</span>;
    };

    render() {
        const {suggestions, query, selectedPerson, itemSelected} = this.props;
        if (!suggestions || suggestions.length < 1) {
            return null;
        }
        return (
            <section className="persons-autocomplete">
                {suggestions
                    .filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                                    item.email.toLowerCase().indexOf(query.toLowerCase()) > -1)
                    .map((item, index) =>
                            <span key={index}
                                  className={selectedPerson === index ? "active row" : "row"}
                                  onClick={() => itemSelected(item)}
                                  ref={ref => {
                                      if (selectedPerson === index) {
                                          this.selectedRow = ref;
                                      }
                                  }}>
                                {[this.matchedPart(item.name, query, index), this.matchedPart(item.email, query, index, true)]}
                            </span>
                    )}
            </section>
        );
    }

}

PersonAutocomplete.propTypes = {
    suggestions: PropTypes.array.isRequired,
    query: PropTypes.string.isRequired,
    selectedPerson: PropTypes.number.isRequired,
    itemSelected: PropTypes.func.isRequired
};


