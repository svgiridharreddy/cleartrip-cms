import React, { Component } from "react";
import { Button, Modal, Form, ButtonToolbar } from "react-bootstrap";
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
      changeState: props.changeState,
      loginCredentials: {
        username: "",
        password: ""
      },
      showErrormsg: false,
      host: host()
    };
  }

  componentDidMount(){
    let _self = this
    let user_data = localStorage.getItem("user_data")
    if(!user_data){
      _self.setState({
        show:true
      })
    }
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
checkCredentials(e) {
  e.preventDefault()
  let _self = this;
  let loginCredentials = _self.state.loginCredentials;
  if (this.handleValidate()) {
    axios({
      url:this.state.host + "/user/login",
      method:'post',
      data: loginCredentials

    }).then(resp => {
      let data = resp.data
      this.props.changeState()
      localStorage.setItem("user_data", JSON.stringify(data));
      _self.setState({
        showErrormsg: false,
        show: false,
        loginStatus: true
      });
      NotificationManager.success("successfully login", "login", 1500);
      setTimeout(function () {
        window.location.reload()
      }, 1800)
    }).catch(err => {
      loginCredentials["password"] = "";
      _self.setState({
        showErrormsg: true,
        loginCredentials: loginCredentials
      });
    })
  }
}
resetForm() {
  let _self = this
  let loginCredentials = _self.state.loginCredentials
  loginCredentials["username"] = "";
  loginCredentials["password"] = "";
  _self.setState({
    loginCredentials
  })
}
render() {
  let _self = this;
  let loginCredentials = _self.state.loginCredentials;
  return (
    <div>
    <Button variant="primary" onClick={this.handleShow.bind(this)}>
    Login
    </Button>
    <Modal show={this.state.show} onHide={this.handleClose.bind(this)} centered>
    <Modal.Header closeButton>
    <Modal.Title>Login to CMS</Modal.Title>
    </Modal.Header>
    <span className={_self.state.showErrormsg ? "errormsg" : "hidden"}>
    plese enter correct credentials
    </span>
    <Modal.Body>
    <form onSubmit={this.checkCredentials.bind(this)}>
    <Form.Group role="form">
    <Form.Label>Enter username</Form.Label>
    <Form.Control placeholder="Enter username/email" type="text"
    name="username"
    value={loginCredentials.username}
    onChange={this.handleChange.bind(this, "username")} />
    </Form.Group>
    <Form.Group role="form">
    <Form.Label>Enter Password</Form.Label>
    <Form.Control placeholder="password"
    type="password"
    name="password"
    value={loginCredentials.password}
    onChange={this.handleChange.bind(this, "password")} />
    </Form.Group>
    <ButtonToolbar>
    <Button type="submit"  onClick={this.checkCredentials.bind(this)} className="btn  btn-large  loginSubmitbtn">
    Login
    </Button>
    <Button variant="secondary" onClick={this.resetForm.bind(this)} className ="loginResetbtn">Reset</Button>
    </ButtonToolbar>
    </form>
    </Modal.Body>
    </Modal>
    <NotificationContainer />
    </div>
    );
}
}
export default Login;
