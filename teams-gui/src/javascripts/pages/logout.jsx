import React from "react";
import I18n from "i18n-js";
import {logOut} from "../api";

export default class Logout extends React.PureComponent {

    componentDidMount() {
        logOut();
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className="logout">
                {I18n.t("logout.title")}<br />
                <span dangerouslySetInnerHTML={{__html: I18n.t("logout.description_html")}}/>
            </div>
        );
    }
}
