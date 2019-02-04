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
      categoryType: this.props.categoryType,
      title: this.props.title,
      description: this.props.description,
      content: this.props.content,
      h1Tag: this.props.h1Tag,
      keywords: this.props.keywords,
      airlinName: this.props.airlineName,
      depCityName: this.props.depCityName,
      arrCityName: this.props.arrCityName
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentSubtype: nextProps.currentSubtype,
      categoryType: nextProps.categoryType
    });
  }

  render() {
    let subTypeField, category, fields;
    const subtypeOptions = {
      "airline-routes": "Airline Routes",
      overview: "Overview",
      "pnr-status": "PNR Status",
      "web-checkin": "Web Checkin",
      index: "Index"
    };
    const {
      classes,
      handleCurrentSubtype,
      handleChangeCategory,
      title,
      description,
      keywords,
      content,
      h1Tag,
      handleTitleChange,
      handleDescriptionChange,
      handleKeywordsChange,
      handleH1TagChange,
      handleContentChange,
      airlineName,
      depCityName,
      arrCityName,
      handleAirlineName,
      handleDepCityName,
      handleArrCityName
    } = this.props;
    const { currentSubtype, categoryType } = this.state;

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
            <em>Select Options</em>
          </MenuItem>
          {Object.keys(subtypeOptions).map(option => (
            <MenuItem key={option} value={option}>
              {subtypeOptions[option]}
            </MenuItem>
          ))}
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
          id="outlined-name"
          label="Title"
          className={classes.textField}
          value={title}
          onChange={handleTitleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-name"
          label="Description"
          className={classes.textField}
          value={description}
          onChange={handleDescriptionChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-textarea"
          label="Keywords"
          placeholder="MultiLine keywords"
          multiline
          className={classes.textField}
          value={keywords}
          onChange={handleKeywordsChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-name"
          label="H1 Title"
          className={classes.textField}
          value={h1Tag}
          onChange={handleH1TagChange}
          margin="normal"
          variant="outlined"
          placeholder="Enter H1 Title"
        />
        <TextField
          id="outlined-textarea"
          label="Content"
          placeholder="Enter content"
          multiline
          className={classes.textField}
          value={content}
          onChange={handleContentChange}
          margin="normal"
          variant="outlined"
        />
        {categoryType === "uniq" && currentSubtype !== "index" ? (
          <TextField
            id="outlined-airline-name"
            label="Airline Name"
            className={classes.textField}
            value={airlineName}
            onChange={handleAirlineName}
            margin="normal"
            variant="outlined"
          />
        ) : null}
        {categoryType === "uniq" && currentSubtype === "airline-routes" ? (
          <div>
            <TextField
              id="outlined-dep-city-name"
              label="Source City"
              className={classes.textField}
              value={depCityName}
              onChange={handleDepCityName}
              margin="normal"
              variant="outlined"
            />
            <TextField
              id="outlined-arr-city-name"
              label="Destination City"
              className={classes.textField}
              value={arrCityName}
              onChange={handleArrCityName}
              margin="normal"
              variant="outlined"
            />
          </div>
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
