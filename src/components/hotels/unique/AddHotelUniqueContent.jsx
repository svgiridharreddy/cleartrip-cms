import React, { Component } from 'react';
import axios from 'axios';
import { Alert, Button } from 'react-bootstrap';
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

const API_URL = 'http://13.251.49.54:82'
const AUTO_COMPLETE = "http://13.251.49.54:82/country_autocomplete"

class HotelUniqueContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			domain_url: '',
			content_type: 'Unique Data',
			domain_name: this.props.domain_name,
			country_name: this.props.country_name,
			h1_tag: '',
			h2_tag: '',
			h3_tag: '',
			meta_title: '',
			meta_description: '',
			meta_keyword: '',
			top_content: '',
			bottom_content: '',
			faq: ''
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleHeaderModelChange = this.handleHeaderModelChange.bind(this);
		this.handleFooterModelChange = this.handleFooterModelChange.bind(this);
		this.handleFaqModelChange = this.handleFaqModelChange.bind(this);
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
		return (
			<div className="common-hotel-wrapper">
				<div className="common-hotel-content">
					<ul className="common-hotels-field">
						<li>
        					<Button variant="secondary" onClick ={() => this.props.backBtnFun()}>Back</Button>
       					</li>
						<li>
							<label>Domain Url</label>
							<input type="text" name="domain_url" onChange={this.handleChange} value={this.state.domain_url} />
						</li>
						<li>
							<label>Content Section</label>
							<input value={this.state.content_type} name="content_type" />
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
						<button
							type="button"
							onClick={this.handleSubmit}
							className="button">
							Submit
	          			</button>
					</ul>
				</div>

				<div className="clearfix"></div>
			</div>
		)
	}
}

export default HotelUniqueContent;
