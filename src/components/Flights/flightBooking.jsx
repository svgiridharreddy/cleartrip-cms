import React, { Component } from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";

class FlightBookingFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSubtype: this.props.currentSubtype,
      categoryType: this.props.categoryType
    };
    debugger;
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    this.setState({
      currentSubtype: nextProps.currentSubtype,
      categoryType: nextProps.categoryType
    });
  }

  render() {
    let subTypeField, category, overviewFields, fields;
    const { classes, handleCurrentSubtype, handleChangeCategory } = this.props;
    const { currentSubtype, categoryType } = this.state;
    debugger;

    subTypeField = (
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="subPageType-Label-placeholder">
          Sub PageType
        </InputLabel>
        <Select
          value={currentSubtype}
          onChange={handleCurrentSubtype}
          input={<Input name="subtype" id="subtype-label-placeholder" />}
          displayEmpty
          name="currentSubType"
          className={classes.selectEmpty}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="airline-routes">
            <em>Airline Routes</em>
          </MenuItem>
          <MenuItem value="overview">
            <em>Overview</em>
          </MenuItem>
          <MenuItem value="pnr-status">
            <em>PNR Status</em>
          </MenuItem>
          <MenuItem value="web-checkin">
            <em>Web Checkin </em>
          </MenuItem>
          <MenuItem value="index">
            <em>Index </em>
          </MenuItem>
        </Select>
        <FormHelperText />
      </FormControl>
    );

    if (currentSubtype === "index") {
      category = (
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="subPageType-Label-placeholder">
            Category
          </InputLabel>
          <Select
            value={categoryType}
            onChange={handleChangeCategory}
            input={<Input name="subtype" id="subtype-label-placeholder" />}
            displayEmpty
            name="category"
            className={classes.selectEmpty}
          >
            <MenuItem value="">
              <em>Select Option</em>
            </MenuItem>
            <MenuItem value="common">
              <em>International</em>
            </MenuItem>
            <MenuItem value="uniq">
              <em>Domestic</em>
            </MenuItem>
          </Select>
          <FormHelperText />
        </FormControl>
      );
    } else if (currentSubtype !== "index" && currentSubtype !== "") {
      category = (
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="subPageType-Label-placeholder">
            Category
          </InputLabel>
          <Select
            value={categoryType}
            onChange={handleChangeCategory}
            input={<Input name="subtype" id="subtype-label-placeholder" />}
            displayEmpty
            name="category"
            className={classes.selectEmpty}
          >
            <MenuItem value="">
              <em>Select Option</em>
            </MenuItem>
            <MenuItem value="common">
              <em>Common</em>
            </MenuItem>
            <MenuItem value="uniq">
              <em>Unique</em>
            </MenuItem>
          </Select>
          <FormHelperText />
        </FormControl>
      );
    } else {
    }

    fields = (
      <div>
        <TextField
          label="Title"
          name="title"
          value=""
          placeholder="Enter title"
        />
        <TextField
          label="Description"
          name="description"
          value=""
          placeholder="Enter description"
        />
        {categoryType === "uniq" && currentSubtype !== "index" ? (
          <TextField
            label="Airline name"
            name="airline name"
            value=""
            placeholder="Enter airline name"
          />
        ) : null}
        {categoryType === "uniq" && currentSubtype !== "index" ? (
          <TextField
            label="Airline name"
            name="airline name"
            value=""
            placeholder="Enter airline name"
          />
        ) : null}
      </div>
    );

    return (
      <div>
        {subTypeField}
        {category}
        {currentSubtype !== "" ? fields : null}
      </div>
    );
  }
}

FlightBookingFields.propTypes = {
  classes: PropTypes.object.isRequired
};
export default FlightBookingFields;
