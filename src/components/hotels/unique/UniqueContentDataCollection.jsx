import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import axios from 'axios';
import TableContent from '../TableContent';

const QUERY_URL = "http://localhost:3000/hotels/unique-content-data-collection" 

class UniqueContentDataCollection extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: '',
			content_result: [],
			linkUrlValue: 'addUniquedata',
			content_type: props.content_type,
			isDataPresent: false
		}
		this.getInfo = this.getInfo.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}


	getInfo = () => {
		axios.get(`${QUERY_URL}?prefix=${this.state.query}`)
		.then((response) => {
			this.setState({
					isDataPresent: true,
				 content_result: response.data
			})
		})
	}

	handleInputChange = (event) => {
	    this.setState({
	      query: this.search.value
	    }, () => {
	      if (this.state.query) {
	          this.getInfo()
	      } 
	    })
	}

	render() {
		let dataField; 
		if (this.state.isDataPresent && this.state.query) {
				 dataField = <TableContent isDataPresent={this.state.isDataPresent} content_type={this.state.content_type} linkURl={this.state.linkUrlValue} tableResult={this.state.content_result} />
		}
		return(
				<div>
					    <FormControl type="text" placeholder="Search for Domain Url..." ref={input => this.search = input}
			          onChange={this.handleInputChange} className="mr-sm-8" style={{width: '50%'}} />
			          <br />
			        { dataField }
			    </div>
			)
	}
}

export default UniqueContentDataCollection;