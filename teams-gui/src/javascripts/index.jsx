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
import {getUser, reportError} from "./api";
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
import PublicLink from "./pages/public_link";
import NewTeam from "./pages/new_team";
import Invite from "./pages/invite";
import MissingAttributes from "./pages/missing_attributes";
import ProtectedRoute from "./components/protected_route";
import ErrorDialog from "./components/error_dialog";

import "./locale/en";
import "./locale/nl";

polyfill();

const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);

class App extends React.PureComponent {

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            currentUser: {person: {guest: true}},
            error: false,
            errorDialogOpen: false,
            errorDialogAction: () => {
                this.setState({errorDialogOpen: false});
            }
        };
        window.onerror = (msg, url, line, col, err) => {
            this.setState({errorDialogOpen: true});
            const info = err || {};
            const response = err.response || {};
            const error = {
                userAgent: navigator.userAgent,
                message: msg,
                url: url,
                line: line,
                col: col,
                error: info.message,
                stack: info.stack,
                targetUrl: response.url,
                status: response.status
            };
            reportError(error);
        };
    }

    handleBackendDown = () => {
        const location = window.location;
        const alreadyRetried = location.href.indexOf("guid") > -1;
        if (alreadyRetried) {
            window.location.href = `${location.protocol}//${location.hostname}${location.port ? ":" + location.port : ""}/error`;
        } else {
            //302 redirects from Shib are cached by the browser. We force a one-time reload
            const guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
            window.location.href = `${location.href}?guid=${guid}`;
        }
    };

    componentDidMount() {
        const location = window.location;
        if (location.href.indexOf("error") > -1) {
            this.setState({loading: false});
        } else {
            getUser()
                .catch(() => this.handleBackendDown())
                .then(currentUser => {
                    if (!currentUser || !currentUser.person) {
                        this.handleBackendDown();
                    } else {
                        this.setState({loading: false, currentUser: currentUser});
                    }
                });
        }
    }

    render() {
        const {loading, errorDialogAction, errorDialogOpen} = this.state;

        if (loading) {
            return null; // render null when app is not ready yet
        }
        const {currentUser} = this.state;
        if (!currentUser.person.id) {
            return <MissingAttributes currentUser={currentUser}/>;
        }
        return (
            <Router>
                <div>
                    <div>
                        <Flash/>
                        <Header currentUser={currentUser}/>
                        <Navigation currentUser={currentUser}/>
                        <ErrorDialog isOpen={errorDialogOpen}
                                     close={errorDialogAction}/>
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
                        <Route path="/public/:key"
                               render={props => <PublicLink {...props}/>}/>
                        <Route path="/error"
                               render={props => <ServerError currentUser={currentUser} {...props}/>}/>
                        <ProtectedRoute path="/new-team"
                                        guest={currentUser.person.guest}
                                        render={props => <NewTeam currentUser={currentUser} {...props}/>}/>
                        <ProtectedRoute path="/invite/:teamId/:id?"
                                        guest={currentUser.person.guest}
                                        render={props => <Invite currentUser={currentUser} {...props}/>}/>

                        <Route render={() => <NotFound currentUser={currentUser}/> }/>
                    </Switch>
                    {currentUser.config && <Footer currentUser={currentUser} isEn={I18n.locale === "en"}/>}
                </div>
            </Router>
        );
    }

}

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

render(<App/>, document.getElementById("app"));