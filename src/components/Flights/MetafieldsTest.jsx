import React, { Component } from "react";
import "froala-editor/js/froala_editor.pkgd.min.js";
import RichTextEditor from "react-rte";
import { Button, Form, Col, ButtonToolbar, InputGroup } from "react-bootstrap";
import Select1 from "react-select";
import "font-awesome/css/font-awesome.css";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import FroalaEditor from "react-froala-wysiwyg";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
import FroalaEditorInput from "react-froala-wysiwyg/FroalaEditorInput";
import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;
class MetaFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageType: this.props.pageType,
      title: "",
      description: "",
      content: this.props.content,
      h1Tag: "",
      keywords: "",
      airlinName: "",
      depCityName: "",
      arrCityName: "",
      readOnlyValue: "",
      selectedOption: null,
      options: [],
      options_dep: [],
      options_arr: [],
      depCityNameSelected: "",
      arrCityNameSelected: "",
      editorState: ""
    };
    this.handleModelChange = this.handleModelChange.bind(this);
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

  // componentWillMount() {
  //   if (this.props.content) {
  //     this.setState({
  //       content: RichTextEditor.createValueFromString(
  //         this.props.content,
  //         "html"
  //       )
  //     });
  //   }
  // }
  handleModelChange(model) {
    let _self = this;
    _self.setState({
      content: model
    });
    // _self.props.handleChange(_self.state.content.toString("html"), "rte");
    _self.props.handleChange(_self.state.content,"rte");
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      title: nextProps.title,
      description: nextProps.description,
      keywords: nextProps.keywords,
      h1Tag: nextProps.h1Tag,
      conent: nextProps.content
    });
  }

  render() {
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
    let subTypeField, category, fields;
    const subtypeOptions = {
      "select subtype": "Select sub page type",
      "airline-routes": "Airline Routes",
      overview: "Overview",
      "pnr-status": "PNR Status",
      "web-checkin": "Web Checkin",
      index: "Index"
    };
    const { title, description, keywords, content, h1Tag } = this.props;

    return (
      <ul>
        <li>
          <Button variant="secondary" onClick={() => this.props.backBtnFun()}>
            Back
          </Button>
        </li>
        <li>
          <label>Title</label>
          <input
            type="text"
            placeholder="Title"
            name="title"
            placeholder="Title"
            aria-label="Title"
            value={title}
            required
            onChange={e => this.props.handleMetaChanges(e, "title")}
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
            onChange={e => this.props.handleMetaChanges(e, "description")}
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
            onChange={e => this.props.handleMetaChanges(e, "keywords")}
          />
        </li>
        <li>
          <label>H1 Title</label>
          <input
            type="text"
            aria-label="H1 Title"
            value={h1Tag}
            required
            onChange={e => this.props.handleMetaChanges(e, "h1Tag")}
            name="h1Tag"
            placeholder="Enter H1 Title"
          />
        </li>
        <label>Content</label>
        <li>
          <FroalaEditor
            model={this.state.content}
            base="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4"
            onModelChange={this.handleModelChange}
            config={{htmlAllowedTags: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']}}
          />
          <li>
            {/* <FroalaEditor
              base='https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4'
              value={this.state.florContent} /> */}
          </li>
          <button
            className="save-btn"
            type="submit"
            onClick={this.props.handleFormSubmit}
          >
            Save{" "}
          </button>
        </li>
      </ul>
    );
  }
}

export default MetaFields;