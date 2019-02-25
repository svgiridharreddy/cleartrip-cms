import React, { Component } from "react";
import "froala-editor/js/froala_editor.pkgd.min.js";
import RichTextEditor from "react-rte";
import { Button, Form, Col, ButtonToolbar, InputGroup } from "react-bootstrap";
import Select1 from "react-select";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
class FlightBookingFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSubType: this.props.currentSubType,
      categoryType: this.props.categoryType,
      title: this.props.title,
      description: this.props.description,
      // content: this.props.content,
      h1Tag: this.props.h1Tag,
      keywords: this.props.keywords,
      airlineName: this.props.airlineName,
      depCityName: this.props.depCityName,
      arrCityName: this.props.arrCityName,
      readOnlyValue: this.props.readOnlyValue,
      selectedOption: null,
      options: [],
      options_dep: [],
      options_arr: [],
      depCityNameSelected: "",
      arrCityNameSelected: "",
      airlineNameSelected:"",
      editorState: "",
      content: RichTextEditor.createEmptyValue()
    };
  }
  onChange1 = content => {
    this.setState({ content });
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(content.toString("html"));
    }
    this.props.handleChange(content, "rte");
  };
  componentWillMount() {
    if (this.props.content) {
      this.setState({
        content: RichTextEditor.createValueFromString(
          this.props.content,
          "html"
        )
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    debugger;
    this.setState({
      currentSubType: nextProps.currentSubType,
      categoryType: nextProps.categoryType,
      title: nextProps.title,
      description: nextProps.description,
      keywords: nextProps.keywords,
      h1Tag: nextProps.h1Tag,
      airline: nextProps.airlineName,
      depCityName: nextProps.depCityName,
      arrCityName: nextProps.arrCityName,
      depCityNameSelected: nextProps.depCityNameSelected,
      arrCityNameSelected: nextProps.arrCityNameSelected,
      airlineNameSelected: nextProps.airlineNameSelected
    });
  }

  // onEditorStateChange: Function = editorState => {
  //   debugger;
  //   this.setState({
  //     editorState: editorState
  //   });
  // };

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
      arrCityNameSelected,
      airlineNameSelected
    } = this.props;

    const toolbarConfig = {
      // Optionally specify the groups to display (displayed in the order listed).
      display: [
        "INLINE_STYLE_BUTTONS",
        "BLOCK_TYPE_BUTTONS",
        "LINK_BUTTONS",
        "BLOCK_TYPE_DROPDOWN",
        "HISTORY_BUTTONS"
      ],
      INLINE_STYLE_BUTTONS: [
        { label: "Bold", style: "BOLD", className: "custom-css-class" },
        { label: "Italic", style: "ITALIC" },
        { label: "Underline", style: "UNDERLINE" }
      ],
      BLOCK_TYPE_DROPDOWN: [
        { label: "Normal", style: "unstyled" },
        { label: "H1", style: "header-one" },
        { label: "H2", style: "header-two" },
        { label: "H3", style: "header-three" },
        { label: "H4", style: "header-four" },
        { label: "H5", style: "header-five" },
        { label: "H6", style: "header-six" }
      ],
      BLOCK_TYPE_BUTTONS: [
        { label: "UL", style: "unordered-list-item" },
        { label: "OL", style: "ordered-list-item" }
      ]
    };
    subTypeField = (
      <li>
        <label>Page Subtype</label>
        <select
          disabled={readOnlyValue}
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
        </select>
      </li>
    );

    if (currentSubType === "index") {
      category = (
        <li>
          <label>Category</label>
          <select
            disabled={readOnlyValue}
            as="select"
            value={categoryType}
            onChange={e => this.props.handleChange(e, "categoryType")}
            name="categoryType"
            required
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
            disabled={readOnlyValue}
            as="select"
            value={categoryType}
            onChange={e => this.props.handleChange(e, "categoryType")}
            name="categoryType"
            required
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
            placeholder="Search  Destination"
            name="title"
            placeholder="Title"
            aria-label="Title"
            value={title}
            required
            onChange={e => this.props.handleChange(e, "title")}
          />
        </li>
        <li>
          <label>Description</label>

          <input
            type="text"
            name="description"
            placeholder="Description"
            aria-label="Description"
            aria-describedby="basic-addon1"
            value={description}
            required
            onChange={e => this.props.handleChange(e, "description")}
          />
        </li>
        <li>
          <label>Keywords</label>

          <input
            name="keywords"
            type="text"
            placeholder="Key words"
            aria-label="key words"
            value={keywords}
            required
            onChange={e => this.props.handleChange(e, "keywords")}
          />
        </li>
        <li>
          <label>H1 Title</label>
          <input
            type="text"
            aria-label="H1 Title"
            value={h1Tag}
            onChange={e => this.props.handleChange(e, "h1Tag")}
            name="h1Tag"
            required
            placeholder="Enter H1 Title"
          />
        </li>
        <label>Content</label>

        <RichTextEditor
          value={this.state.content}
          onChange={this.onChange1}
          toolbarConfig={toolbarConfig}
        />
        {/*<Editor
            editorState={this.state.editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="editer-content"
            onEditorStateChange={this.onChange}
          /> */}

        {categoryType === "uniq" && currentSubType !== "index"  ? (
          <div>
            <label>Airline Name</label>
            <Select1
              isDisabled={readOnlyValue}
              value={airlineNameSelected}
              onChange={p => this.props.handleSelectedInput(p, "airlineName")}
              options={options}
              name="airlineName"
              required
              placeholder="Search Airline"
              // onInputChange={this.handleAirlineSearch}
              onInputChange={e => this.props.handleAutoSearch(e, "airlineName")}
            />
          </div>
        ) : null}
        {categoryType === "uniq" && currentSubType === "airline-routes" ? (
          <div>
            <label>Dep City Name</label>
            <Select1
              isDisabled={readOnlyValue}
              value={depCityNameSelected}
              onChange={p => this.props.handleSelectedInput(p, "depCityName")}
              options={options_dep}
              name="depCityName"
              required
              placeholder="Search Departure City"
              // onInputChange={this.handleAirlineSearch}
              onInputChange={e => this.props.handleAutoSearch(e, "depCityName")}
            />
            <label>Arr City Name</label>
            <Select1
              isDisabled={readOnlyValue}
              value={arrCityNameSelected}
              onChange={p => this.props.handleSelectedInput(p, "arrCityName")}
              options={options_arr}
              name="arrCityName"
              placeholder="Search Arrival City"
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

export default FlightBookingFields;
