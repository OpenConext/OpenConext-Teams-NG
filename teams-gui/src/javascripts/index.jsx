import "../favicon.ico";
import "../stylesheets/application.scss";
import {polyfill} from "es6-promise";
import "isomorphic-fetch";
import "lodash";

import React from "react";
import {render} from "react-dom";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import I18n from "i18n-js";

import {getUser} from "./api";
import QueryParameter from "./utils/query-parameters";
import {isEmpty} from "./utils/utils";

import NotFound from "./pages/not_found";
import Footer from "./components/footer";
import Header from "./components/header";
import Navigation from "./components/navigation";
import MyTeams from "./pages/my_teams";
import TeamDetail from "./pages/team_detail";

import "./locale/en";
import "./locale/nl";
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
                    </div>
                    <Switch>
                        <Route exact path="/" render={() => {
                            return <Redirect to="/my-teams"/>;
                        }}/>
                        <Route path="/my-teams" component={MyTeams}/>
                        <Route path="/teams/:id" render={(props) => <TeamDetail currentUser={currentUser} {...props}/>} />
                        <Route component={NotFound}/>
                    </Switch>
                    <Footer />
                </div>
            </Router>
        );
    }

}

function determineLanguage() {
    let parameterByName = QueryParameter.getParameterByName("lang");

    if (isEmpty(parameterByName)) {
        parameterByName = navigator.language.startsWith("en") ? "en" : "nl";
    }

    I18n.locale = parameterByName;
}

determineLanguage();

getUser().catch(e => {
    render(<NotFound />, document.getElementById("app"));
    throw e;
}).then(currentUser => {
    if (!currentUser) {
        render(<NotFound />, document.getElementById("app"));
    } else {
        render(<App currentUser={currentUser}/>, document.getElementById("app"));
    }
});
