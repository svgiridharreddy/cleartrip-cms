import React, { Component } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
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

const API_URL = 'http://localhost:3000'

class HotelUniqueContent extends Component {
	constructor(props) {
		super(props);
		this.state = { domain_url: '',
						content_type: 'Unique Data',
						country_name: '',
						canonical_tag: '',
						meta_title: '',
						meta_description: '',
						meta_keywords:'',
						top_content: '',
						bottom_content: '',
						faq: '',
						headerEditorState: EditorState.createEmpty(),
						footerEditorState: EditorState.createEmpty(),
						faqEditorState: EditorState.createEmpty(),
						message: ''
					 };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(event) {
		event.preventDefault();
		const data = this.state
		debugger;
		axios.post(`${API_URL}/hotels/content-section-data`, data)
		.then(({ data }) => {
				this.setState({
					message: data.message // MusicGraph returns an object named data, 
					// as does axios. So... data.data                             
				})
				setTimeout(function(){
					this.setState({
						domain_url: '',
						content_type: 'Unique Data',
						country_name: '',
						canonical_tag: '',
						meta_title: '',
						meta_description: '',
						meta_keywords:'',
						top_content: '',
						bottom_content: '',
						faq: '',
						message: ''
					})
				}.bind(this),2000)
		})
		.catch(function (error) {
	    console.log(error);
	  });
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
		const { message, headerEditorState, footerEditorState, faqEditorState } = this.state;
	    let alertMessage;
	    if(message !== '') {
	      alertMessage = (
	         <Alert variant="info">
	            { this.state.message }
	          </Alert>
	          )
	    }
		return(
			<div>
					{ alertMessage }
			<Form onSubmit={this.handleSubmit}>
			  <Form.Group as={Row} controlId="formHorizontalDomainUrl">
			    <Form.Label column sm={2}>
			      Domain Url
			    </Form.Label>
			    <Col sm={10}>
			      <Form.Control type="text" name="domain_url" onChange={this.handleChange} />
			    </Col>
			  </Form.Group>

			  <Form.Group as={Row} controlId="formHorizontalContnetSection">
			    <Form.Label column sm={2}>
			      Content Section
			    </Form.Label>
			    <Col sm={10}>
			      <Form.Control value={ this.state.content_type } name="content_type" onChange={this.handleChange} />
			    </Col>
			  </Form.Group>
			  <Form.Group as={Row} controlId="formHorizontalCountryName">
			    <Form.Label column sm={2}>
			      Country Name
			    </Form.Label>
			    <Col sm={10}>
			      <Form.Control type="text" name="country_name" onChange={this.handleChange} />
			    </Col>
			  </Form.Group>
			  <Form.Group as={Row} controlId="formHorizontalCanonicalTag">
			    <Form.Label column sm={2}>
			      Canonical Tag
			    </Form.Label>
			    <Col sm={10}>
			      <Form.Control type="text" name="canonical_tag" onChange={this.handleChange} />
			    </Col>
			  </Form.Group>
			  <Form.Group as={Row} controlId="formHorizontalMetaTitle">
			    <Form.Label column sm={2}>
			      Meta Title
			    </Form.Label>
			    <Col sm={10}>
			      <Form.Control type="text" name="meta_title" onChange={this.handleChange} />
			    </Col>
			  </Form.Group>
			  <Form.Group as={Row} controlId="formHorizontalMetaDescription">
			    <Form.Label column sm={2}>
			      Meta Description
			    </Form.Label>
			    <Col sm={10}>
			      <Form.Control type="text" name="meta_description" onChange={this.handleChange} />
			    </Col>
			  </Form.Group>
			  <Form.Group as={Row} controlId="formHorizontalMetaKeywords">
			    <Form.Label column sm={2}>
			      Meta Keywords
			    </Form.Label>
			    <Col sm={10}>
			      <Form.Control type="text" name="meta_keyword" onChange={this.handleChange} />
			    </Col>
			  </Form.Group>
			  <Form.Group as={Row} controlId="formHorizontalHeaderContent">
			    <Form.Label column sm={2}>
			      Header Content
			    </Form.Label>
			    <Col sm={10}>
			    	<Editor
			          headerEditorState={headerEditorState}
			          wrapperClassName="demo-wrapper"
			          editorClassName="demo-editor"
			          onEditorStateChange={this.onHeaderEditorStateChange}
			        />
			    </Col>
			  </Form.Group>
			  <Form.Group as={Row} controlId="formHorizontalFooterContent">
			    <Form.Label column sm={2}>
			      Footer Content
			    </Form.Label>
			    <Col sm={10}>
			      <Editor
			          footerEditorState={footerEditorState}
			          wrapperClassName="demo-wrapper"
			          editorClassName="demo-editor"
			          onEditorStateChange={this.onFooterEditorStateChange}
			        />
			    </Col>
			  </Form.Group>
			  <Form.Group as={Row} controlId="formHorizontalFaq">
			    <Form.Label column sm={2}>
			      Frequently Asked Questions
			    </Form.Label>
			    <Col sm={10}>
			      <Editor
			          faqEditorState={faqEditorState}
			          wrapperClassName="demo-wrapper"
			          editorClassName="demo-editor"
			          onEditorStateChange={this.onFaqEditorStateChange}
			        />
			    </Col>
			  </Form.Group>
			  <Form.Group as={Row}>
			    <Col sm={{ span: 10, offset: 2 }}>
			      <Button type="submit">Submit</Button>
			    </Col>
			  </Form.Group>
			</Form>
			</div>
			)
	}
}

export default HotelUniqueContent;
