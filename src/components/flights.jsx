import React from "react";
// import Typography from "@material-ui/core/Typography";
// import { withStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
// import { BrowserRouter as Router, NavLink } from "react-router-dom";
// import MenuItem from "@material-ui/core/MenuItem";
// import TextField from "@material-ui/core/TextField";
// import Route from "react-router-dom/Route";
import FlightsTextFields from "./flightstextfields";
class Flights extends React.Component {
  state = {
    currentPageType: "",
    currentDomain: ''
  };
  handlePagetypeChange = e => {
    debugger
    this.setState({currentPageType: e.target.value})
  }
  handleDomainChange = e => {
    this.setState({currentDomain: e.target.value})
  }
  
  render() {
      
    return (
      <div>
        <h1>Cleartrip Flights</h1>
        <FlightsTextFields
          currentPageType = {this.state.currentPageType}
          currentDomain= {this.state.currentDomain}
          handlePagetypeChange={this.handlePagetypeChange}
          handleDomainChange={this.handleDomainChange}
        />
      </div>
    );
  }
}

export default Flights;
