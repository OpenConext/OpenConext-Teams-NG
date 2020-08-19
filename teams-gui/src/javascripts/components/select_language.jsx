import React from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import "react-select/dist/react-select.css";
import {languageOptions} from "../constants/languages";


export default class SelectLanguage extends React.PureComponent {


    renderOption = option => {
        return (
            <span className="select-option">
                <img src={option.src}/>
                <span className="select-label">{option.label}</span>
            </span>
        );
    };

    filterLanguages = supportedLanguageCodes => {
        return languageOptions.filter(option => supportedLanguageCodes.indexOf(option.code) > -1);
    }

    render() {
        const {onChange, language, disabled, supportedLanguageCodes} = this.props;
        return <Select className="select-language"
                       onChange={onChange}
                       optionRenderer={this.renderOption}
                       options={this.filterLanguages(supportedLanguageCodes.split(","))}
                       value={language}
                       searchable={false}
                       valueRenderer={this.renderOption}
                       disabled={disabled}/>;
    }


}

SelectLanguage.propTypes = {
    onChange: PropTypes.func.isRequired,
    language: PropTypes.object.isRequired,
    supportedLanguageCodes: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
};


