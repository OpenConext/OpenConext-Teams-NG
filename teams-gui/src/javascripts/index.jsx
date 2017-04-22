import "../favicon.ico";
import "../stylesheets/application.scss";
import {polyfill} from "es6-promise";
import "isomorphic-fetch";
import "lodash";

import React from "react";
import {render} from "react-dom";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import I18n from "i18n-js";
import Cookies from "js-cookie";
import {getUser} from "./api";
import QueryParameter from "./utils/query-parameters";
import {isEmpty} from "./utils/utils";

import NotFound from "./pages/not_found";
import ServerError from "./pages/server_error";
import Footer from "./components/footer";
import Header from "./components/header";
import Flash from "./components/flash";
import Navigation from "./components/navigation";
import MyTeams from "./pages/my_teams";
import TeamDetail from "./pages/team_detail";

import "./locale/en";
import "./locale/nl";
import PropTypes from "prop-types";
polyfill();

class App extends React.Component {

    render() {
        const {currentUser} = this.props;
        return (
            <Router>
                <div>
                    <div className="header">
                        <Header currentUser={currentUser}/>
                        <Navigation currentUser={currentUser}/>
                        <Flash/>
                    </div>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/my-teams"/>}/>
                        <Route path="/my-teams"
                               render={props => <MyTeams currentUser={currentUser} {...props}/>}/>
                        <Route path="/teams/:id"
                               render={props => <TeamDetail currentUser={currentUser} {...props}/>}/>
                        <Route component={NotFound}/>
                    </Switch>
                    <Footer />
                </div>
            </Router>
        );
    }

}

App.propTypes = {
    currentUser: PropTypes.object.isRequired
};

function determineLanguage() {
    let parameterByName = QueryParameter.getParameterByName("lang");

    if (isEmpty(parameterByName)) {
        const lang = navigator.language.toLowerCase();
        parameterByName = lang.startsWith("en") ? "en" : lang.startsWith("nl") ? "nl" : undefined;
    }

    if (isEmpty(parameterByName)) {
        parameterByName = Cookies.get("lang");
        parameterByName = isEmpty(parameterByName) ? "en" : parameterByName;
    }

    I18n.locale = parameterByName;
}

determineLanguage();

getUser().catch(e => {
    render(<ServerError />, document.getElementById("app"));
    throw e;
}).then(currentUser => {
    if (!currentUser) {
        render(<ServerError />, document.getElementById("app"));
    } else {
        render(<App currentUser={currentUser}/>, document.getElementById("app"));
    }
});
