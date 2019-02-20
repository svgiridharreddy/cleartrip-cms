import React, { Component } from "react";

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
      arrCityName: nextProps.arrCityName,
      selectedOption: nextProps.selectedOption,
      depCityNameSelected: nextProps.depCityNameSelected,
      arrCityNameSelected: nextProps.arrCityNameSelected,
      options_dep: nextProps.options_dep,
      options_arr: nextProps.options_arr
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
    debugger;
    subTypeField = (
      <li>
        <label>Sub PageType</label>
        <select
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
        </select>
      </li>
    );

    if (currentSubType === "index") {
      category = (
        <li>
          <label>Category</label>
          <select
            as="select"
            value={categoryType}
            onChange={e => this.props.handleChange(e, "categoryType")}
            name="categoryType"
          >
            <option>Select Category</option>
            <option>Domestic</option>
            <option>International</option>
          </select>
        </li>
      );
    } else if (currentSubType !== "index" && currentSubType !== "") {
      category = (
        <li>
          <label>Category</label>
          <select
            as="select"
            value={categoryType}
            onChange={e => this.props.handleChange(e, "categoryType")}
            name="categoryType"
          >
            <option value="">Select Category</option>
            <option value="uniq">Unique</option>
            <option value="common">Common</option>
          </select>
        </li>
      );
    } else {
    }

    fields = (
      <div>
        <li>
          <label>Title</label>
          <input
            type="text"
            placeholder="Title"
            name="title"
            placeholder="Title"
            aria-label="Title"
            value={title}
            onChange={e => this.props.handleChange(e, "title")}
          />
        </li>
        <li>
          <input
            type="text"
            name="description"
            placeholder="Description"
            aria-label="Description"
            aria-describedby="basic-addon1"
            value={description}
            onChange={e => this.props.handleChange(e, "description")}
          />
        </li>
        <li>
          <input
            name="keywords"
            type="text"
            placeholder="Key words"
            aria-label="key words"
            value={keywords}
            onChange={e => this.props.handleChange(e, "keywords")}
          />
        </li>
        <li>
          <input
            type="text"
            aria-label="H1 Title"
            value={h1Tag}
            onChange={e => this.props.handleChange(e, "h1Tag")}
            name="h1Tag"
            placeholder="Enter H1 Title"
          />
        </li>
        <li>
          <input
            type="text"
            aria-label="H1 Title"
            value={content}
            onChange={e => this.props.handleChange(e, "content")}
            name="content"
            placeholder="Enter Content "
          />
        </li>

        {categoryType === "uniq" && currentSubType !== "index" ? (
          <Select1
            value={selectedOption}
            onChange={p => this.props.handleSelectedInput(p, "airlineName")}
            options={this.props.options}
            name="airlineName"
            onInputChange={e => this.props.handleAutoSearch(e, "airlineName")}
          />
        ) : null}
        {categoryType === "uniq" && currentSubType === "airline-routes" ? (
          <div>
            <Select1
              value={depCityNameSelected}
              onChange={p => this.props.handleSelectedInput(p, "depCityName")}
              options={this.props.options_dep}
              name="depCityName"
              // onInputChange={this.handleAirlineSearch}
              onInputChange={e => this.props.handleAutoSearch(e, "depCityName")}
            />

            <Select1
              value={arrCityNameSelected}
              onChange={p => this.props.handleSelectedInput(p, "arrCityName")}
              options={this.props.options_arr}
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