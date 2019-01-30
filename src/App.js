import React, { Component } from "react";
import "./App.css";
// import NavBar from "./components/navbar";
import {
  BrowserRouter as Router,
  NavLink,
  Link,
  Switch
} from "react-router-dom";
import Route from "react-router-dom/Route";
import Layout from "./components/layout";
import Flights from "./components/flights";
import Hotels from "./components/hotels";

import "typeface-roboto";

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/flights" component={Flights} />
            <Route exact path="/hotels" component={Hotels} />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
