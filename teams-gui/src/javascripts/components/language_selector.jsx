import React from "react";
import I18n from "i18n-js";
import Cookies from "js-cookie";
import QueryParameter from "../utils/query-parameters";
import {stop} from "../utils/utils"

class LanguageSelector extends React.Component {
  render() {
    return (
      <ul className="language-selector">
        {[
          this.renderLocaleChooser("en"),
          this.renderLocaleChooser("nl")
        ]}
      </ul>
    );
  }

  renderLocaleChooser(locale) {
    return (
      <li key={locale} className={I18n.currentLocale() === locale ? "active" : ""}>
        <a href="#" title={I18n.t("select_locale", { locale: locale })}
          onClick={this.handleChooseLocale(locale)}>
          {I18n.t("code", { locale: locale })}
        </a>
      </li>
    );
  }

  handleChooseLocale = (locale) => {
    return function(e) {
      stop(e);
      Cookies.set("lang", locale, { expires: 356, secure: document.location.protocol.endsWith("https") });
      I18n.locale = locale;
      const newSearch = QueryParameter.replaceQueryParameter("lang", locale);
      window.location.search = newSearch;
    };
  }
}

export default LanguageSelector;
