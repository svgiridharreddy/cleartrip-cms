import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:3000'

class EditUniqueContent extends Component {
	constructor(props){
		super(props)
		this.state = {
				domain_url: '',
				content_type: 'Unique Data',
				country_name: '',
				canonical_tag: '',
				meta_title: '',
				meta_description: '',
				meta_keyword:'',
				top_content: '',
				bottom_content: '',
				faq: '',
				message: '',
				isUpdate: false
		}
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		var pathName = API_URL + this.props.location.pathname
		fetch(pathName)
		.then(response => response.json())
		.then(resData => {
				this.setState({ 
					domain_url: resData.domain_url,
					content_type: resData.content_type,
					country_name: resData.country_name,
					canonical_tag: resData.canonical_tag,
					meta_title: resData.meta_title,
					meta_description: resData.meta_description,
					meta_keyword: resData.meta_keyword,
					top_content: resData.top_content,
					bottom_content: resData.bottom_content,
					faq: resData.faq 
				})
		})
	} 

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		const data = this.state
		axios.post(`${API_URL}/hotels/update/uniquedata/${this.props.match.params.id}`, data)
		.then(({ data }) => {
				this.setState({
					message: data.message,
					isUpdate: true
					 // MusicGraph returns an object named data, 
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
						meta_keyword:'',
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

	render() {
		const { isUpdate, domain_url, content_type, country_name, canonical_tag, meta_title, meta_description, meta_keyword, top_content, bottom_content, faq } = this.state
		if (isUpdate) {
			return <Redirect to="/hotels" />
		}
		return(
			<div>
				{this.state.message}
				<h3 align="center">Update Unique Domain Url Data</h3>
				<Form onSubmit={this.handleSubmit}>
				  <Form.Group as={Row} controlId="formHorizontalDomainUrl">
				    <Form.Label column sm={2}>
				      Domain Url
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={domain_url} name="domain_url" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>

				  <Form.Group as={Row} controlId="formHorizontalContnetSection">
				    <Form.Label column sm={2}>
				      Content Section
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control value={ content_type } name="content_type" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalCountryName">
				    <Form.Label column sm={2}>
				      Country Name
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ country_name } name="country_name" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalCanonicalTag">
				    <Form.Label column sm={2}>
				      Canonical Tag
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ canonical_tag } name="canonical_tag" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalMetaTitle">
				    <Form.Label column sm={2}>
				      Meta Title
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ meta_title } name="meta_title" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalMetaDescription">
				    <Form.Label column sm={2}>
				      Meta Description
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ meta_description } name="meta_description" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalMetaKeywords">
				    <Form.Label column sm={2}>
				      Meta Keywords
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ meta_keyword } name="meta_keyword" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalTopContent">
				    <Form.Label column sm={2}>
				      Top Content
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ top_content } name="top_content" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalFooterContent">
				    <Form.Label column sm={2}>
				      Footer Content
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ bottom_content } name="bottom_content" onChange={this.handleChange} />
				    </Col>
				  </Form.Group>
				  <Form.Group as={Row} controlId="formHorizontalFaq">
				    <Form.Label column sm={2}>
				      Frequently Asked Questions
				    </Form.Label>
				    <Col sm={10}>
				      <Form.Control type="text" value={ faq } name="faq" onChange={this.handleChange} />
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