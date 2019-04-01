import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Index from './components/hotels/index';
import HotelsApprovalPending from './components/hotels/HotelsApprovalPending';
import Layout from "./components/layout";
// import Flights from "./components/Flights/Flights";
import Banner from "./components/banner/BannerLanding";
import FlightsHomePage from "./components/Flights/FlightsHomePage";
import FlightsApprovalPending from './components/Flights/FlightsApprovalPending1'
import LandingPage from "./components/LandingPage"
import "typeface-roboto";
import loginHelpers from "./components/helper";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

import "../node_modules/react-notifications/lib/notifications.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: false
    };
  }
  componentDidMount = () => {
    if (loginHelpers.checkUser()) {
      this.setState({
        loginStatus: true
      });
    }
  };
  render() {
    let { loginStatus } = this.state;
    return (
      <div>
        <Router>
          <Layout>
            {loginStatus ? (
              <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/flights" component={FlightsHomePage} />
                <Route exact path="/hotels" component={Index} />
                {/* <Route exact path="/banners" component={Banner} /> */}
                <Route exact path="/flights-approve" component={FlightsApprovalPending} />
                <Route exact path="/hotels-approve" component={HotelsApprovalPending} />
              </Switch>
            ) : (
                ""
              )}
          </Layout>
        </Router>
        <NotificationContainer />
      </div>
    );
  }
}

export default App;
