import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Form, Col, ButtonToolbar, InputGroup } from "react-bootstrap";
import Select1 from "react-select";
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
class FlightScheduleFields extends Component {
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
      cityName: this.props.cityName,
      depCityName: this.props.depCityName,
      arrCityName: this.props.arrCityName,
      readOnlyValue: this.props.readOnlyValue,
      selectedOption: null,
      options: [],
      options_dep: [],
      options_arr: [],
      depCityNameSelected: "",
      arrCityNameSelected: "",
      cityNameSelected: "",
      editorState: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    debugger
    this.setState({
      currentSubType: nextProps.currentSubType,
      categoryType: nextProps.categoryType,
      title: nextProps.title,
      description: nextProps.description,
      keywords: nextProps.keywords,
      h1Tag: nextProps.h1Tag,
      cityName: nextProps.cityName,
      depCityName: nextProps.depCityName,
      arrCityName: nextProps.arrCityName,
      depCityNameSelected: nextProps.depCityNameSelected,
      arrCityNameSelected: nextProps.arrCityNameSelected
    });
  }

  onEditorStateChange: Function = (editorState) => {
    debugger
    this.setState({
      editorState:editorState,
    });
  };

  render() {
    debugger;
    let subTypeField, category, fields;
    const subtypeOptions = {
      "select sub page type": "select sub page type",
      "schedule-routes": "Schedule Routes",
      "flights-from": "Flights From",
      "flights-to": "Flights To",
      index: "Index"
    };
    const {
      title,
      description,
      keywords,
      content,
      h1Tag,
      cityName,
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
      arrCityNameSelected,
      cityNameSelected,
      editorState
    } = this.props;
    subTypeField = (
      <Form.Group as={Col}>
        <Form.Label>Sub PageType</Form.Label>
        <Form.Control
          as="select"
          name="currentSubType"
          value={currentSubType}
          onChange={e => this.props.handleChange(e, "currentSubType")}
          required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
            placeholder="Enter Content "
          />
        </Form.Group> 
       
        {categoryType === "uniq" && (currentSubType === "flights-from" || currentSubType === "flights-to") ? (
          <Select1
            value={cityNameSelected}
            onChange={p => this.props.handleSelectedInput(p, "cityName")}
            options={options}
            name="cityName"
            required
            // onInputChange={this.handleAirlineSearch}
            onInputChange={e => this.props.handleAutoSearch(e, "cityName")}
          />
        ) : null}
        {categoryType === "uniq" && currentSubType === "schedule-routes" ? (
          <div>
            <Select1
              value={depCityNameSelected}
              onChange={p => this.props.handleSelectedInput(p, "depCityName")}
              options={options_dep}
              name="depCityName"
              required
              // onInputChange={this.handleAirlineSearch}
              onInputChange={e => this.props.handleAutoSearch(e, "depCityName")}
            />

            <Select1
              value={arrCityNameSelected}
              onChange={p => this.props.handleSelectedInput(p, "arrCityName")}
              options={options_arr}
              name="arrCityName"
              required
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

export default FlightScheduleFields;
