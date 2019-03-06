import React, { Component } from 'react'
import { MDBBtn, MDBDataTable } from 'mdbreact';
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

const uniqueColoumn = [{label: "Domain Url", field: "domain_url", width: 150}, {label: "Content Type", field: "content_type", width: 150}, {label: "Counry Name", field: "counry_name", width: 150}, {label: "Meta Title", field: "meta_title", width: 150}]

const commonColoumn = [{label: "Domain Name", field: "domain_name", width: 150}, {label: "Content Type", field: "content_type", width: 150}, {label: "Counry Name", field: "counry_name", width: 150}, {label: "Meta Title", field: "meta_title", width: 150}]

class HotelsApprovalPending extends Component {
    constructor(props) {
        super(props)
        this.state = {
            host: host(),
            approvalData: [],
            contentType: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.approveFunction = this.approveFunction.bind(this)
    }

    approveFunction(item) {
      axios.get(`${this.state.host}/approve/${item.id}`)
      .then((response) => {
        if(response.data.message) {
          NotificationManager.info("Data Approved", "Approve", 1500);
          axios.get(`${this.state.host}/collect/${this.state.contentType}`)
          .then((resp) => {
            this.setState({
               approvalData: resp.data
            })
          })
        }
      })
      .catch(function(error) {
        console.log(error);
      });
    }

    handleChange(e) {
      var contentType = e.target.value;
      if (contentType !== '') {
        axios.get(`${this.state.host}/collect/${contentType}`)
        .then((response) => {
          this.setState({
             approvalData: response.data,
             contentType: contentType
          })
        })
      }
    }

    render() {
      const data = {}
      let dataField;
      let rows = []
      const { approvalData, contentType } = this.state
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
            obj["approveBtn"] = <MDBBtn color='default' rounded size='sm' className ="deleteBtn"  onClick={() => this.approveFunction(item)} disabled={item.is_approved}>{textName}</MDBBtn>
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
            obj["approveBtn"] = <MDBBtn color='default' rounded size='sm' className ="deleteBtn"  onClick={() => this.approveFunction(item)}>Approve</MDBBtn>
            rows.push(obj)
          })
          data["rows"] = rows
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
              <select name="content_type" onChange={this.handleChange}>
                  <option value="" selected disabled={true}>Select Content</option>
                  <option value="unique-data">Unique Content Data</option>
                  <option value="common-data">Common Content Data</option>
              </select>
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
