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
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set("lang", lang);
        window.location.search = urlSearchParams.toString();
    };

    return (
        <div className="footer-container">
            <div className="footer">
                <div className="info">
                    <span dangerouslySetInnerHTML={{
                        __html: I18n.t("footer.faq")
                    }}/>
                    <span dangerouslySetInnerHTML={{
                        __html: I18n.t("footer.terms")
                    }}/>
                    <span dangerouslySetInnerHTML={{
                        __html: I18n.t("footer.privacy")
                    }}/>
                </div>
                <div className="lang">
                    {user.config.supportedLanguageCodes.split(",")
                        .map(lang => lang.trim())
                        .map(lang => <a key={lang} className={I18n.currentLocale() === lang ? "active" : ""}
                                        href={`/${lang}`} title={I18n.t("select_locale", {locale: lang})}
                                        onClick={changeLanguage(lang)}>
                            {I18n.t("code", {locale: lang})}
                        </a>)
                    }
                </div>
                <div className="info right">
                    <img src={logo} alt="logo"/>
                </div>
            </div>
        </div>
    );
}