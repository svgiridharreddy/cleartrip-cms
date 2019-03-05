import React, { Component } from 'react'
import { MDBBtn, MDBDataTable } from 'mdbreact';
import "./css/Flights.css";
import axios from "axios";
import fetch from 'fetch'
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
            data: [],
            apiResponse: false,
            approval_table: '',
            uniq_flight_schedule_routes: { columns: [], rows: [] },
            uniq_flight_to: { columns: [], rows: [] },
            uniq_flight_from: { columns: [], rows: [] },
            uniq_flight_booking_overview: { columns: [], rows: [] },
            uniq_flight_booking_pnrweb: { columns: [], rows: [] },
            uniq_flight_booking_routes: { columns: [], rows: [] },
            unique_flight_ticket_route: { columns: [], rows: [] },
            common: { columns: [], rows: [] },
            tabData: { columns: [], rows: [] }

        }
        this.createTable = this.createTable.bind(this)
        this.approveRoute = this.approveRoute.bind(this)
    }
    getTableData(table_name) {
        let _self = this
        let approval_table = _self.state.approval_table
        return new Promise(function (resolve) {
            let user_data = localStorage.getItem("user_data");
            if (user_data && table_name != "") {
                let userdata = JSON.parse(user_data)
                userdata["table_name"] = table_name
                axios.get(host() + "/flights-approvaldata", { params: userdata }).then(function (json) {
                    _self.setState({
                        data: json.data.data
                    })
                    if (_self.state.data.length > 0) {
                        let thead = table_name
                        let obj = {}
                        let columns_data = []
                        let rows_data = []
                        let cols = _self.createTable("columns", thead, {})
                        if (cols) {
                            columns_data = cols
                        }
                        _self.state.data.map((row) => {
                            let rowdata = _self.createTable("rows", thead, row)
                            if (rowdata) {
                                rows_data.push(rowdata)
                            }
                        })
                        obj["columns"] = columns_data
                        obj["rows"] = rows_data
                        if (obj["columns"] && obj["columns"].length > 0 && obj["rows"] && obj["rows"].length > 0) {
                            _self.setState({
                                tabData: obj
                            })
                        }

                    }
                    return resolve(json)
                }).catch(e => {
                    // loginHelpers.logout()
                    // NotificationManager.error(e.message, "Something went wrong", 1800);
                    // return setTimeout(function () {
                    //     window.location.replace("/")
                    // }, 2000)
                })
            }
        })
    }
    componentDidMount() {
        let _self = this
        if (loginHelpers.check_usertype()) {
            this.setState({ is_admin: true })
        } else {
            sessionStorage.removeItem("user_data");
            loginHelpers.check_usertype()
        }
    }
    approveRoute(id, table_name) {
        debugger
        let _self = this
        let tabData = _self.state.tabData
        let data = { id: id, table_name: table_name }
        return new Promise(function (resolve) {
            axios.get(host() + "/route-approval", { params: data }).then(function (json) {
                let index = ''
                let removeId = tabData["rows"].map((row, i) => {
                    if (id == row.id) {
                        index = i
                        return i
                    }
                })
                tabData["rows"].splice(index, 1)
                _self.getTableData(_self.state.approval_table)
                NotificationManager.success(
                    "successfully approved",
                    "success",
                    1500
                );
                _self.setState({ apiResponse: true, tabData: tabData })
                resolve(json)
            }).catch({
            })
        })

    }
    createTable(type, thead, data) {
        let _self = this
        let obj_data = _self.state
        if (thead === "uniq_flight_schedule_routes" || thead == "unique_flight_ticket_route") {
            let columns_data = []
            let columns = ["id", "Domain-Language-Section", "page_type", "page_subtype", "url", "source", "destination"]
            if (type == "columns") {
                columns.map(col => {
                    let obj = { label: col, field: col, width: 150 }
                    columns_data.push(obj)
                })
                obj_data[thead][type] = columns_data
                return columns_data
            } else {
                let tabObj = {}
                columns.map(col => {
                    if (col === "Domain-Language-Section") {
                        tabObj["Domain-Language-Section"] = data["domain"] + "-" + data["section"] + "-" + data["language"]
                    } else {
                        tabObj[col] = data[col]
                    }
                })
                tabObj["approve"] = <MDBBtn color='default' className="editBtn" rounded size='sm' onClick={() => this.approveRoute(data.id, thead)}>approve</MDBBtn>
                return tabObj
            }
        } else if (thead == "uniq_flight_to" || thead == "uniq_flight_from") {
            let columns_data = []
            let columns = ["id", "Domain-Language-Section", "page_type", "page_subtype", "url", "city_name"]
            if (type == "columns") {
                columns.map(col => {
                    let obj = { label: col, field: col, width: 150 }
                    columns_data.push(obj)
                })
                obj_data[thead][type] = columns_data
                return columns_data
            } else {
                let tabObj = {}
                columns.map(col => {
                    if (col === "Domain-Language-Section") {
                        tabObj["Domain-Language-Section"] = data["domain"] + "-" + data["section"] + "-" + data["language"]
                    } else {
                        tabObj[col] = data[col]
                    }
                })
                tabObj["approve"] = <MDBBtn color='default' className="editBtn" rounded size='sm' onClick={() => this.approveRoute(data.id, thead)}>approve</MDBBtn>
                return tabObj
            }
        } else if (thead == "uniq_flight_booking_overview" || thead == "uniq_flight_booking_pnrweb" || thead == "uniq_flight_booking_routes") {
            let columns_data = []
            let columns = ["id", "Domain-Language-Section", "page_type", "page_subtype", "url", "airline_name"]
            if (thead == "uniq_flight_booking_routes") {
                columns.push("source", "destination")
            }
            if (type == "columns") {
                columns.map(col => {
                    let obj = { label: col, field: col, width: 150 }
                    columns_data.push(obj)
                })
                obj_data[thead][type] = columns_data
                return columns_data
            } else {
                let tabObj = {}
                columns.map(col => {
                    if (col === "Domain-Language-Section") {
                        tabObj["Domain-Language-Section"] = data["domain"] + "-" + data["section"] + "-" + data["language"]
                    } else {
                        tabObj[col] = data[col]
                    }
                })
                tabObj["approve"] = <MDBBtn color='default' className="editBtn" rounded size='sm' onClick={() => this.approveRoute(data.id, thead)}>approve</MDBBtn>
                return tabObj
            }

        }else if(thead == "common"){
            let columns_data = []
            let columns = ["id", "Domain-Language-Section", "page_type", "page_subtype"]
            if (type == "columns") {
                columns.map(col => {
                    let obj = { label: col, field: col, width: 150 }
                    columns_data.push(obj)
                })
                obj_data[thead][type] = columns_data
                return columns_data
            } else {
                let tabObj = {}
                columns.map(col => {
                    if (col === "Domain-Language-Section") {
                        tabObj["Domain-Language-Section"] = data["domain"] + "-" + data["section"] + "-" + data["language"]
                    } else {
                        tabObj[col] = data[col]
                    }
                })
                tabObj["approve"] = <MDBBtn color='default' className="editBtn" rounded size='sm' onClick={() => this.approveRoute(data.id, thead)}>approve</MDBBtn>
                return tabObj
            }
        }
    }
    handleChange(e) {
        let _self = this
        _self.setState({
            [e.target.name]: e.target.value
        })
        this.getTableData(e.target.value)
    }
    render() {
         if(loginHelpers.check_usertype()){
            console.log("super")
         }else{
            NotificationManager.info("Forbidden", "You are not eligible to access this page", 1800);
             setTimeout(function () {
              window.location.replace("/")
            }, 2000)
         }
        const { data, tabData, is_admin, approval_table } = this.state
        return (
            <div>
                <p>Select table to approve </p>
                <select name="approval_table" onChange={this.handleChange.bind(this)} value={approval_table}>
                    <option value="" selected disabled={true}>Table name</option>
                    <option value="uniq_flight_schedule_routes">Uniq Flight Schedule Routes</option>
                    <option value="uniq_flight_to">Uniq Flight To</option>
                    <option value="uniq_flight_from">Uniq Flight From</option>
                    <option value="uniq_flight_booking_overview">Uniq Flight Booking Overview</option>
                    <option value="uniq_flight_booking_pnrweb">Uniq Flight Booking Pnrweb</option>
                    <option value="uniq_flight_booking_routes">Uniq Flight Booking Routes</option>
                    <option value="unique_flight_ticket_route">Unique Flight Ticket Route</option>
                    <option value="common">Common</option>
                </select>
                <div className={is_admin && data.length > 0 ? "" : "hidden"}>
                    <p>List of data need to approve in flights</p>
                    {tabData["columns"] && tabData["columns"].length > 0 && tabData["rows"] && tabData["rows"].length > 0 ? <MDBDataTable btn
                        striped
                        bordered
                        autoWidth
                        orderable={false}
                        data={tabData}
                    /> : ""}
                    <NotificationContainer />
                </div>
            </div>
        )
    }
}
export default FlightsApprovalPending
