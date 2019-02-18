import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Banner.css";

class FlightsSaveData extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form_data: props.formData
		};
	}
	render() {
		return (
			<div>
			<ul>
					<li>
						<label>Og title</label>
						<input type="text" value={form_data.title} />
					</li>
					<li>
						<label>Og description</label>
						<input type="text" value={form_data.description} />
					</li>
					<li>
						<label>heading</label>
						<input type="text" value={form_data.heading} />
					</li>
					<li>
						<label>Keywords</label>
						<input type="text" value={form_data.keyword} />
					</li>
					<li>
						<label>content</label>
						<input type="text" value={form_data.content} />
					</li>
				</ul>
			</div>
		);
	}
}
export default FlightsSaveData;
