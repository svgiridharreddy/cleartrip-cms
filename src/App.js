import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Index from './components/hotels/index';
import Layout from "./components/layout";
import Flights from "./components/Flights/Flights";
import Banner from "./components/banner/BannerLanding";
import FlightsHomePage from "./components/Flights/FlightsHomePage";

import "typeface-roboto";

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={FlightsHomePage} />
            <Route exact path="/flights" component={Flights} />
            <Route exact path="/flights/home" component={FlightsHomePage} />
            <Route exact path="/hotels" component={Index} />
            <Route exact path="/banners" component={Banner} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
