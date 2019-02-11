import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, FormControl, Button, Table, Alert, ButtonToolbar } from 'react-bootstrap';
import axios from 'axios';

const QUERY_URL = "http://localhost:3000/hotels/unique-content-data-collection" 
const API_URL = "http://localhost:3000"


class UniqueContentDataCollection extends Component {
	constructor() {
		super()
		this.state = {
			query: '',
			results: [],
			uniqueData: ''
		}
		this.getInfo = this.getInfo.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}


	getInfo = () => {
		axios.get(`${QUERY_URL}?prefix=${this.state.query}`).then((response) => {
			var cdnuniqueData = response.data.length !== 0 ? "present" : "notpresent"
			this.setState({
					uniqueData: cdnuniqueData, results: response.data
			})
		})
	}

	handleInputChange = (event) => {
	    this.setState({
	      query: this.search.value
	    }, () => {
	      if (this.state.query && this.state.query.length > 5) {
	          this.getInfo()
	      } 
	    })
	}

	handleDelete(item){
		const url = API_URL + "/hotels/" + item.id
    axios.delete(url)
      .then(res => {
          console.log(res.message);
          this.setState({ isDeleted: true })
      })
      .catch((err) => {
          console.log(err);
      })
	}

	render() {
		let dataField;
		if (this.state.uniqueData === "present") {
			dataField = (
					<div>
					  <Table striped bordered>
					    <tbody>
					      {
		        			this.state.results.map((item, i) => {
		        				return(
		        					<tr key={i}>
					        			<td>{item.domain_url}</td>
					        			<td>{item.content_type}</td>
					        			<td>{item.meta_title}</td>
					        			<td>
					        				<Button variant="success" size="sm" block>
					        					<Link to={`hotels/show/uniquedata/${item.id}`}>View</Link>
												  </Button>
					        			</td>
					        			<td>
					        				<Button variant="info" size="sm" block><Link to={`/hotels/edit/uniquedata/${item.id}`}>Edit</Link></Button>
					        			</td>
					        			<td>
					        				<Button variant="danger" size="sm" block onClick={this.handleDelete.bind(this, item)}>Delete</Button>
					        			</td>
					        		</tr>
		        					)
		        			})
		        		}
					    </tbody>
					  </Table>
					</div>
				)
		} else if (this.state.uniqueData === "notpresent") {
			dataField = (
					<div>
						<Alert variant="info">
					    Your searched data not present, you can add data by clicking Add button here.
					  </Alert>
						<button onClick={this.handleAddForm}>
							<Link to={`hotels/addUniquedata`}>Add</Link>
						</button>
					</div>
				)
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