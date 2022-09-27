import {stopEvent} from "../utils/utils";
import I18n from "i18n-js";
import Cookies from "js-cookie";
import "./Footer.scss";
import logo from "../images/logo.svg";

export const Footer = ({user}) => {

    const changeLanguage = lang => e => {
        stopEvent(e);
        Cookies.set("lang", lang, {expires: 356, secure: document.location.protocol.endsWith("https:")});
        I18n.locale = lang;
        document.documentElement.setAttribute("lang", lang);
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set("lang", lang);
        window.location.search = urlSearchParams.toString();
    };

    return (
        <nav aria-label="site info" className="footer-container">
            <div className="footer">
                <ul className="info">
                    <li dangerouslySetInnerHTML={{
                        __html: I18n.t("footer.faq")
                    }}/>
                    <li dangerouslySetInnerHTML={{
                        __html: I18n.t("footer.terms")
                    }}/>
                    <li dangerouslySetInnerHTML={{
                        __html: I18n.t("footer.privacy")
                    }}/>
                </ul>
                <nav className="lang" aria-label="lang">
                    <ul>
                        {user.config.supportedLanguageCodes.split(",")
                            .map(lang => lang.trim())
                            .map(lang => <li key={lang}>
                                <a className={I18n.currentLocale() === lang ? "active" : ""}
                                   hrefLang={`${lang}`}
                                   href={`/${lang}`}
                                   onClick={changeLanguage(lang)}>
                                    {I18n.t("code", {locale: lang})}
                                </a></li>)
                        }
                    </ul>
                </nav>
                <div className="info right">
                    <img src={logo} alt="SURF Logo" aria-hidden="true"/>
                </div>
            </div>
        </nav>
    );
}