import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Banner.css";
import FlightScheduleForm from "./FlightScheduleForm";

class TableData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			resulstsObj: props.formData,
			openEditForm: false,
			form_data: {}
		};
		this.editRoute = this.editRoute.bind(this);
	}
	editRoute(rid, e) {
		e.preventDefault();
		if (rid) {
			let obj = {};
			obj = this.state.resulstsObj.map(a => {
				if (rid === a["id"]) {
					return a;
				}
			});
			this.setState({
				openEditForm: true,
				form_data: obj
			});
		}
	}
	render() {
		let _self = this;
		let resulstsObj = this.state.resulstsObj;
		const table_data = resulstsObj.map((tdata, k) => {
			return (
				<tr key={k}>
					<td>{tdata["id"]}</td>
					<td>{tdata["title"]}</td>
					<td>{tdata["description"]}</td>
					<td>{tdata["keyword"]}</td>
					<td>{tdata["heading"]}</td>
					<td>
						<a
							href=""
							onClick={this.editRoute.bind(this, tdata["id"])}
							id={tdata["id"]}
						>
							edit
						</a>
					</td>
					<td>
						<a href="">delete</a>
					</td>
				</tr>
			);
		});

		return (
			<div>
			{this.state.openEditForm ? <FlightScheduleForm formData={this.state.form_data}/> : 
				<div className="">
					<table>
						<thead>
							<tr>
								<th>Id</th>
								<th>Title</th>
								<th>Description</th>
								<th>keyword</th>
								<th>heading</th>
								<th colSpan="2" />
							</tr>
						</thead>
						<tbody>{table_data}</tbody>
					</table>
				</div>}
				{JSON.stringify(this.state.form_data)}
			</div>
		);
	}
}
export default TableData;
