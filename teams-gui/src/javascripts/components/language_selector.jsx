import React from "react";
import I18n from "i18n-js";
import Cookies from "js-cookie";
import {replaceQueryParameter} from "../utils/query-parameters";
import {stop} from "../utils/utils";
import moment from "moment";
import PropTypes from "prop-types";

export default class LanguageSelector extends React.PureComponent {

    render() {
        const languageCodes = this.props.supportedLanguageCodes.split(",").map(s => s.trim());
        return (
            <ul className="language-selector">
                {languageCodes.map(code => this.renderLocaleChooser(code))}
            </ul>
        );
    }

    renderLocaleChooser(locale) {
        return (
            <li key={locale} className={I18n.currentLocale() === locale ? "active" : ""}>
                <a title={I18n.t("select_locale", {locale: locale})}
                   onClick={this.handleChooseLocale(locale)}>
                    {I18n.t("code", {locale: locale})}
                </a>
            </li>
        );
    }

    handleChooseLocale = locale => e => {
        stop(e);
        Cookies.set("lang", locale, {expires: 356, secure: document.location.protocol.endsWith("https:")});
        I18n.locale = locale;
        moment.locale(locale);
        window.location.search = replaceQueryParameter(window.location.search, "lang", locale);
    };
}

LanguageSelector.propTypes = {
    supportedLanguageCodes: PropTypes.string.isRequired
};
