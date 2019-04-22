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
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import queryString from 'query-string'
import JoditEditor from "jodit-react";
import ReactDiffViewer from 'react-diff-viewer'
import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

class FlightsApprovalPending extends Component {
    constructor(props) {
        super(props)
        this.state = {
            is_admin: false,
            data: [],
            apiResponse: false,
            tabData: { columns: [], rows: [] },
            show: false,
            modelData: "",
            approvedVal: false,
            loading: false,
            id: "",
            showEditModel: false,
            editData: "",
            postData: {}
        }
        this.createTable = this.createTable.bind(this)
        this.approveRoute = this.approveRoute.bind(this)
        this.getApprovelPendingRecord = this.getApprovelPendingRecord.bind(this)
        this.processTable = this.processTable.bind(this)
        this.updateRoute = this.updateRoute.bind(this)
    }

    handleEditClose() {
        this.setState({
            showEditModel: false
        })
    }
    updateRoute() {
        let _self = this
        return new Promise(function (resolve) {
            let data = { postData: _self.state.postData, id: _self.state.id, table_name: _self.state.approval_table }
            axios.get(host() + "/tableUpdate", { params: data }).then(function (json) {
                _self.setState({
                    showEditModel: false,
                    id: ''
                })
                NotificationManager.success("Record successfully updated", "Success", 3000)
                setTimeout(function () {
                    _self.getTableData(_self.state.approval_table)
                }, 100)
                return resolve(json);
            }).catch(error => {
                _self.setState({
                    showEditModel: false
                })
                NotificationManager.error("", "Please try again", 3000)
            })
        })
    }
    handleClose() {
        this.setState({ show: false });
    }

    handleShow(data) {
        let modelData = ""
        if (data["last_modified_list"].length > 0) {
            modelData = data["last_modified_list"].map((el, i) => {
                let oldvalue = ''
                let newValue = ''
                if (el === "h1Tag") {
                    oldvalue = data["prev_version"]["heading"] || ''
                    newValue = data["heading"] || ''
                } else if (el === "keywords") {
                    oldvalue = data["prev_version"]["keyword"] || ''
                    newValue = data["keyword"] || ''
                } else {
                    oldvalue = data["prev_version"][el] || ''
                    newValue = data[el] || ''
                }
                if (data["prev_version"]) {
                    if (el === "faq_object" || el === "reviews_object") {
                        oldvalue = JSON.stringify(data["prev_version"][el])
                        newValue = JSON.stringify(data[el])
                    }
                    if (oldvalue &&  newValue) {
                        return (<div key={i}><span className="diffHeading">{el}</span><ReactDiffViewer
                            oldValue={oldvalue}
                            newValue={newValue}
                            splitView={true}
                        /></div>)
                    }
                }
            })
        } else {
            modelData = "<p>No data changed to view</p>"
        }
        this.setState({ show: true, modelData: modelData });
    }

