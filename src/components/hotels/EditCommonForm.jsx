import React, { Component } from 'react';
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

const API_URL = "http://13.251.49.54:82/cmshotels/edit/";

class EditCommonForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      domain_name: '',
      country_name: '',
      page_type: '',
      content_type: '',
      h1_tag: '',
      h2_tag: '',
      h3_tag: '',
      meta_title: '',
      meta_description: '',
      meta_keyword: '',
      top_content: '',
      bottom_content: '',
      faq: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleHeaderModelChange = this.handleHeaderModelChange.bind(this);
    this.handleFooterModelChange = this.handleFooterModelChange.bind(this);
    this.handleFaqModelChange = this.handleFaqModelChange.bind(this);
  }


  componentDidMount() {
    var pathName = API_URL + this.props.contentRecord.id;
    fetch(pathName)
      .then(response => response.json())
      .then(resData => {
        this.setState({
          id: resData.id,
          domain_name: resData.domain_name,
          country_name: resData.country_name,
          page_type: resData.page_type,
          content_type: resData.content_type,
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

  handleSubmit(e) {
    this.props.handleChangeEditData(this.state)
  }

  render() {
        const { HeaderEditorState, FootereditorState, FaqeditorState } = this.state
    return(
        <div>
          <ul className="common-hotels-field">
            <li>
              <Button variant="secondary" onClick ={() => this.props.backBtnFun()}>Back</Button>
            </li>
            <li>
              <label>H1 Title</label>
              <input type="text" name="h1_tag" onChange={this.handleChange} value={this.state.h1_tag} />
            </li>
            <li>
              <label>H2 Title</label>
              <input type="text" name="h2_tag" onChange={this.handleChange} value={this.state.h2_tag} />
            </li>
            <li>
              <label>H3 Title</label>
              <input type="text" name="h3_tag" onChange={this.handleChange} value={this.state.h3_tag} />
            </li>
            <li>
              <label>Meta Title</label>
              <input type="text" name="meta_title" onChange={this.handleChange} value={this.state.meta_title} />
            </li>
            <li>
              <label>Meta Description</label>
              <input type="text" name="meta_description" onChange={this.handleChange} value={this.state.meta_description} />
            </li>
            <li>
              <label>Meta Keywords</label>
              <input type="text" name="meta_keyword" onChange={this.handleChange} value={this.state.meta_keyword} />
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
      )
  }
}

export default EditCommonForm;