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
      currentSubType: this.props.currentSubType,
      categoryType: this.props.categoryType,
      title: this.props.title,
      description: this.props.description,
      content: this.props.content,
      h1Tag: this.props.h1Tag,
      keywords: this.props.keywords,
      airlinName: this.props.airlineName,
      depCityName: this.props.depCityName,
      arrCityName: this.props.arrCityName,
      readOnlyValue: this.props.readOnlyValue
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentSubType: nextProps.currentSubType,
      categoryType: nextProps.categoryType,
      title: nextProps.title,
      description: nextProps.description,
      keywords: nextProps.keywords,
      h1Tag: nextProps.h1Tag,
      airlinName: nextProps.airlineName,
      depCityName: nextProps.depCityName,
      arrCityName: nextProps.arrCityName,
      readOnlyValue: nextProps.readOnlyValue
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
      title,
      description,
      keywords,
      content,
      h1Tag,
      airlineName,
      depCityName,
      arrCityName,
      currentSubType,
      categoryType,
      readOnlyValue
    } = this.props;

    subTypeField = (
      <FormControl className={classes.formControl} >
        <InputLabel shrink htmlFor="subPageType-Label-placeholder">
          Sub PageType
        </InputLabel>
        <Select
          // InputProps={{
          //    readOnly: readOnly,
          //    }}
          value={currentSubType}
          onChange={e => this.props.handleChangeField(e, "currentSubType")}
          input={<Input name="currentSubType" id="subtype-label-placeholder" />}
          displayEmpty
          name="currentSubType"
          className={classes.selectEmpty}
          readOnly={readOnlyValue}
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

    if (currentSubType === "index") {
      category = (
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="subPageType-Label-placeholder">
            Category
          </InputLabel>
          <Select
            value={categoryType}
            onChange={e => this.props.handleChangeField(e, "categoryType")}
            input={<Input name="subtype" id="subtype-label-placeholder" />}
            displayEmpty
            name="categoryType"
            className={classes.selectEmpty}
            readOnly={readOnlyValue}
            required
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
    } else if (currentSubType !== "index" && currentSubType !== "") {
      category = (
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="subPageType-Label-placeholder">
            Category
          </InputLabel>
          <Select
            value={categoryType}
            onChange={e => this.props.handleChangeField(e, "categoryType")}
            input={<Input name="subtype" id="subtype-label-placeholder" />}
            displayEmpty
            name="categoryType"
            className={classes.selectEmpty}
            readOnly={readOnlyValue}
            required
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
          // onChange={handleTitleChange}
          onChange={e => this.props.handleChangeField(e, "title")}
          name="title"
          margin="normal"
          variant="outlined"
          required
          title="please enter the title"
        />
        <TextField
          id="outlined-name"
          label="Description"
          className={classes.textField}
          value={description}
          onChange={e => this.props.handleChangeField(e, "description")}
          name="description"
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          id="outlined-textarea"
          label="Keywords"
          placeholder="MultiLine keywords"
          multiline
          className={classes.textField}
          value={keywords}
          onChange={e => this.props.handleChangeField(e, "keywords")}
          name="keywords"
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          id="outlined-name"
          label="H1 Title"
          className={classes.textField}
          value={h1Tag}
          onChange={e => this.props.handleChangeField(e, "h1Tag")}
          name="h1Tag"
          margin="normal"
          variant="outlined"
          placeholder="Enter H1 Title"
          required
        />
        <TextField
          id="outlined-textarea"
          label="Content"
          placeholder="Enter content"
          multiline
          className={classes.textField}
          value={content}
          onChange={e => this.props.handleChangeField(e, "content")}
          name="content"
          margin="normal"
          variant="outlined"
          fullWidth
          multiline
          required
        />
        {categoryType === "uniq" && currentSubType !== "index" ? (
          <TextField
            id="outlined-airline-name"
            label="Airline Name"
            className={classes.textField}
            value={airlineName}
            onChange={e => this.props.handleChangeField(e, "airlineName")}
            name="airlineName"
            margin="normal"
            variant="outlined"
            required
            
          />
        ) : null}
        {categoryType === "uniq" && currentSubType === "airline-routes" ? (
          <div>
            <TextField
              id="outlined-dep-city-name"
              label="Source City"
              className={classes.textField}
              value={depCityName}
              onChange={e => this.props.handleChangeField(e, "depCityName")}
              name="depCityName"
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              id="outlined-arr-city-name"
              label="Destination City"
              className={classes.textField}
              value={arrCityName}
              onChange={e => this.props.handleChangeField(e, "arrCityName")}
              name="arrCityName"
              margin="normal"
              variant="outlined"
              required

            />
          </div>
        ) : null}
      </div>
    );
    return (
      <div>
        {subTypeField}
        {category}
        {currentSubType !== "" ? fields : null}
      </div>
    );
  }
}

FlightBookingFields.propTypes = {
  classes: PropTypes.object.isRequired
};
export default FlightBookingFields;
