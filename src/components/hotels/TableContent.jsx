import React, { Component } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';

class TableContent extends Component {
	constructor(props){
		super(props)
	}

	render() {
		let dataField;
		const { tableResult } = this.props
		if (tableResult.length > 0) {
				dataField = (
				  <Table striped bordered>
				  	<thead>
				  		<tr>
				  			<th>Content Section</th>
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
				        			<td>{item.content_type}</td>
				        			<td>{item.country_name}</td>
				        			<td>{item.meta_title}</td>
				        			<td>{item.meta_description}</td>
				        			<td>
				        				<Button variant="info" name="edit" size="sm" block onClick={() => this.props.changeFunction("edit",item)}>Edit</Button>
				        			</td>
				        			<td>
				        				<Button variant="danger" name="delete" size="sm" block onClick={() => this.props.changeFunction("delete",item)}>Delete</Button>
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
						<Button variant="info" name="add" size="lg" onClick={() => this.props.changeFunction("add",'')}>
							Add
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


