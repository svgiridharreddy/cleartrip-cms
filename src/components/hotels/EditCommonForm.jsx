import React, { Component } from 'react';
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from "draft-js-export-html";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

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
      HeaderEditorState: "",
      FootereditorState: "",
      FaqeditorState: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.conentConvertion = this.conentConvertion.bind(this);
  }


  componentDidMount() {
    var pathName = API_URL + this.props.contentRecord.id;
    fetch(pathName)
      .then(response => response.json())
      .then(resData => {
        const headerHtml = resData.top_content;
        const footerHtml = resData.bottom_content;
        const faqHtml = resData.faq;
        this.setState({
          HeaderEditorState: this.conentConvertion(headerHtml),
          FootereditorState: this.conentConvertion(footerHtml),
          FaqeditorState: this.conentConvertion(faqHtml),
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
        });
      });
  }

  conentConvertion(html) {
    if (html === "<p></p>\n" || html === "<p></p>") {
      html = "";
    }
    if (html) {
      const headerContentBlock = convertFromHTML(html);
      const headerContentState = ContentState.createFromBlockArray(
        headerContentBlock
      );
      const HeaderEditorState = EditorState.createWithContent(
        headerContentState
      );
      return HeaderEditorState;
    } else {
      return "";
    }
  }

  onHeaderEditorStateChange: Function = HeaderEditorState => {
    this.setState({ HeaderEditorState });
  };
  onFooterEditorStateChange: Function = FootereditorState => {
    this.setState({ FootereditorState });
  };
  onFaqEditorStateChange: Function = FaqeditorState => {
    this.setState({ FaqeditorState });
  };

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
          <ul>
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
              <Editor
                editorState={HeaderEditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onHeaderEditorStateChange}
              />
            </li>
            <li>
              <label>Footer Content</label>
              <Editor
                editorState={FootereditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onFooterEditorStateChange}
              />
            </li>
            <li>
              <label>Freaquently Asked Questions</label>
              <Editor
                editorState={FaqeditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onFaqEditorStateChange}
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