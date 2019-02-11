import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';

const API_URL = 'http://localhost:3000'

class EditUniqueContent extends Component {
	constructor(props){
		super(props)
		this.state = {
				result: {}
		}
	}

	componentDidMount() {
		var pathName = API_URL + this.props.location.pathname
		fetch(pathName)
		.then(response => response.json())
		.then(resData => {
				this.setState({ result: resData })
		})
	} 

	handleSubmit() {
		debugger;
	}

	render() {
		const { result } = this.state
		return(
			<div>
				<h3 align="center">Update Unique Domain Url Data</h3>
				<Form onSubmit={this.handleSubmit}>
				  <Form.Group as={Row} controlId="formHorizontalDomainUrl">
				    <Form.Label column sm={2}>
				      Domain Url
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={result.domain_url} name="domain_url" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>

				  <Form.Group as={Row} controlId="formHorizontalContnetSection">
				    <Form.Label column sm={2}>
				      Content Section
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control value={ result.content_type } name="content_type" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalCountryName">
				    <Form.Label column sm={2}>
				      Country Name
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ result.country_name } name="country_name" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalCanonicalTag">
				    <Form.Label column sm={2}>
				      Canonical Tag
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ result.canonical_tag } name="canonical_tag" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalMetaTitle">
				    <Form.Label column sm={2}>
				      Meta Title
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ result.meta_title } name="meta_title" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalMetaDescription">
				    <Form.Label column sm={2}>
				      Meta Description
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ result.meta_description } name="meta_description" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalMetaKeywords">
				    <Form.Label column sm={2}>
				      Meta Keywords
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ result.meta_keyword } name="meta_keyword" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalTopContent">
				    <Form.Label column sm={2}>
				      Top Content
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ result.top_content } name="top_content" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalFooterContent">
				    <Form.Label column sm={2}>
				      Footer Content
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ result.bottom_content } name="bottom_content" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalFaq">
				    <Form.Label column sm={2}>
				      Frequently Asked Questions
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ result.faq } name="faq" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row}>
				    <Col sm={{ span: 10, offset: 2 }}>
				      <Button type="submit">Update</Button>
				    </Col>
				  </Form.Group>
				</Form>
			</div>
			)
	}
}


export default EditUniqueContent;