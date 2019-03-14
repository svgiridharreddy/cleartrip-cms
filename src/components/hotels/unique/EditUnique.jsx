import React, { Component } from "react";
import { host } from '../../helper';
import {Button} from "react-bootstrap";
import "froala-editor/js/froala_editor.pkgd.min.js";
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


const API_URL = host()+"/cmshotels/edit/";

class EditUniqueContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      top_content: "",
      bottom_content: "",
      faq: "",
      domain_url: "",
      domain_name: this.props.domain_name,
      content_type: '',
      country_name: this.props.country_name,
      h1_tag: "",
      h2_tag: "",
      h3_tag: "",
      meta_title: "",
      meta_description: "",
      meta_keyword: "",
      message: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.returnOptions = this.returnOptions.bind(this);
    this.handleHeaderModelChange = this.handleHeaderModelChange.bind(this);
    this.handleFooterModelChange = this.handleFooterModelChange.bind(this);
    this.handleFaqModelChange = this.handleFaqModelChange.bind(this);
  }

  componentDidMount() {
    var pathName = API_URL + this.props.contentRecord.id;
    fetch(pathName)
      .then(response => response.json())
      .then(resData => {
        debugger;
        this.setState({
          id: resData.id,
          domain_url: resData.domain_url,
          content_type: resData.content_type,
          country_name: resData.country_name,
          h1_tag: resData.h1_tag,
          h2_tag: resData.h2_tag,
          h3_tag: resData.h3_tag,
          meta_title: resData.meta_title,
          meta_description: resData.meta_description,
          meta_keyword: resData.meta_keyword,
          top_content: resData.top_content,
          bottom_content: resData.bottom_content,
          faq: resData.faq
        });
      });
  }

  handleHeaderModelChange(model) {
    let _self = this;
    _self.setState({
      top_content: model
    });
  }
  handleFooterModelChange(model) {
    let _self = this;
    _self.setState({
      bottom_content: model
    });
  }
  handleFaqModelChange(model) {
    let _self = this;
    _self.setState({
      faq: model
    });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  returnOptions(optData) {
    return optData.map((country, i) => {
      return (
        <option key={i} value={country}>
          {country}
        </option>
      );
    });
  }

  handleSubmit(e) {
    this.props.handleChangeEditData(this.state)
  }

  render() {
    const {
      faq,
      top_content,
      bottom_content,
      HeaderEditorState,
      FootereditorState,
      FaqeditorState,
      domain_url,
      content_type,
      country_name,
      h1_tag,
      h2_tag,
      h3_tag,
      meta_title,
      meta_description,
      meta_keyword,
    } = this.state;

    return (
      <div className="common-hotel-wrapper">
      <div className="top-wrapper">
        <h3 align="center">Update Data</h3>
        <div className="filter-fileds">
          <ul className="list-inline">
            <li>
                  <Button variant="secondary" onClick ={() => this.props.backBtnFun()}>Back</Button>
                </li>
            <li>
              <label>Domain Url</label>
              <input type="text" value={domain_url} name="domain_url" />
            </li>
            <li>
              <label>Content Section</label>
              <input value={content_type} name="content_type" />
            </li>
            <li>
              <label>Country Name</label>
              <input value={country_name} name="country_name" />
            </li>
          </ul>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
      </div>
      <div className="common-hotel-content">
          <ul className="common-hotels-field">
            <li>
              <label>H1 Title</label>
              <input type="text" value={h1_tag} name="h1_tag" onChange={this.handleChange} />
            </li>
            <li>
              <label>H2 Title</label>
              <input type="text" value={h2_tag} name="h2_tag" onChange={this.handleChange} />
            </li>
            <li>
              <label>H3 Title</label>
              <input type="text" value={h3_tag} name="h3_tag" onChange={this.handleChange} />
            </li>
            <li>
              <label>Meta Title</label>
              <input type="text" value={meta_title} name="meta_title" onChange={this.handleChange} />
            </li>
            <li>
              <label>Meta Description</label>
              <input type="text" value={meta_description} name="meta_description" onChange={this.handleChange} />
            </li>
            <li>
              <label>Meta Keywords</label>
              <input type="text" value={meta_keyword} name="meta_keyword" onChange={this.handleChange} />
            </li>
            <li>
              <label>Header Content</label>
              <FroalaEditor
                model={this.state.top_content}
                base="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4"
                onModelChange={this.handleHeaderModelChange}
              />
            </li>
            <li>
              <label>Footer Content</label>
              <FroalaEditor
                model={this.state.bottom_content}
                base="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4"
                onModelChange={this.handleFooterModelChange}
              />
            </li>
            <li>
              <label>Freaquently Asked Questions</label>
              <FroalaEditor
                model={this.state.faq}
                base="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4"
                onModelChange={this.handleFaqModelChange}
              />
            </li>
            <li>
              <button
              type="button"
              onClick={this.handleSubmit}
              className="button">
              Update
            </button>
            </li>
          </ul>
      </div>
      </div>
    );
  }
}

export default EditUniqueContent;
