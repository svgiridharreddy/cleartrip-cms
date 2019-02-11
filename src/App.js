import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Index from './components/hotels/index';
import HotelUniqueContent from './components/hotels/addHotelUniqueContent';
import HotelCommonContent from './components/hotels/HotelCommonContent';
import ViewUniqueHotelData from './components/hotels/viewHotelUniqueData';
import EditUniqueContent from './components/hotels/editHotelUniqueData';

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
            <Route exact path="/flights" component = { Flights } />
            <Route path="/flights/home" component={FlightsLandingPage} />
            <Route exact path="/hotels" component = { Index } />
            <Route exact path="/hotels/addUniqueData" component = { HotelUniqueContent } />
            <Route exact path="/hotels/addCommonData" component = { HotelCommonContent } />
            <Route path="/hotels/show/uniquedata/:id" component = { ViewUniqueHotelData } />
            <Route path="/hotels/edit/uniquedata/:id" component = { EditUniqueContent } />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
