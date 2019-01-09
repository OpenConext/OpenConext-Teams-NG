import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import "react-select/dist/react-select.css";

import nlFlag from "../../images/nl_flag.png";
import enFlag from "../../images/en_flag.png";
import ptFlag from "../../images/pt_flag.png";

const languageOptions = [
    {value: "DUTCH", label: "Nederlands"},
    {value: "ENGLISH", label: "English"},
    {value: "PORTUGUES", label: "Português"}
];

export default class SelectLanguage extends React.PureComponent {


    renderOption = option => {
        return (
            <span className="select-option">
                {option.value === "ENGLISH" ? <img src={enFlag}/> : option.value === "DUTCH" ? <img src={nlFlag}/> : <img src={ptFlag}/>}
                <span className="select-label">{option.label}</span>
            </span>
        );
    };

    render() {
        const {onChange, language, disabled} = this.props;
        return <Select className="select-language"
                       onChange={onChange}
                       optionRenderer={this.renderOption}
                       options={languageOptions}
                       value={language}
                       searchable={false}
                       valueRenderer={this.renderOption}
                       disabled={disabled}/>;
    }


}

SelectLanguage.propTypes = {
    onChange: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};


