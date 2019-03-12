import React, { Component } from 'react';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
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
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {Button} from "react-bootstrap";

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
			faq: '',
			headerEditorState: EditorState.createEmpty(),
			footerEditorState: EditorState.createEmpty(),
			faqEditorState: EditorState.createEmpty()
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.contentConvertion = this.contentConvertion.bind(this);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e) {
		this.props.handleChangeData(this.state)
	}

	contentConvertion(html) {
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

	onHeaderEditorStateChange: Function = (headerEditorState) => {
		let convertedData = draftToHtml(
			convertToRaw(headerEditorState.getCurrentContent())
		);
		convertedData = convertedData.replace(/"/g, "'");
		this.setState({
			headerEditorState: convertedData
		});
	};

	onFooterEditorStateChange: Function = (footerEditorState) => {
		let convertedData = draftToHtml(
			convertToRaw(footerEditorState.getCurrentContent())
		);
		convertedData = convertedData.replace(/"/g, "'");
		this.setState({
			footerEditorState: convertedData
		});
	};
	onFaqEditorStateChange: Function = (faqEditorState) => {
		let convertedData = draftToHtml(
			convertToRaw(faqEditorState.getCurrentContent())
		);
		convertedData = convertedData.replace(/"/g, "'");
		this.setState({
			faqEditorState: convertedData
		});
	};

	render() {
		const { headerEditorState, footerEditorState, faqEditorState } = this.state;
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
							<Editor
								headerEditorState={headerEditorState}
								wrapperClassName="demo-wrapper"
								editorClassName="demo-editor"
								onEditorStateChange={this.onHeaderEditorStateChange}
							/>
						</li>
						<li>
							<label>Footer Content</label>
							<Editor
								footerEditorState={footerEditorState}
								wrapperClassName="demo-wrapper"
								editorClassName="demo-editor"
								onEditorStateChange={this.onFooterEditorStateChange}
							/>
						</li>
						<li>
							<label>Frequently Asked Questions</label>
							<Editor
								faqEditorState={faqEditorState}
								wrapperClassName="demo-wrapper"
								editorClassName="demo-editor"
								onEditorStateChange={this.onFaqEditorStateChange}
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
