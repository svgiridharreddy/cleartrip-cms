import React, { Component } from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";

class FlightScheduleFields extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let subTypeField;
    const { classes } = this.props;
    debugger;

    subTypeField = (
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="subPageType-Label-placeholder">
          Sub PageType
        </InputLabel>
        <Select
          value={this.props.currentSubtype}
          onChange={this.props.handleCurrentSubtype}
          input={<Input name="domain" id="domain-label-placeholder" />}
          displayEmpty
          name="currentDomain"
          className={classes.selectEmpty}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="schedule-routes">
            <em>Schedule Routes</em>
          </MenuItem>
          <MenuItem value="from">
            <em>From</em>
          </MenuItem>
          <MenuItem value="to">
            <em>To</em>
          </MenuItem>
          <MenuItem value="index">
            <em>Index </em>
          </MenuItem>
        </Select>
        <FormHelperText />
      </FormControl>
    );
    return <div>{subTypeField}</div>;
  }
}

FlightScheduleFields.propTypes = {
  classes: PropTypes.object.isRequired
};
export default FlightScheduleFields;
