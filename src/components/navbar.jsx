import React, { Component } from "react";
// import FlightBooking from "./components/flightbooking";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";
import { BrowserRouter as Router, NavLink, Link } from "react-router-dom";

import Route from "react-router-dom/Route";
import Flights from "../components/Flights/flights";
// import "../stylesheets/navbar.css";

class NavBar extends Component {
  render() {
    const CustomAppBar = withStyles({
      root: { background: "#ff7e33" }
    })(AppBar);
    const CustomButton = withStyles({
      label: {
        textTransform: "none",
        textDecoration: "none",
        color: "white",
        fontSize: 18
      }
    })(Button);
    const CustomNavLink = withStyles({})(NavLink);

    return (
      <Router>
        <div>
          <CustomAppBar position="static">
            <Toolbar>
              <CustomNavLink to="/hotels">
                <CustomButton>Hotels</CustomButton>
              </CustomNavLink>
              <CustomNavLink to="/flights">
                <CustomButton>Flights</CustomButton>
              </CustomNavLink>
              <CustomNavLink to="/trains">
                <CustomButton>Trains</CustomButton>
              </CustomNavLink>
            </Toolbar>
          </CustomAppBar>
          <Route
            path="/hotels"
            exact
            strict
            render={() => {
              return <h1>Hotels</h1>;
            }}
          />
          <Route path="/flights" exact strict component={Flights} />
          <Route
            path="/trains"
            exact
            strict
            render={() => {
              return <h1>Trains</h1>;
            }}
          />
        </div>
      </Router>
    );
  }
}

export default NavBar;
