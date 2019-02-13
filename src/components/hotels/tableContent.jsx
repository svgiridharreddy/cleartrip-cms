import React, { Component } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:3000"


class TableContent extends Component {
	constructor(props){
			super(props)
			this.state = {
				isDeleted: false
			}
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
		if ((this.props.content_type === "Common Data") && (this.props.isDataPresent) && (this.props.tableResult.length > 0)) {
			dataField = (
			  <Table striped bordered>
			    <tbody>
			      {
        			this.props.tableResult.map((item, i) => {
        				return(
        					<tr key={i}>
			        			<td>{item.domain_name}</td>
			        			<td>{item.country_name}</td>
			        			<td>{item.page_type}</td>
			        			<td>{item.content_type}</td>
			        			<td>
			        				<Button variant="success" size="sm" block>
			        					<Link to={`hotels/show/commondata/${item.id}`}>View</Link>
										  </Button>
			        			</td>
			        			<td>
			        				<Button variant="info" size="sm" block><Link to={`/hotels/edit/commondata/${item.id}`}>Edit</Link></Button>
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
			)
		} else if ((this.props.content_type === "Unique Data") && (this.props.isDataPresent) && (this.props.tableResult.length > 0)) {
			dataField = (
				  <Table striped bordered>
				    <tbody>
				      {
	        			this.props.tableResult.map((item, i) => {
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
			)
		} else {
			dataField = (
					<div>
						<Alert variant="info">
					    Your searched result not found, you can add by clicking Add button here.
					  </Alert>
						<Button>
							<Link to={`hotels/${this.props.linkURl}`}>Add</Link>
						</Button>
					</div>
				)
		}
		return(
				<div>
					{dataField}
				</div>
			)
	}
}

export default TableContent;


