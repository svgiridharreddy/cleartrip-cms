import React, { Component } from 'react'
import { MDBBtn, MDBDataTable } from 'mdbreact';
import axios from "axios";
import fetch from 'fetch'
import Promise from "promise"
import { host } from "../helper";
import loginHelpers from "../helper";
import { Modal } from "react-bootstrap";
import Select1 from 'react-select';
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "../../../node_modules/react-notifications/lib/notifications.css";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { debug } from 'util';
const uniqueColoumn = [{ label: "Domain Url", field: "domain_url", width: 150 }, { label: "Content Type", field: "content_type", width: 150 }, { label: "Counry Name", field: "counry_name", width: 150 }, { label: "Meta Title", field: "meta_title", width: 150 },{ label: "Approval status", field: "Approval status", width: 150 }]

const commonColoumn = [{ label: "Domain Name", field: "domain_name", width: 150 }, { label: "Content Type", field: "content_type", width: 150 }, { label: "Counry Name", field: "counry_name", width: 150 }, { label: "Meta Title", field: "meta_title", width: 150 },{ label: "Approval status", field: "Approval status", width: 150 }]

const domainType = ["IN", "AE", "SA", "QA", "OM", "BH", "KW"]

const QUERY_URL = host() + "/cmshotels/unique-content-data-collection"

