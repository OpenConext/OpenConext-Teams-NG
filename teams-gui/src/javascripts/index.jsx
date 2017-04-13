import "../favicon.ico";
import "../stylesheets/application.scss";
import { polyfill } from "es6-promise";
polyfill();

import "isomorphic-fetch";
import "lodash";

import React from "react";
import { render } from "react-dom";
import Router from "react-router/BrowserRouter";
import Match from "react-router/Match";
import Redirect from "react-router/Redirect";
import Miss from "react-router/Miss";
import Cookies from "js-cookie";
import I18n from "i18n-js";

import { getUser } from "./api";
import QueryParameter from "./utils/query-parameters";

import NotFound from "./pages/not_found";
import Footer from "./components/footer";
import Header from "./components/header";
import Navigation from "./components/navigation";
import MyTeams from "./pages/my_teams";

import "./locale/en";
import "./locale/nl";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      currentUser: null
    };
  }

  componentWillMount() {
    this.setState({ currentUser: this.props.currentUser });
  }

  getChildContext() {
    return {
      currentUser: this.state.currentUser
    };
  }

  render() {
    return (
      <Router>
        <div>
          <div className="header">
            <Header />
            <Navigation />
          </div>

          <Match exactly pattern="/" render={() => {
            return <Redirect to="/my-teams" />;
          }} />
          <Match exactly pattern="/my-teams" component={MyTeams} />
          <Miss component={NotFound} />
          <Footer />
        </div>
      </Router>
    );
  }

}

App.childContextTypes = {
  currentUser: React.PropTypes.object,
  router: React.PropTypes.object
};

App.propTypes = {
  currentUser: React.PropTypes.shape({
  })
};

function determineLanguage() {
  let parameterByName = QueryParameter.getParameterByName("lang");

  if (_.isEmpty(parameterByName)) {
    parameterByName = Cookies.get("lang");
  }

  I18n.locale = parameterByName ? parameterByName : "en";
}

determineLanguage();

getUser().catch(e => {
  render(<NotFound />, document.getElementById("app"));
  throw e;
}).then(currentUser => {
  if (!currentUser) {
    render(<NotFound />, document.getElementById("app"));
  } else {
    render(<App currentUser={currentUser} />, document.getElementById("app"));
  }
});
