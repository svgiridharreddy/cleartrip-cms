import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Index from './components/hotels/index';
import HotelUniqueContent from './components/hotels/unique/AddHotelUniqueContent';
import ViewUniqueHotelData from './components/hotels/unique/ViewHotelUniqueData';
import EditUniqueContent from './components/hotels/unique/EditHotelUniqueData';
import HotelCommonContent from './components/hotels/common/HotelCommonContent';
import ViewCommonHotelData from './components/hotels/common/ViewCommonHotelData';
import EditCommonContent from './components/hotels/common/EditCommonContent';


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

            <Route exact path="/hotels" component={Index} />
            <Route
              exact
              path="/hotels/addUniqueData"
              component={HotelUniqueContent}
            />
            <Route
              path="/hotels/show/uniquedata/:id"
              component={ViewUniqueHotelData}
            />
            <Route
              path="/hotels/edit/uniquedata/:id"
              component={EditUniqueContent}
            />
            <Route
              exact
              path="/hotels/addCommonData"
              component={HotelCommonContent}
            />
            <Route
              path="/hotels/show/commondata/:id"
              component={ViewCommonHotelData}
            />
            <Route
              path="/hotels/edit/commondata/:id"
              component={EditCommonContent}
            />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