    createTable(type, thead, data) {
        let _self = this
        let obj_data = _self.state
        let columns_data = []
        let columns = []
        columns = ["Domain-Section-Language", "page_type", "page_subtype", "url"]
        columns.push("Last modified", "Approval status")
        if (type == "columns") {
            columns.map(col => {
                let obj = { label: col, field: col, width: 150 }
                columns_data.push(obj)
            })
            return columns_data
        } else {
            let tabObj = {}
            columns.map(col => {
                if (col === "Domain-Section-Language") {
                    tabObj["Domain-Section-Language"] = data["domain"] + "-" + data["section"] + "-" + data["language"]
                } else if (col === "Last modified") {
                    let lastModifiedArray = []
                    let mapFields = { title: "Title", heading: "H1 tag", h1Tag: "H1 tag", keyword: "Keywords", keywords: "Keywords", description: "Description", faq_object: "Faq data", reviews_object: "Reviews", content: "Content",content_tabs_data:"Content tabs data",bottom_content:"Bottom Content",h2_lowest_fare_title:"H2 lowest fare title" }
                    if (data["last_modified_list"] && data["last_modified_list"].length > 0) {
                        data["last_modified_list"].map((v, k) => {
                            if (mapFields[v]) {
                                lastModifiedArray.push(mapFields[v])
                            }
                        })
                    }
                    tabObj["Last modified"] = lastModifiedArray.join(",")
                } else {
                    tabObj[col] = data[col] ? data[col] : ""
                }
            })
            tabObj["Approval status"] = <label className="toggleswitch"><input type="checkbox" checked={data.is_approved ? true : false} onClick={() => this.approveRoute(data, thead)} /><span className="slider round" /></label>
            tabObj["edit"] = <button key={data.id} type="button" className="btn btn-default btn-sm btn-rounded Ripple-parent"><a className="editButton"  href={'/flights?table_name=' + thead + '&id=' + data["id"]}>Edit</a></button>
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
                        loading: false,
                        data: json.data.data
                    });
                    _self.processTable(table_name)
                    return resolve(json);
                }).catch(error => {
                    _self.setState({
                        loading: false
                    })
                    NotificationManager.error("Record Not found", "Please try again", 3000)
                    setTimeout(function () {
                        window.location.replace("/")
                    }, 800)
                })
            }
        }).catch(function (e) {
            console.log(e)
        })
    }

    processTable(table_name) {
        let _self = this
        let obj = {};
        let columns_data = [];
        let rows_data = [];
        let cols = _self.createTable("columns", "", {});
        if (cols) {
            columns_data = cols;
        }
        if (Object.keys(_self.state.data).length > 0) {
            let keys = Object.keys(_self.state.data)
            keys.map((val, i) => {
                if (_self.state.data[val] && _self.state.data[val].length > 0) {
                    _self.state.data[val].map((row, j) => {
                        let rowdata = _self.createTable("rows", val, row);
                        if (rowdata) {
                            rows_data.push(rowdata);
                        }
                    })
                }
            })
            obj["columns"] = columns_data;
            obj["rows"] = rows_data;
        }
        if (
            obj["columns"] &&
            obj["columns"].length > 0 &&
            obj["rows"] &&
            obj["rows"].length > 0
        ) {
            _self.setState({
                tabData: obj,
                loading: false
            });
        } else {
            NotificationManager.info("Please edit any route to approve", "No data to approve", 3000);
        }
        _self.setState({
            loading: false
        })
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
                        if (data.length == 0) {
                            NotificationManager.info("Please edit any route to approve", "No data to approve", 3000);
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
        if (Object.keys(search_params).length > 0) {
            _self.setState({
                loading: true,
                approval_table: search_params["table_name"],
                id: search_params["id"]
            })
            setTimeout(function () {
                if (_self.state.approval_table && _self.state.approval_table != "") {
                    _self.getApprovelPendingRecord(_self.state.approval_table, _self.state.id)
                }
            }, 1000)
        } else {
            _self.setState({ loading: true })
            return new Promise(function (resolve) {
                axios.get(host() + "/approval-data").then(function (json) {
                    _self.setState({
                        data: json.data.data
                    });
                    _self.processTable()
                    return resolve(json);
                }).catch(error => {
                    NotificationManager.error("Record Not found", "Please try again", 3000)
                    setTimeout(function () {
                        window.location.replace("/")
                    }, 800)
                })
            })
        }
    }
    approveRoute(rdata, table_name) {
        let id = rdata.id
        let approval_status = !rdata.is_approved
        let _self = this
        let data = _self.state.data
        _self.setState({ loading: true })
        let tabData = _self.state.tabData
        let pdata = { id: id, table_name: table_name, approval_status: approval_status }
        data[table_name].map((v, i) => {
            if (v["id"] === id) {
                v["is_approved"] = !v["is_approved"]
            }
        })
        _self.setState({ data: data })
        _self.processTable(table_name)
        return new Promise(function (resolve) {
            axios.get(host() + "/bulk-approval", { params: pdata }).then(function (json) {
                //  _self.getTableData(_self.state.approval_table)
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
                _self.setState({ loading: false })
                resolve(json)
            }).catch(err => {
                _self.setState({
                    loading: false
                })
            })
        })
    }

    render() {
        const { data, tabData, is_admin, loading, modelData } = this.state;
        return (
            <div>
                <div className={loading ? "loading" : ""}></div>
                <Modal
                    size="lg"
                    onHide={this.handleClose.bind(this)}
                    dialogClassName="modal-90w"
                    aria-labelledby="example-modal-sizes-title-lg"
                    show={this.state.show} onHide={this.handleClose.bind(this)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            Route information
            </Modal.Title>
                    </Modal.Header>
                    {modelData}
                    <Modal.Body></Modal.Body>
                </Modal>
                <h2>List of data need to approve in flights</h2>
                <div className={is_admin && Object.keys(data).length > 0 ? "" : "hidden"}>
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
