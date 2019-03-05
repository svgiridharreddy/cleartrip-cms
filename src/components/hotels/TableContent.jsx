import React, { Component } from 'react';
import { Table, Button, Alert } from 'react-bootstrap';
import {MDBBtn, MDBDataTable} from 'mdbreact';

const uniqueColoumn = [{label: "Domain Url", field: "domain_url", width: 150}, {label: "Content Type", field: "content_type", width: 150}, {label: "Counry Name", field: "counry_name", width: 150}, {label: "Meta Title", field: "meta_title", width: 150}]

const commonColoumn = [{label: "Domain Name", field: "domain_name", width: 150}, {label: "Content Type", field: "content_type", width: 150}, {label: "Counry Name", field: "counry_name", width: 150}, {label: "Meta Title", field: "meta_title", width: 150}]


class TableContent extends Component {
	constructor(props){
		super(props)
	}

	render() {
		const data = {}
		let dataField;
		let rows = []
		const { tableResult, contentType } = this.props
		if (contentType === "Unique Data") {
				data["columns"] = uniqueColoumn
				tableResult.map((item, idx) => {
		      let obj = {}
		      obj["domain_url"] = item.domain_url
		      obj["content_type"] = item.content_type
		      obj["country_name"] = item.country_name
		      obj['meta_title'] = item.meta_title
		      obj["editbtn"] = <MDBBtn color='default' className ="editBtn" rounded size='sm' onClick={() => this.props.changeFunction("edit",item)}>Edit</MDBBtn>
		      obj["deletebtn"] = <MDBBtn color='default' rounded size='sm' className ="deleteBtn"  onClick={() => this.props.changeFunction("delete",item)}>Delete</MDBBtn>
		      rows.push(obj)
		    })
		    data["rows"] = rows
		} else if (contentType === "Common Data") {
				data["columns"] = commonColoumn
				tableResult.map((item, idx) => {
		      let obj = {}
		      obj["domain_name"] = item.domain_name
		      obj["content_type"] = item.content_type
		      obj["country_name"] = item.country_name
		      obj['meta_title'] = item.meta_title
		      obj["editbtn"] = <MDBBtn color='default' className ="editBtn" rounded size='sm' onClick={() => this.props.changeFunction("edit",item)}>Edit</MDBBtn>
		      obj["deletebtn"] = <MDBBtn color='default' rounded size='sm' className ="deleteBtn"  onClick={() => this.props.changeFunction("delete",item)}>Delete</MDBBtn>
		      rows.push(obj)
		    })
		    data["rows"] = rows
		}
		if (tableResult.length > 0) {
				dataField = (
				  <MDBDataTable btn
          striped
          bordered 
          autoWidth 
          orderable={false} 
          data={data}
        />
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


