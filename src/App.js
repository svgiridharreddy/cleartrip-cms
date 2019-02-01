import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
// import NavBar from "./components/navbar";
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";

import Index from './components/hotels/index.jsx';
import Layout from "./components/layout";
import Flights from "./components/flights";

import "typeface-roboto";

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/flights" component={ Flights } />
            <Route exact path="/hotels" component={ Index } />
          </Switch>
        </Layout>
      </Router>
    );
  }
}

export default App;
