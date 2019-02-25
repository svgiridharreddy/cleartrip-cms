import React, { Component } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:3000"


class TableContent extends Component {
	constructor(props){
			super(props)
			this.state = {
				tableResult: props.tableResult,
				content_type: props.content_type,
				isDataPresent: props.isDataPresent,
				linkURl: props.linkURl,
				isDeleted: false
			}
	}

	handleDelete(item){
      	var contentList = this.state.tableResult.filter(function(content) { return content.id != item.id });
		this.setState({ tableResult: contentList });
		const alrt = window.confirm('Are you sure you wish to delete this item?')
		if (alrt == true) {
		    axios.delete(`${API_URL}/cmshotels/delete/${item.id}`)
		      .then(res => {
		          console.log(res.message);
		          this.setState({ isDeleted: true })
		      })
		      .catch((err) => {
		          console.log(err);
		      })
		}
	}

	render() {
		let dataField;
		const { isDeleted, tableResult, content_type, isDataPresent, linkURl } = this.state
		// if (isDeleted) {
		// 	return <Redirect to="/hotels" />
		// }
		if ((content_type === "Common Data") && (isDataPresent) && (tableResult.length > 0)) {
			dataField = (
			  <Table striped bordered>
			  	<thead>
			  		<tr>
			  			<th>Domain Name</th>
			  			<th>Country Name</th>
			  			<th>Meta Title</th>
			  			<th>Meta Description</th>
			  			<th colSpan="2"></th>
			  		</tr>
			  	</thead>
			    <tbody>
			      {
        			tableResult.map((item, i) => {
        				return(
        					<tr key={i}>
			        			<td>{item.domain_name}</td>
			        			<td>{item.country_name}</td>
			        			<td>{item.meta_title}</td>
			        			<td>{item.meta_description}</td>
			        			{/*<td>
			        				<Button variant="success" size="sm" block>
			        					<Link to={`hotels/show/commondata/${item.id}`}>View</Link>
										  </Button>
			        			</td>*/}
			        			<td>
			        				<Button variant="info" size="sm" block><Link to={`/cmshotels/edit/${item.id}`}>Edit</Link></Button>
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
		} else if ((content_type === "Unique Data") && (isDataPresent) && (tableResult.length > 0)) {
			dataField = (
				  <Table striped bordered>
				  	<thead>
				  		<tr>
				  			<th>Client Path</th>
				  			<th>Country Name</th>
				  			<th>Meta Title</th>
				  			<th>Meta Description</th>
				  			<th colSpan="2"></th>
				  		</tr>
				  	</thead>
				    <tbody>
				      {
	        			tableResult.map((item, i) => {
	        				return(
	        					<tr key={i}>
				        			<td>{item.domain_url}</td>
				        			<td>{item.country_name}</td>
				        			<td>{item.meta_title}</td>
				        			<td>{item.meta_description}</td>
				        			{/*<td>
				        				<Button variant="success" size="sm" block>
				        					<Link to={`hotels/show/uniquedata/${item.id}`}>View</Link>
											  </Button>
				        			</td>*/}
				        			<td>
				        				<Button variant="info" size="sm" block><Link to={`/cmshotels/edit/${item.id}`}>Edit</Link></Button>
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
						<Button variant="info" size="lg">
							<Link to={`cmshotels/${linkURl}`}>Add</Link>
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


