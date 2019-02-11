import React, { Component } from "react";
import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import "froala-editor/js/froala_editor.pkgd.min.js";
import { Button, Form, Col, ButtonToolbar, InputGroup } from "react-bootstrap";
import Select1 from "react-select";

// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "font-awesome/css/font-awesome.css";
import FroalaEditor from "react-froala-wysiwyg";
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
      readOnlyValue: this.props.readOnlyValue,
      selectedOption: null,
      options: [],
      options_dep: [],
      options_arr: [],
      depCityNameSelected: "",
      arrCityNameSelected: ""
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
      arrCityName: nextProps.arrCityName
    });
  }

  render() {
    debugger;
    let subTypeField, category, fields;
    const subtypeOptions = {
      "select subtype": "Select sub page type",
      "airline-routes": "Airline Routes",
      overview: "Overview",
      "pnr-status": "PNR Status",
      "web-checkin": "Web Checkin",
      index: "Index"
    };
    const {
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
      readOnlyValue,
      selectedOption,
      options,
      options_dep,
      options_arr,
      depCityNameSelected,
      arrCityNameSelected
    } = this.props;
    subTypeField = (
      <Form.Group as={Col}>
        <Form.Label>Sub PageType</Form.Label>
        <Form.Control
          as="select"
          name="currentSubType"
          value={currentSubType}
          onChange={e => this.props.handleChange(e, "currentSubType")}
        >
          {Object.keys(subtypeOptions).map(option => (
            <option key={option} value={option}>
              {subtypeOptions[option]}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    );

    if (currentSubType === "index") {
      category = (
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={categoryType}
            onChange={e => this.props.handleChange(e, "categoryType")}
            name="categoryType"
          >
            <option>Select Category</option>
            <option>Domestic</option>
            <option>International</option>
          </Form.Control>
        </Form.Group>
      );
    } else if (currentSubType !== "index" && currentSubType !== "") {
      category = (
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={categoryType}
            onChange={e => this.props.handleChange(e, "categoryType")}
            name="categoryType"
          >
            <option value="">Select Category</option>
            <option value="uniq">Unique</option>
            <option value="common">Common</option>
          </Form.Control>
        </Form.Group>
      );
    } else {
    }

    fields = (
      <div>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search  Destination"
            name="title"
            placeholder="Title"
            aria-label="Title"
            value={title}
            onChange={e => this.props.handleChange(e, "title")}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            name="description"
            placeholder="Description"
            aria-label="Description"
            aria-describedby="basic-addon1"
            value={description}
            onChange={e => this.props.handleChange(e, "description")}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            name="keywords"
            type="text"
            placeholder="Key words"
            aria-label="key words"
            value={keywords}
            onChange={e => this.props.handleChange(e, "keywords")}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            aria-label="H1 Title"
            value={h1Tag}
            onChange={e => this.props.handleChange(e, "h1Tag")}
            name="h1Tag"
            placeholder="Enter H1 Title"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            aria-label="H1 Title"
            value={content}
            onChange={e => this.props.handleChange(e, "content")}
            name="content"
            placeholder="Enter Content "
          />
        </Form.Group>

        {categoryType === "uniq" && currentSubType !== "index" ? (
          <Select1
            value={selectedOption}
            onChange={p => this.props.handleSelectedInput(p, "airlineName")}
            options={options}
            name="airlineName"
            // onInputChange={this.handleAirlineSearch}
            onInputChange={e => this.props.handleAutoSearch(e, "airlineName")}
          />
        ) : null}
        {categoryType === "uniq" && currentSubType === "airline-routes" ? (
          <div>
            <Select1
              value={depCityNameSelected}
              onChange={p => this.props.handleAutoSearch(p, "depCityName")}
              options={options_dep}
              name="depCityName"
              // onInputChange={this.handleAirlineSearch}
              onInputChange={e => this.props.handleAutoSearch(e, "depCityName")}
            />

            <Select1
              value={arrCityNameSelected}
              onChange={p => this.props.handleSelectedInput(p, "arrCityName")}
              options={options_arr}
              name="arrCityName"
              // onInputChange={this.handleAirlineSearch}
              onInputChange={e => this.props.handleAutoSearch(e, "arrCityName")}
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

export default FlightBookingFields;
