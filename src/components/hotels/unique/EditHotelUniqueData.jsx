import React, { Component } from "react";
import {
  EditorState,
  ContentState,
  convertFromHTML
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { host } from '../../helper';

const API_URL = host()+"/cmshotels/edit/";

class EditUniqueContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      HeaderEditorState: "",
      FootereditorState: "",
      FaqeditorState: "",
      domain_url: "",
      content_type: '',
      country_name: "",
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
          domain_url: resData.domain_url,
          content_type: resData.content_type,
          country_name: resData.country_name,
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
      </div>
    );
  }
}

export default EditUniqueContent;
