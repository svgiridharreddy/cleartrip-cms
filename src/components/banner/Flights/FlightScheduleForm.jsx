import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Banner.css";

class FlightScheduleForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form_data: props.formData[0],
			id: "",
			page_type: ""
		};
	}
	editFields() {
		axios({
			method: "post",
			url: "http://localhost:3000/update_flights_data",
			data: this.state.form_data
		}).then(response => {
			debugger;
		});
	}
	handleChange(field, e) {
		e.preventDefault();
		let _self = this;
		let form_data = this.state.form_data;
		form_data[e.target.name] = e.target.value;
		_self.setState({
			form_data
		});
		debugger;
	}
	render() {
		let _self = this;
		let indexDefaults = [
			"id",
			"page_type",
			"language",
			"page_subtype",
			"section",
			"domain"
		];
		let form_data = this.state.form_data;
		let form_elements = Object.keys(form_data).map((ele, k) => {
			if (!indexDefaults.includes(ele)) {
				return (
					<li>
						<label>{ele}</label>
						<input
							type="text"
							value={form_data[ele]}
							name={ele}
							onChange={this.handleChange.bind(this, ele)}
						/>
					</li>
				);
			}
		});
		return (
			<div>
				<ul className="editFormFields">
					{form_elements}
					<li>
						<button
							type="button"
							onClick={this.editFields.bind(this)}
						>
							Edit
						</button>
					</li>
				</ul>
			</div>
		);
	}
}
export default FlightScheduleForm;
