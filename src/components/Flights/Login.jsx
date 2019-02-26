import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Redirect } from "react-router";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import loginHelpers from '../../../helper'
import "../Banner.css";

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			loginCredentials: {
				username: "",
				password: ""
			},
			showErrormsg: false
		};
	}
	handleClose() {
		this.setState({ show: false, showErrormsg: false });
	}
	handleShow() {
		this.setState({ show: true, showErrormsg: false });
	}
	handleChange(fieldName, e) {
		let _self = this;
		let loginCredentials = this.state.loginCredentials;
		_self.setState({
			showErrormsg: false
		});
		loginCredentials[e.target.name] = e.target.value;
		_self.setState({
			loginCredentials
		});
	}
	handleValidate() {
		let _self = this;
		let loginCredentials = _self.state.loginCredentials;
		if (
			loginCredentials["username"] != "" &&
			loginCredentials["password"] != ""
		) {
			return true;
			_self.setState({
				showErrormsg: false
			});
		} else {
			_self.setState({
				showErrormsg: true
			});
			return false;
		}
	}
	checkCredentials() {
		let _self = this;
		let loginCredentials = _self.state.loginCredentials;
		if (this.handleValidate()) {
			axios
				.get("http://localhost:3000/user/login", {
					params: loginCredentials
				})
				.then(resp => {
					debugger
					sessionStorage.setItem("loginSuccess", true);
					_self.setState({
						showErrormsg: false,
						show:false
					});
				})
				.catch(err => {
					loginCredentials["username"] = "";
					loginCredentials["password"] = "";
					_self.setState({
						showErrormsg: true,
						loginCredentials: loginCredentials
					});
				});
		}
	}
	render() {
		let _self = this;
		let loginCredentials = _self.state.loginCredentials;
		return (
			<div>
				<Button variant="primary" onClick={this.handleShow.bind(this)}>
					Login
				</Button>
				<Modal
					show={this.state.show}
					onHide={this.handleClose.bind(this)}
				>
					<Modal.Header closeButton>
						<Modal.Title>Login to CMS.</Modal.Title>
					</Modal.Header>
					<span
						className={
							_self.state.showErrormsg ? "errormsg" : "hidden"
						}
					>
						plese enter correct credentials
					</span>
					<Modal.Body>
						<div>
							<label>username</label>
							<input
								type="text"
								name="username"
								value={loginCredentials.username}
								onChange={this.handleChange.bind(
									this,
									"username"
								)}
							/>
						</div>
						<div>
							<label>password</label>
							<input
								type="password"
								name="password"
								value={loginCredentials.password}
								onChange={this.handleChange.bind(
									this,
									"password"
								)}
							/>
						</div>
						<Button
							type="button"
							onClick={this.checkCredentials.bind(this)}
						>
							Login
						</Button>
					</Modal.Body>
				</Modal>
			</div>
		);
	}
}
export default Login;
