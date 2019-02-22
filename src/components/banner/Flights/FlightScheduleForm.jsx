import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import FlightScheduleRevamp from "./FlightScheduleRevamp";
import "../Banner.css";
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
import FlashMassage from "react-flash-message";

class FlightScheduleForm extends Component {
  constructor(props) {
    super(props);
    let editorState = "";
    this.state = {
      form_data: props.formData,
      id: "",
      page_type: "",
      editorState: editorState,
      contentData: "",
      updateMsg: "",
      flashShow: false
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.state.form_data.content) {
      const html = this.state.form_data["content"];
      const contentBlock = convertFromHTML(html);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock);
        const editorState = EditorState.createWithContent(contentState);
        this.setState({
          editorState: editorState
        });
      }
    }
  }
	editFields() {
		debugger
		let _self = this;
		let form_data = this.state.form_data;
		if (this.state.editorState != "") {
			let convertedData = draftToHtml(
				convertToRaw(this.state.editorState.getCurrentContent())
			);
			convertedData = convertedData.replace(/"/g, "'");
			form_data["content"] = convertedData;
			_self.setState({
				form_data
			});
		}

		axios({
			method: "post",
			url: "http://localhost:3000/update_flights_data",
			data: this.state.form_data
		}).then(response => {
			if (response.status == 200) {
				_self.setState({
					updateMsg: response.data.message,
					flashShow: true
				});
				setTimeout(function() {
					window.location.reload();
				}, 1500);
			}
		});
	}
	onChange(editorState) {
		this.setState({ editorState });
	}

	handleChange(field, e) {
		e.preventDefault();
		let _self = this;
		let form_data = this.state.form_data;
		form_data[e.target.name] = e.target.value;
		_self.setState({
			form_data
		});
	}
	render() {
		let _self = this;
		const { editorState } = this.state;
		let indexDefaults = [
			"id",
			"page_type",
			"language",
			"page_subtype",
			"section",
			"domain",
			"content",
			"content_type",
			"source",
			"destination"
		];
		let form_data = this.state.form_data;
		let form_elements = Object.keys(form_data).map((ele, k) => {
			if (!indexDefaults.includes(ele)) {
				return (
					<li key={k}>
						<label>{ele}</label>
						<input
							type="text"
							value={form_data[ele]}
							name={ele}
							onChange={this.handleChange.bind(this, ele)}
						/>
					</li>
				);
			}
		});
		return (
			<div>
				<FlashMassage duration={10000} persistOnHover={true}>
					<span
						className={
							_self.state.flashShow
								? "flashMsg"
								: "flashMsg hidden"
						}
					>
						{_self.state.updateMsg}
					</span>
				</FlashMassage>

				<ul className="editFormFields">
					{form_elements}
					<Editor
						editorState={this.state.editorState}
						wrapperClassName="demo-wrapper"
						editorClassName="editer-content"
						onEditorStateChange={this.onChange}
					/>
					<li>
						<button
							type="button"
							className="button"
							onClick={this.editFields.bind(this)}
						>
							Edit
						</button>
					</li>
				</ul>
			</div>
		);
	}
}
export default FlightScheduleForm;
