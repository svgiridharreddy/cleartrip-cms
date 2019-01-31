import React, { Component } from "react";
// import ReactDom from "react-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FilledInput from "@material-ui/core/FilledInput";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

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

class FlightsTextFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPageType: this.props.currentPageType,
      currentDomain: this.props.currentDomain,
      currentLanguage: this.props.currentLanguage,
      currentSubtype: ""
    };
  }
  getFormData = formprops => {
    debugger;
  };
  render() {
    const {
      classes,
      currentPageType,
      handlePagetypeChange,
      currentDomain,
      handleDomainChange,
      currentLanguage,
      handleLanguageChange
    } = this.props;
    debugger;
    return (
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
            onChange={handleDomainChange}
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
            onChange={handleLanguageChange}
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
            onChange={handlePagetypeChange}
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
      </form>
    );
  }
}

FlightsTextFields.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlightsTextFields);
