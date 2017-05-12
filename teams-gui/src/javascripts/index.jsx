import "../favicon.ico";
import "../stylesheets/application.scss";
import {polyfill} from "es6-promise";
import "isomorphic-fetch";
import "lodash";
import moment from "moment";

import React from "react";
import {render} from "react-dom";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import I18n from "i18n-js";
import Cookies from "js-cookie";
import {getUser} from "./api";
import {getParameterByName} from "./utils/query-parameters";
import {isEmpty} from "./utils/utils";

import NotFound from "./pages/not_found";
import ServerError from "./pages/server_error";
import Footer from "./components/footer";
import Header from "./components/header";
import Flash from "./components/flash";
import Navigation from "./components/navigation";
import MyTeams from "./pages/my_teams";
import InstitutionTeams from "./pages/institution_teams";
import TeamDetail from "./pages/team_detail";
import JoinRequest from "./pages/join_request";
import Invitation from "./pages/invitation";
import NewTeam from "./pages/new_team";
import Invite from "./pages/invite";
import ProtectedRoute from "./components/protected_route";

import "./locale/en";
import "./locale/nl";
import PropTypes from "prop-types";
polyfill();

const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

class App extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.setState({loading: false});
    }

    render() {
        const {loading} = this.state;

        if (loading) {
            return null; // render null when app is not ready yet
        }

        const {currentUser} = this.props;
        return (
            <Router>
                <div>
                    <div>
                        <Flash/>
                        <Header currentUser={currentUser}/>
                        <Navigation currentUser={currentUser}/>
                    </div>
                    <Switch>
                        <Route exact path="/" render={() => <Redirect to="/my-teams"/>}/>
                        <Route path="/my-teams"
                               render={props => <MyTeams currentUser={currentUser} {...props}/>}/>
                        <Route path="/teams/:id"
                               render={props => <TeamDetail currentUser={currentUser} {...props}/>}/>
                        <Route path="/institution-teams"
                               render={props => <InstitutionTeams currentUser={currentUser} {...props}/>}/>
                        <Route path="/join-requests/:teamId/:id?"
                               render={props => <JoinRequest {...props}/>}/>
                        <Route path="/invitation/:action/:key"
                               render={props => <Invitation {...props}/>}/>
                        <ProtectedRoute path="/new-team"
                                        guest={currentUser.person.guest}
                                        render={props => <NewTeam currentUser={currentUser} {...props}/>}/>
                        <ProtectedRoute path="/invite/:teamId/:id?"
                                        guest={currentUser.person.guest}
                                        render={props => <Invite {...props}/>}/>
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

(() => {
    // DetermineLanguage based on parameter, navigator and finally cookie
    let parameterByName = getParameterByName("lang", window.location.search);

    if (isEmpty(parameterByName)) {
        const lang = navigator.language.toLowerCase();
        parameterByName = lang.startsWith("en") ? "en" : lang.startsWith("nl") ? "nl" : undefined;
    }

    if (isEmpty(parameterByName)) {
        parameterByName = Cookies.get("lang");
        parameterByName = isEmpty(parameterByName) ? "en" : parameterByName;
    }

    I18n.locale = parameterByName;
    moment.locale(I18n.locale);
})();

getUser().catch(e => {
    if (document.location.href.indexOf("guid") > -1) {
        render(<ServerError />, document.getElementById("app"));
        throw e;
    }
    //302 redirects from Shib are cached by the browser. We force a one-time reload
    const guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
    document.location = document.location + "?guid=" + guid;
    throw e;
}).then(currentUser => {
    if (!currentUser) {
        render(<ServerError />, document.getElementById("app"));
    } else {
        render(<App currentUser={currentUser}/>, document.getElementById("app"));
    }
});
