import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FlightBookingFields from "./flightBooking";
import FlightScheduleFields from "./flightSchedule";
const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});
const pageTypes = ["flight-booking", "flight-schedule", "flight-tickets"];
const languages = ["English", "Arabic"];
const domains = {
  IN: "India",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  KW: "Kuwait",
  OM: "Oman",
  QA: "Qatar",
  BH: "Bahrain"
};
const types = ["common", "unique"];

class Flights extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // currentPageType: this.props.currentPageType,
      // currentDomain: this.props.currentDomain,
      // currentLanguage: this.props.currentLanguage,
      currentPageType: "",
      currentDomain: "",
      currentLanguage: "",
      currentSubtype: "",
      categoryType: ""
    };
  }

  handleDomainChange = e => {
    this.setState({ currentDomain: e.target.value });
  };
  handleLanguageChange = e => {
    this.setState({ currentLanguage: e.target.value });
  };
  handlePagetypeChange = e => {
    this.setState({ currentPageType: e.target.value });
  };
  handleCurrentSubtype = e => {
    this.setState({ currentSubtype: e.target.value, categoryType: "" });
  };
  handleChangeCategory = e => {
    this.setState({ categoryType: e.target.value });
  };

  handleFormSubmit = e => {
    const flightValues = this.state;
  };

  render() {
    const { classes } = this.props;
    const {
      currentPageType,
      currentDomain,
      currentLanguage,
      categoryType,
      currentSubtype
    } = this.state;
    let category, fields;
    if (currentPageType === "flight-booking") {
      fields = (
        <FlightBookingFields
          handleCurrentSubtype={this.handleCurrentSubtype}
          currentSubtype={currentSubtype}
          categoryType={categoryType}
          classes={classes}
          name="flight-booking"
          handleChangeCategory={this.handleChangeCategory}
        />
      );
    } else if (currentPageType === "flight-schedule") {
      fields = (
        <FlightScheduleFields
          handleCurrentSubtype={this.handleCurrentSubtype}
          currentSubtype={this.state.currentSubtype}
          classes={classes}
          name="flight-schedule"
          categoryType={categoryType}
          handleChangeCategory={this.handleChangeCategory}
        />
      );
    }
    return (
      <div>
        <h1>Cleartrip Flights</h1>
        <form
          className={classes.container}
          noValidate
          autoComplete="off"
          action="/"
          method="POST"
          onSubmit={e => {
            e.preventDefault();
            alert("Submitted form!");
            this.props.getFlightDetails();
          }}
        >
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="domains-Label-placeholder">
              Domains
            </InputLabel>
            <Select
              value={currentDomain}
              onChange={this.handleDomainChange}
              input={<Input name="domain" id="domain-label-placeholder" />}
              displayEmpty
              name="currentDomain"
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Object.keys(domains).map(option => (
                <MenuItem key={option} value={domains[option]}>
                  {domains[option]}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="language-Label-placeholder">
              Language
            </InputLabel>
            <Select
              value={currentLanguage}
              onChange={this.handleLanguageChange}
              input={<Input name="language" id="language-label-placeholder" />}
              displayEmpty
              name="currentLanguage"
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {languages.map(option => (
                <MenuItem key={option} value={option}>
                  {" "}
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select Language</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="pageType-Label-placeholder">
              Page Type
            </InputLabel>
            <Select
              value={currentPageType}
              onChange={this.handlePagetypeChange}
              input={<Input name="pageType" id="pageType-label-placeholder" />}
              displayEmpty
              name="currentPageType"
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {pageTypes.map(option => (
                <MenuItem key={option} value={option}>
                  {" "}
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select Page Type</FormHelperText>
          </FormControl>
          {fields}
          {/* <FlightBooking
          currentSubtype={this.state.currentSubtype}
          handleCurrentSubtype={this.state.handleCurrentSubtype}
        /> */}
          <Button variant={"raised"} onClick={this.handleFormSubmit}>
            Submit
          </Button>
        </form>
      </div>
    );
  }
}

Flights.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Flights);
