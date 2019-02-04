import React, { Component } from "react";
import "./App.css";
// import NavBar from "./components/navbar";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Route from "react-router-dom/Route";
import Layout from "./components/layout";
import Flights from "./components/Flights/flights";
import FlightsLandingPage from "./components/Flights/flightsLandingPage";

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
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
