import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Index from './components/hotels/index';
import HotelUniqueContent from './components/hotels/HotelUniqueContent';
import HotelCommonContent from './components/hotels/HotelCommonContent';

import Layout from "./components/layout";
import Flights from "./components/Flights/flights";

import "typeface-roboto";

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/flights" component = { Flights } />
            <Route exact path="/hotels" component = { Index } />
            <Route exact path="/hotels/addUniqueData" component = { HotelUniqueContent} />
            <Route exact path="/hotels/addCommonData" component = { HotelCommonContent} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
