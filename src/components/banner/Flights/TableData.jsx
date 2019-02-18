import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Banner.css";

class TableData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form_data: props.formData,
			openEditForm: false
		};
		this.editRoute = this.editRoute.bind(this)
	}
	editRoute(rid,field){
		if(rid){
			this.setState({
				openEditForm:true
			})
		}
	}
	render() {
		let _self = this;
		let form_data = this.state.form_data;
		const table_data = form_data.map((tdata, k) => {
			debugger;
			return (
				<tr key={k}>
					<td>{tdata["id"]}</td>
					<td>{tdata["title"]}</td>
					<td>{tdata["description"]}</td>
					<td>{tdata["keyword"]}</td>
					<td>{tdata["heading"]}</td>
					<td><a href="" onClick={this.editRoute.bind(this,tdata["id"])} id={tdata["id"]}>edit</a></td>
					<td><a href="" >delete</a></td>
				</tr>
			);
		});

		return (
			<div>
			<div className="">
				<table>
				<thead>
					<tr>
						<th>Id</th>
						<th>Title</th>
						<th>Description</th>
						<th>keyword</th>
						<th>heading</th>
						<th colSpan="2"></th>
					</tr>
					</thead>
					<tbody>{table_data}</tbody>
				</table>
				</div>
			</div>
		);
	}
}
export default TableData;
