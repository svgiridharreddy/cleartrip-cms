import React, { Component } from 'react';
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

class AddCommonForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			h1_tag: '',
			h2_tag: '',
			h3_tag: '',
			meta_title: '',
			meta_description: '',
			meta_keyword: '',
			top_content: '',
			bottom_content: '',
			faqs: []
		}
		this.handleChange = this.handleChange.bind(this);
	 	this.handleSubmit = this.handleSubmit.bind(this);
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
		faqs.splice(index, 1)
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
		this.props.handleChangeData(this.state)
	}

	render() {
		const { faqs } = this.state
		return(
			<div className="common-hotel-wrapper">
			<div className="common-hotel-content">
					<ul>
					<li>
    					<Button variant="secondary" onClick ={() => this.props.backBtnFun()}>Back</Button>
   					</li>
						<li>
              <label>H1 Title</label>
              <input type="text" name="h1_tag" onChange={this.handleChange} value={this.state.h1_tag} />
            </li>
            <li>
              <label>H2 Title(Search widget tag line)</label>
              <input type="text" name="h2_tag" onChange={this.handleChange} value={this.state.h2_tag} />
            </li>
            <li>
              <label>H3 Title(Search widget tag line)</label>
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
	              Submit
	            </button>
            </li>
					</ul>
					<div className="clearfix"></div>
					</div>
				</div>
			)
	}
}

export default AddCommonForm;