class HotelsApprovalPending extends Component {
  constructor(props) {
    super(props)
    this.state = {
      host: host(),
      domain_name: '',
      country_name: '',
      approvalData: [],
      contentType: '',
      show: false,
      isUniq: false,
      hotelData: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.approveFunction = this.approveFunction.bind(this);
    this.returnOptions = this.returnOptions.bind(this);
    this.handleChangeUniqueData = this.handleChangeUniqueData.bind(this);
  }

  returnOptions(optData) {
    return optData.map((dmName, i) => {
      return (
        <option key={i} value={dmName}>
          {dmName}
        </option>
      );
    });
  }

  handleChangeUniqueData(e){
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSelectedInput = (p, source) => {
    this.setState({
      [source]: p.value,
      selectedCountry: p
    })
    if(this.state.domain_name !== '' &&  p.value !== '') {
      const data = { content_type: "unique data", domain_name: this.state.domain_name, country_name: p.value }
      axios.post(`${QUERY_URL}`, data)
        .then(res => {
            this.setState({
              approvalData: res.data,
              contentType: "unique-data"
            })
        })
        .catch((err) => {
            console.log(err);
        })
    }
  }

  handleAutoSearch = (e, source) => {
    if (e !== "" && e.length > 2) {
      axios.get(`${this.state.host}/country_autocomplete?country=${e}`)
      .then((response) => {
        this.setState({
           options: response.data
        })
      })
    }
  }

  handleClose() {
    this.setState({ show: false });
  }
  handleShow(data) {
    let showArr = ["country_name", "domain_name", "domain_url", "content_type", "page_type", "meta_title", "meta_description", "canonical_tag", "meta_keyword", "header_tag", "h1_tag", "h2_tag", "h3_tag", "top_content", "bottom_content", "faq"]
    let hotelData = showArr.map((ele, i) => {
      if (showArr.indexOf(ele) > -1 && data[ele] && data[ele] != "") {
        return (
          <li key={i}>
            <b>{ele}:</b>{ele == "top_content" || ele === "bottom_content" || ele === "faq" ? ReactHtmlParser(data[ele]) : data[ele]}
          </li>
        );
      }
    });
    this.setState({ show: true, hotelData: hotelData });
  }
  approveFunction(item) {
    let _self = this
    return new Promise(function (resolve) {
      axios.get(`${_self.state.host}/approve/${item.id}`).then((response) => {
        if (response.status == 200) {
          return new Promise(function () {
            if (_self.state.contentType === "common-data") {
              axios.get(`${_self.state.host}/collect/${_self.state.contentType}`)
              .then((resp) => {
                _self.setState({
                  approvalData: resp.data
                })
                resolve(resp)
                if(item.is_approved){
                  NotificationManager.info("Data UN-Approved", "UN-Approve", 1500);
                }else{
                  NotificationManager.success("Data Approved", "Approve", 1500);
                }
              })
            } else {
              var data = { content_type: "unique data", domain_name: this.state.domain_name, country_name: this.state.country_name }
              axios.post(`${QUERY_URL}`,data)
              .then((resp) => {
                _self.setState({
                  approvalData: resp.data
                })
                resolve(resp)
                if(item.is_approved){
                  NotificationManager.info("Data UN-Approved", "UN-Approve", 1500);
                }else{
                  NotificationManager.success("Data Approved", "Approve", 1500);
                }
              })
            }
          })
        }
      }).catch(function (error) {
          console.log(error);
        });
    })
  }

  handleChange(e) {
    var contentType = e.target.value;
    if (contentType === 'common-data') {
      axios.get(`${this.state.host}/collect/common-data`)
        .then((response) => {
          this.setState({
            approvalData: response.data,
            contentType: contentType,
            isUniq: false
          })
        })
    } else if (contentType === "unique-data") {
      this.setState({
        isUniq: true
      })
    }
  }

  render() {
    const data = {}
    let dataField;
    let uniqueDataField;
    let rows = []
    const { approvalData, contentType, hotelData, isUniq } = this.state

    if (isUniq) {
      uniqueDataField = (
            <div className="top-wrapper">
              <div className="filter-fileds">
                <ul className="list-inline">
                  <li>
                    <label>Domain Name</label>
                    <select
                      onChange={this.handleChangeUniqueData}
                      name="domain_name"
                      value={this.state.domain_name}
                    >
                      <option value="" disabled={true} selected>
                        Domain Type
                      </option>
                      {this.returnOptions(domainType)}
                    </select>
                  </li>
                  <li>
                    <label>Country Name</label>
                    <Select1
                        value={this.state.selectedCountry}
                        name="country_name"
                        onChange={p => this.handleSelectedInput(p, "country_name")}
                        onInputChange={e => this.handleAutoSearch(e, "country_name")}
                        options={this.state.options}
                    />
                  </li>
                </ul>
                <div className="clearfix"></div>
              </div>
            <div className="clearfix"></div>
          </div>
        )
    }

    if (approvalData.length > 0) {
      if (contentType === "unique-data") {
        data["columns"] = uniqueColoumn
        approvalData.map((item, idx) => {
          let obj = {}
          let textName;
          textName = item.is_approved ? "Approved" : "Approve"
          obj["domain_url"] = item.domain_url
          obj["content_type"] = item.content_type
          obj["country_name"] = item.country_name
          obj['meta_title'] = item.meta_title
          // obj["approveBtn"] = <MDBBtn color='default' rounded size='sm' className="deleteBtn" onClick={() => this.approveFunction(item)} disabled={item.is_approved}>{textName}</MDBBtn>
          obj["on/off"] = <label className="toggleswitch"><input type="checkbox" checked={item.is_approved} onClick={() => this.approveFunction(item)} /><span className="slider round" /></label>
          obj["show"] = <MDBBtn color='default' className="showBtn" rounded size='sm' onClick={() => this.handleShow(item)} >show</MDBBtn>
          rows.push(obj)
        })
        data["rows"] = rows
      } else if (contentType === "common-data") {
        data["columns"] = commonColoumn
        approvalData.map((item, idx) => {
          let obj = {}
          obj["domain_name"] = item.domain_name
          obj["content_type"] = item.content_type
          obj["country_name"] = item.country_name
          obj['meta_title'] = item.meta_title
          // obj["approveBtn"] = <MDBBtn color='default' rounded size='sm' className="deleteBtn" onClick={() => this.approveFunction(item)} disabled={item.is_approved}>Approve</MDBBtn>
          obj["on/off"] = <label className="toggleswitch"><input type="checkbox" checked={item.is_approved} onClick={() => this.approveFunction(item)} /><span className="slider round" /></label>
          obj["show"] = <MDBBtn color='default' className="showBtn" rounded size='sm' onClick={() => this.handleShow(item)} >show</MDBBtn>
          rows.push(obj)
        })
        data["rows"] = rows
      }
    }
    if (approvalData.length > 0) {
      dataField = (
        <MDBDataTable btn
          striped
          bordered
          autoWidth
          orderable={false}
          data={data}
        />
      )
    }
    return (
      <div>
        <Modal
          size="lg"
          onHide={this.handleClose.bind(this)}
          dialogClassName="modal-90w"
          aria-labelledby="example-modal-sizes-title-lg"
          show={this.state.show} onHide={this.handleClose.bind(this)} centered
        >
          <Modal.Header closeButton>

          </Modal.Header>
          <Modal.Body>
            <ul className="showModel">
              {hotelData}
            </ul>
          </Modal.Body>
        </Modal>
        <select name="content_type" onChange={this.handleChange} className="approval_table">
          <option value="" selected disabled={true}>Select Content</option>
          <option value="unique-data">Unique Content Data</option>
          <option value="common-data">Common Content Data</option>
        </select>
        {uniqueDataField}
        <div className="appovalTable">
          {
            dataField
          }
          <NotificationContainer />
        </div>
      </div>
    )
  }
}
export default HotelsApprovalPending
