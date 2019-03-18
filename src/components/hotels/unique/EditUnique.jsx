import React, { Component } from "react";
import { host } from '../../helper';
import {Button} from "react-bootstrap";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
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
      faqs: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.returnOptions = this.returnOptions.bind(this);
    this.handleHeaderModelChange = this.handleHeaderModelChange.bind(this);
    this.handleFooterModelChange = this.handleFooterModelChange.bind(this);
    this.handleFaqModelChange = this.handleFaqModelChange.bind(this);
    this.onChageFaq = this.onChageFaq.bind(this);
  }

  addNewFaq(e) {
    let _self = this
    let faqs = this.state.faqs
    let addNew = true
    faqs.map((faq, i) => {
      if (faq["question"] != "" && faq["answer"] != "") {
        addNew = true
      } else {
        addNew = false
      }
    })
    if (addNew) {
      faqs.push({ question: "", answer: "" })
      _self.setState({
        faqs: faqs
      })
    } else {
      NotificationManager.error("Please Fill All Faq's Properly", "Field Missing", "3000")
    }
  }
  removeFaq(e) {
    let _self = this
    let faqs = this.state.faqs
    let index = parseInt(e.target.dataset.btnid)
    faqs.splice(faqs[index], 1)
    _self.setState({
      faqs: faqs
    })
  };
  onChageFaq(e) {
    let _self = this
    let faqs = _self.state.faqs
    let qIndex = parseInt(e.target.dataset.question)
    let aIndex = parseInt(e.target.dataset.answer)
    let index = e.target.name === "question" ? qIndex : aIndex
    faqs[index][e.target.name] = e.target.value
    _self.setState({
      faqs: faqs
    })
  }

  componentDidMount() {
    var pathName = API_URL + this.props.contentRecord.id;
    fetch(pathName)
      .then(response => response.json())
      .then(resData => {
        var faqContent = (resData.faqs === null || resData.faqs === "") ? [] : JSON.parse(resData.faqs) || []
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
          faqs: faqContent
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
      faqs,
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
              <label>H2 Title(Search widget tag line)</label>
              <input type="text" value={h2_tag} name="h2_tag" onChange={this.handleChange} />
            </li>
            <li>
              <label>H3 Title(Search widget tag line)</label>
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
            {/*<li>
              <label>Freaquently Asked Questions</label>
              <FroalaEditor
                model={this.state.faq}
                base="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4"
                onModelChange={this.handleFaqModelChange}
              />
            </li>*/}
            <li>
              <label>Faq Content</label>
              {
                faqs.map((val, i) => {
                  return (
                    <div className="faqData">
                      <label>Question {i + 1}: </label>
                        <input type="text" onChange={this.onChageFaq.bind(i)} name="question" data-question={i} value={faqs[i]["question"]} />
                      <label>Answer {i + 1}:</label>
                        <input type="text" onChange={this.onChageFaq.bind(i)} name="answer" data-answer={i} value={faqs[i]["answer"]} />
                      {
                        i == faqs.length - 1 ? 
                        <div>
                          <button type="button" className="plusButton" onClick={this.removeFaq.bind(this)} data-btnid={i}>-</button>
                          <button type="button" className="plusButton" onClick={this.addNewFaq.bind(this)} data-btnid={i}>+</button> 
                        </div>
                          : 
                        <div>
                          <button type="button" className="plusButton" onClick={this.removeFaq.bind(this)} data-btnid={i}>-</button>
                        </div>
                      }
                    </div>
                  )
                })
              }
              {
                faqs.length === 0 ? <button type="button"
                        className="plusButton" onClick={this.addNewFaq.bind(this)} data-btnid={0}>+</button> : ""
              }
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
