import React, { Component } from 'react'
import { MDBBtn, MDBDataTable } from 'mdbreact';
import "./css/Flights.css";
import axios from "axios";
import Promise from "promise"
import { host } from "../helper";
import loginHelpers from "../helper";
import {
    NotificationContainer,
    NotificationManager
} from "react-notifications";
import "../../../node_modules/react-notifications/lib/notifications.css";

class FlightsApprovalPending extends Component {
    constructor(props) {
        super(props)
        this.state = {
            is_admin: false,
            data: {}
        }
    }
    componentWillMount() {
        if (loginHelpers.check_usertype()) {
            this.setState({ is_admin: true })
        } else {
            sessionStorage.removeItem("user_data");
            loginHelpers.check_usertype()
        }
        return new Promise(function (resolve) {
            let user_data = sessionStorage.getItem("user_data");
            if (user_data) {
                axios.get(host() + "/flights-approvaldata", { params: JSON.parse(user_data) }).then(function (json) {
                    debugger
                    resolve(json)
                    return true;
                }).catch(e => {
                    loginHelpers.logout()
                    NotificationManager.error(e.message, "Something went wrong", 1800);
                    return setTimeout(function () {
                        window.location.replace("/")
                    }, 2000)
                })
            }
        })
    }

    render() {
        loginHelpers.checkUser()
        return (
            <div className={this.state.is_admin ? "" : "hidden"}>
                <p>List of data need to approve in flights</p>
                <NotificationContainer />
            </div>
        )
    }
}
export default FlightsApprovalPending