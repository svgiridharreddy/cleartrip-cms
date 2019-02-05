import React, { Component } from "react";
// import ReactDom from "react-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
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
const languages = { en: "Eglish", ar: "Arabic" };
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
      currentPageType: "",
      currentDomain: "",
      currentLanguage: ""
    };
  }
  handleChange = event => {
    debugger;
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    return (
      <form className={classes.container} noValidate autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="age-Label-placeholder">
            Domain
          </InputLabel>
          <Select
            value={this.state.currentDomain}
            onChange={this.handleChange}
            input={<Input name="age" id="age-label-placeholder" />}
            displayEmpty
            name="currentDomain"
            className={classes.selectEmpty}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={"IN"}>India</MenuItem>
            <MenuItem value={"AE"}>UAE</MenuItem>
            <MenuItem value={"SA"}>Saudi Arabia</MenuItem>
            <MenuItem value={"KW"}>Kwait</MenuItem>
          </Select>
          <FormHelperText>Label + placeholder</FormHelperText>
        </FormControl>
      </form>
    );
  }
}

FlightsTextFields.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FlightsTextFields);
