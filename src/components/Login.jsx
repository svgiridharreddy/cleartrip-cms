import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

import "../../node_modules/react-notifications/lib/notifications.css";
import { host } from "./helper";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      loginCredentials: {
        username: "",
        password: ""
      },
      showErrormsg: false,
      host: host()
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
      _self.setState({
        showErrormsg: false,
        loginCredentials
      });
      return true;
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
        .get(this.state.host + "/user/login", {
          params: loginCredentials
        })
        .then(resp => {
          let data = resp.data["authenticated"];
          sessionStorage.setItem("user_data", JSON.stringify(data));
          _self.setState({
            showErrormsg: false,
            show: false
          });
          NotificationManager.success("successfully login", "login", 1500);
          setTimeout(function() {
            window.location.reload();
          }, 1000);
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
        <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
          <Modal.Header closeButton>
            <Modal.Title>Login to CMS.</Modal.Title>
          </Modal.Header>
          <span className={_self.state.showErrormsg ? "errormsg" : "hidden"}>
            plese enter correct credentials
          </span>
          <Modal.Body>
            <div>
              <label>username</label>
              <input
                type="text"
                name="username"
                value={loginCredentials.username}
                onChange={this.handleChange.bind(this, "username")}
              />
            </div>
            <div>
              <label>password</label>
              <input
                type="password"
                name="password"
                value={loginCredentials.password}
                onChange={this.handleChange.bind(this, "password")}
              />
            </div>
            <Button type="button" onClick={this.checkCredentials.bind(this)}>
              Login
            </Button>
          </Modal.Body>
        </Modal>
        <NotificationContainer />
      </div>
    );
  }
}
export default Login;
