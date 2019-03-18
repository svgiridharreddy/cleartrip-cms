import React, { Component } from "react";
import { MDBBtn, MDBDataTable, MDBSwitch } from "mdbreact";
import "./css/Flights.css";
import axios from "axios";
import Promise from "promise"
import fetch from "fetch";
import { host } from "../helper";
import loginHelpers from "../helper";
import { Modal } from "react-bootstrap";
import {
    NotificationContainer,
    NotificationManager
} from "react-notifications";
import "../../../node_modules/react-notifications/lib/notifications.css";
import Loader from 'react-loader-spinner'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import queryString from 'query-string'
import { func } from "prop-types";

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
            tabData: { columns: [], rows: [] },
            show: false,
            modelData: "",
            approvedVal: false,
            loading: true,
            id: ""
        }
        this.createTable = this.createTable.bind(this)
        this.approveRoute = this.approveRoute.bind(this)
        this.getApprovelPendingRecord = this.getApprovelPendingRecord.bind(this)
        this.processTable = this.processTable.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
    }

    handleClose() {
        this.setState({ show: false });
    }
    handleShow(data) {
        let showArr = ["domain", "page_type", "language", "page_subtype", "section", "url", "title", "description", "keyword", "heading", "source", "destination", "content", "h2_schedule_title", "h2_calendar_title", "h2_lowest_fare_title", "faq_object"]
        let modelData = showArr.map((ele, i) => {
            if (showArr.indexOf(ele) > -1 && data[ele] && data[ele] != "") {
                return (
                    ele === "faq_object" && data[ele].length > 0 ? data[ele].map((v, k) => {
                        return(<li key={k}>
                             <b className="showFieldName">{k == 0 ? ele.replace("_", " ")+":" : ""}</b><br /><b>{v["question"]}</b><br />{v["answer"]}
                        </li>)
                    }) :
                        <li key={i}>
                            <b className="showFieldName">{ele.replace("_", " ")}:</b>{ele === "content" ? ReactHtmlParser(data[ele]) : data[ele]}
                        </li>
                );
            }
        });
        this.setState({ show: true, modelData: modelData });
    }
    handleEdit(data){
        debugger
    }
    createTable(type, thead, data) {
        let _self = this
        let obj_data = _self.state
        let columns_data = []
        let columns = []
        if (thead === "uniq_flight_schedule_routes" || thead == "unique_flight_ticket_route") {
            columns = ["Domain-Section-Language", "page_type", "page_subtype", "url", "source", "destination"]
        }
        else if (thead == "uniq_flight_to" || thead == "uniq_flight_from") {
            columns = ["Domain-Section-Language", "page_type", "page_subtype", "url", "city_name"]
        }
        else if (thead == "uniq_flight_booking_overview" || thead == "uniq_flight_booking_pnrweb" || thead == "uniq_flight_booking_routes") {
            columns = ["Domain-Section-Language", "page_type", "page_subtype", "url", "airline_name"]
            if (thead == "uniq_flight_booking_routes") {
                columns.push("source", "destination")
            }
        }
        else if (thead == "common") {
            columns = ["Domain-Section-Language", "page_type", "page_subtype"]
        }
        columns.push("Approval status")
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
                if (col === "Domain-Section-Language") {
                    tabObj["Domain-Section-Language"] = data["domain"] + "-" + data["section"] + "-" + data["language"]
                } else {
                    tabObj[col] = data[col]
                }
            })
            tabObj["Approval status"] = <label className="toggleswitch"><input type="checkbox" checked={data.is_approved ? true : false} onClick={() => this.approveRoute(data, thead)} /><span className="slider round" /></label>
            // tabObj["approve"] = <MDBBtn key={data.id} color='default' className="editBtn" rounded size='sm' onClick={() => this.approveRoute(data.id, thead)} disabled={data.is_approved ? true : false}>{data.is_approved ? "Approved" : "Approve"}</MDBBtn>
            // tabObj["edit"] = <MDBBtn key={data.id} color='default' className="showBtn" rounded size='sm' onClick={() => this.handleEdit(data)} >Edit</MDBBtn>
            tabObj["view"] = <MDBBtn key={data.id} color='default' className="showBtn" rounded size='sm' onClick={() => this.handleShow(data)} >show</MDBBtn>
            return tabObj
        }
    }

    getApprovelPendingRecord(table_name, id) {
        let _self = this
        return new Promise(function (resolve) {
            let user_data = localStorage.getItem("user_data");
            if (user_data && table_name != "" && id != '') {
                let userdata = JSON.parse(user_data);
                userdata["id"] = id
                userdata["table_name"] = table_name;
                axios.get(host() + "/flights-approvaldata", { params: userdata }).then(function (json) {
                    _self.setState({
                        data: json.data.data
                    });
                    _self.processTable(table_name)
                    return resolve(json);
                })
            }

        }).catch(function (e) {
            console.log(e)
        })
    }

    processTable(table_name) {
        let _self = this
        let thead = table_name;
        let obj = {};
        let columns_data = [];
        let rows_data = [];
        let cols = _self.createTable("columns", thead, {});
        if (cols) {
            columns_data = cols;
        }
        _self.state.data.map(row => {
            let rowdata = _self.createTable("rows", thead, row);
            if (rowdata) {
                rows_data.push(rowdata);
            }
        });
        obj["columns"] = columns_data;
        obj["rows"] = rows_data;
        if (
            obj["columns"] &&
            obj["columns"].length > 0 &&
            obj["rows"] &&
            obj["rows"].length > 0
        ) {
            _self.setState({
                tabData: obj
            });
        }
    }
    getTableData(table_name) {
        let _self = this;
        _self.setState({ loading: true })
        let approval_table = _self.state.approval_table;
        return new Promise(function (resolve) {
            let user_data = localStorage.getItem("user_data");
            if (user_data && table_name != "") {
                let userdata = JSON.parse(user_data);
                userdata["table_name"] = table_name;
                axios
                    .get(host() + "/flights-approvaldata", { params: userdata })
                    .then(function (json) {
                        let data = json.data.data
                        if (_self.state.id) {
                            data = data.filter(function (a) {
                                if (_self.state.id == a.id) {
                                    return a
                                }
                            })
                        }
                        _self.setState({
                            data: data
                        });

                        if (_self.state.data.length > 0) {
                            _self.processTable(table_name)
                        }
                        _self.setState({ loading: false })
                        return resolve(json);
                    })
                    .catch(e => {
                        // loginHelpers.logout()
                        // NotificationManager.error(e.message, "Something went wrong", 1800);
                        // return setTimeout(function () {
                        //     window.location.replace("/")
                        // }, 2000)
                    });
            }
        });
    }
    componentDidMount() {
        let _self = this;
        if (loginHelpers.check_usertype()) {
            this.setState({ is_admin: true });
        } else {
            sessionStorage.removeItem("user_data");
            loginHelpers.check_usertype();
        }
        let search_params = queryString.parse(this.props.location.search)
        _self.setState({
            approval_table: search_params["table_name"],
            id: search_params["id"]
        })

        setTimeout(function () {
            _self.getApprovelPendingRecord(_self.state.approval_table, _self.state.id)
        }, 300)
    }
    approveRoute(rdata, table_name) {
        let id = rdata.id
        let approval_status = !rdata.is_approved
        let _self = this
        _self.setState({ loading: true })
        let tabData = _self.state.tabData
        let data = { id: id, table_name: table_name, approval_status: approval_status }
        return new Promise(function (resolve) {
            axios.get(host() + "/route-approval", { params: data }).then(function (json) {
                _self.getTableData(_self.state.approval_table)
                setTimeout(function () {
                    if (approval_status) {
                        NotificationManager.success(
                            "successfully approved",
                            "success",
                            2000
                        );
                    } else {
                        NotificationManager.info(
                            "successfully un-approved",
                            "un-approved",
                            2000
                        );
                    }
                }, 1500)
                _self.setState({ apiResponse: true, tabData: tabData, loading: false })
                resolve(json)
            }).catch({
            })
        })

    }
    handleChange(e) {
        let _self = this;
        _self.setState({
            [e.target.name]: e.target.value,
            id: ''
        });
        this.getTableData(e.target.value);
    }
    render() {
        if (loginHelpers.check_usertype()) {
            console.log("super");
        } else {
            NotificationManager.info(
                "Forbidden",
                "You are not eligible to access this page",
                2000
            );
            setTimeout(function () {
                window.location.replace("/");
            }, 2300);
        }

        const { data, tabData, is_admin, approval_table, modelData, loading } = this.state;
        return (
            <div>
                <p>Select table to approve </p>
                <select
                    name="approval_table"
                    onChange={this.handleChange.bind(this)}
                    value={approval_table} className="approval_table"
                >
                    <option value="" selected disabled={true}>
                        Table name
          </option>
                    <option value="uniq_flight_schedule_routes">
                        Uniq Flight Schedule Routes
          </option>
                    <option value="uniq_flight_to">Uniq Flight To</option>
                    <option value="uniq_flight_from">Uniq Flight From</option>
                    <option value="uniq_flight_booking_overview">
                        Uniq Flight Booking Overview
          </option>
                    <option value="uniq_flight_booking_pnrweb">
                        Uniq Flight Booking Pnrweb
          </option>
                    <option value="uniq_flight_booking_routes">
                        Uniq Flight Booking Routes
          </option>
                    <option value="unique_flight_ticket_route">
                        Unique Flight Ticket Route
          </option>
                    <option value="common">Common</option>
                </select>
                {/* {loading ? <Loader
                    type="Watch"
                    color="#e16f4b"
                    height="15%"
                    width="5%"
                /> : ""} */}
                <Modal
                    size="lg"
                    onHide={this.handleClose.bind(this)}
                    dialogClassName="modal-90w preview-content"
                    aria-labelledby="example-modal-sizes-title-lg"
                    show={this.state.show} onHide={this.handleClose.bind(this)} centered
                >
                    <Modal.Header closeButton>
                        Route information
                    </Modal.Header>
                    <Modal.Body>
                        <ul className="showModel">
                            {modelData}
                        </ul>
                    </Modal.Body>
                </Modal>
                <div className={is_admin && data.length > 0 ? "" : "hidden"}>
                    <h2>List of data need to approve in flights</h2>
                    {tabData["columns"] &&
                        tabData["columns"].length > 0 &&
                        tabData["rows"] &&
                        tabData["rows"].length > 0 ? (
                            <MDBDataTable
                                btn
                                striped
                                bordered
                                autoWidth
                                orderable="false"
                                data={tabData}
                            />
                        ) : (
                            ""
                        )}
                    <NotificationContainer />
                </div>
            </div>
        );
    }
}
export default FlightsApprovalPending;
