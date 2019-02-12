import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Col, ButtonToolbar } from "react-bootstrap";
class LinksComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headerLinks: [],
			RsideBarLinks: [],
			FooterLinks: []
		};
	}
	render() {
		return (
			<div>
				<Form>
				<h3>Header Links</h3>
					<Form.Row>
						<Form.Group as={Col}>
							<Form.Label>Header Name</Form.Label>
							<Form.Control type="textbox" name="country_code" />
						</Form.Group>
					</Form.Row>
				</Form>
			</div>
		);
	}
}
export default LinksComponent;
