import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form, Row, Col, ButtonToolbar } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const API_URL = 'http://localhost:3000'

class ViewCommonHotelData extends Component {
	constructor(props) {
		super(props)
		this.state = {
				commonResult: [],
				isDeleted: false
		}
	}

	componentDidMount() {
		var pathName = API_URL + this.props.location.pathname
		fetch(pathName)
		.then(response => response.json())
		.then(resData => {
				this.setState({ commonResult: [resData] })
		})
	}

	handleDelete(item){
    axios.delete(`${API_URL}/hotels/delete/${item.id}`)
      .then(res => {
          console.log(res.message);
          this.setState({ isDeleted: true })
      })
      .catch((err) => {
          console.log(err);
      })
	}

	// getData(){
	// 	setTimeout( () => {
	// 		fetch(pathName)
 //      .then((response) => { this.setState({ result: response.data }) }); 
	// 	}, 1000)
	// }

	render() {
		const { isDeleted, commonResult } = this.state
		if (isDeleted) {
			return <Redirect to="/hotels" />
		}
		return(
				<div className = "common-data">
					{ 
						commonResult.map( (item, i) => {
							return (
									<div style={{marginTop: 10}} key={i}>
		                <h3>View data </h3>
		                <Form>
										  <Form.Group as={Row} controlId="formHorizontalDomainName">
										    <Form.Label column sm={2}>
										      Domain Name
										    </Form.Label>
										    <Col sm={10}>
										    	<span>{ item.domain_name }</span>
										    </Col>
										  </Form.Group>

										  <Form.Group as={Row} controlId="formHorizontalContnetSection">
										    <Form.Label column sm={2}>
										      Content Section
										    </Form.Label>
										    <Col sm={10}>
										      <span>{ item.content_type } </span>
										    </Col>
										  </Form.Group>
										  <Form.Group as={Row} controlId="formHorizontalCountryName">
										    <Form.Label column sm={2}>
										      Country Name
										    </Form.Label>
										    <Col sm={10}>
										      <span>{ item.country_name } </span>
										    </Col>
										  </Form.Group>
										  <Form.Group as={Row} controlId="formHorizontalPageType">
										    <Form.Label column sm={2}>
										      Page Type
										    </Form.Label>
										    <Col sm={10}>
										      <span>{ item.page_type } </span>
										    </Col>
										  </Form.Group>
										  <Form.Group as={Row} controlId="formHorizontalMetaTitle">
										    <Form.Label column sm={2}>
										      Meta Title
										    </Form.Label>
										    <Col sm={10}>
										      <span>{ item.meta_title } </span>
										    </Col>
										  </Form.Group>
										  <Form.Group as={Row} controlId="formHorizontalMetaDescription">
										    <Form.Label column sm={2}>
										      Meta Description
										    </Form.Label>
										    <Col sm={10}>
										      <span>{ item.meta_description } </span>
										    </Col>
										  </Form.Group>
										  <Form.Group as={Row} controlId="formHorizontalMetaKeywords">
										    <Form.Label column sm={2}>
										      Meta Keywords
										    </Form.Label>
										    <Col sm={10}>
										      <span>{ item.meta_keyword } </span>
										    </Col>
										  </Form.Group>
										  <Form.Group as={Row} controlId="formHorizontalHeaderContent">
										    <Form.Label column sm={2}>
										      Header Content
										    </Form.Label>
										    <Col sm={10}>
										      <span>{ item.top_content } </span>
										    </Col>
										  </Form.Group>
										  <Form.Group as={Row} controlId="formHorizontalFooterContent">
										    <Form.Label column sm={2}>
										      Footer Content
										    </Form.Label>
										    <Col sm={10}>
										      <span>{ item.bottom_content } </span>
										    </Col>
										  </Form.Group>
										  <Form.Group as={Row} controlId="formHorizontalFaq">
										    <Form.Label column sm={2}>
										      Frequently Asked Questions
										    </Form.Label>
										    <Col sm={10}>
										      <span>{ item.faq } </span>
										    </Col>
										  </Form.Group>
										  <ButtonToolbar>
										  	<Button variant="info" size="lg"><Link to={`/hotels/edit/commondata/${item.id}`}>Edit</Link></Button>
										  	<Button variant="danger" onClick={this.handleDelete.bind(this, item)}>Delete</Button>
										  </ButtonToolbar>
										</Form>
		            	</div>
								)
					}) 
				}
				</div>
			)
	}
} 

export default ViewCommonHotelData;