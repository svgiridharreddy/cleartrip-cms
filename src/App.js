import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Index from './components/hotels/index.jsx';
import Layout from "./components/layout";
import Flights from "./components/Flights/flights";
import FlightsLandingPage from "./components/Flights/flightsLandingPage";
import BannerLanding from "./components/banner/BannerLanding";

import "typeface-roboto";

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>

            <Route exact path="/" component={FlightsLandingPage} />
            <Route exact path="/flights" component={Flights} />
            <Route path="/flights/home" component={FlightsLandingPage} />
            <Route path="/banners" component={BannerLanding} />

             />
            <Route exact path="/hotels" component={ Index } />

          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
