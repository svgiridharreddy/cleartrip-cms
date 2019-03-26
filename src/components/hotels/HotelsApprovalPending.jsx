import React, { Component } from 'react'
import { MDBBtn, MDBDataTable } from 'mdbreact';
import axios from "axios";
import fetch from 'fetch'
import Promise from "promise"
import { host } from "../helper";
import loginHelpers from "../helper";
import { Modal } from "react-bootstrap";
import queryString from 'query-string'
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
const pageType = ["City", "Stars", "Locality", "Chain", "PropertyType", "Amenity", "Budget", "Landmark", "Hospital", "PropertyInLocality","Region"]
const localPageType = ["City", "Stars", "Locality", "Chain", "PropertyType", "Amenity", "Budget"]

const QUERY_URL = host() + "/collect/"
const QUERY_COMMON_URL = host()+"/cmshotels/common-content-data-collection"
const QUERY_APPROVE = host() + "/collect_approve_data/"

class HotelsApprovalPending extends Component {
  constructor(props) {
    super(props)
    this.state = {
      is_admin:false,
      host: host(),
      approvalData: [],
      content_type: '',
      show: false,
      dataMessage: '',
      hotelData: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.approveFunction = this.approveFunction.bind(this);
    this.returnOptions = this.returnOptions.bind(this);
    // this.handleChangeUniqueData = this.handleChangeUniqueData.bind(this);
    // this.handleCommonChange = this.handleCommonChange.bind(this);
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

  componentDidMount() {
      let _self = this;
      if (loginHelpers.check_usertype()) {
          this.setState({ is_admin: true });
      } else {
          sessionStorage.removeItem("user_data");
          loginHelpers.check_usertype();
           window.location.replace("/")
      }
      let search_params = queryString.parse(this.props.location.search)
      if (["common data", "unique data"].indexOf(search_params["content_type"]) !== -1) {
        var content_type = search_params["content_type"]
        axios.get(`${QUERY_APPROVE}${search_params["id"]}`).then((response) => {
          if (response.data.length > 0) {
            this.setState({
              approvalData: response.data,
              content_type: content_type,
              dataMessage: ''
            })
          } else {
            this.setState({
              dataMessage: "******** There is no data to approve ********",
              content_type: content_type
            })
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    }

  // handleChangeUniqueData(e){
  //   e.preventDefault();
  //   if(this.state.domain_name !== '' &&  this.state.country_name !== '') {
  //     const data = { content_type: "unique data", domain_name: e.target.value, country_name: this.state.country_name}
  //     axios.post(`${QUERY_URL}`, data)
  //       .then(res => {
  //           this.setState({
  //             approvalData: res.data,
  //             content_type: "unique data"
  //           })
  //       })
  //       .catch((err) => {
  //           console.log(err);
  //       })
  //   }
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   })
  // }

  // handleSelectedInput = (p, source) => {
  //   this.setState({
  //     [source]: p.value,
  //     selectedCountry: p
  //   })
  //   if(this.state.domain_name !== '' &&  p.value !== '') {
  //     const data = { content_type: this.state.content_type, domain_name: this.state.domain_name, country_name: p.value }
  //     if (this.state.content_type === "common data") {
  //       data["page_type"] = this.state.page_type
  //     }
  //     var urlPath = this.state.content_type === "common data" ? QUERY_COMMON_URL : QUERY_URL
  //     axios.post(`${urlPath}`, data)
  //     .then(res => {
  //       this.setState({
  //         approvalData: res.data,
  //         content_type: this.state.content_type
  //       })
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  //   }
  // }

  // handleAutoSearch = (e, source) => {
  //   if (e !== "" && e.length > 2) {
  //     axios.get(`${this.state.host}/country_autocomplete?country=${e}`)
  //     .then((response) => {
  //       this.setState({
  //        options: response.data
  //      })
  //     })
  //   }
  // }

  handleClose() {
    this.setState({ show: false });
  }
  handleShow(data) {
    let _self = this
    axios.get(`${_self.state.host}/cmshotels/edit/${data.id}`).then((response) => {
      if (response.status == 200) {
        let recordData = response.data
        return new Promise(function () {
          let showArr = ["country_name", "domain_name", "domain_url", "content_type", "page_type", "meta_title", "meta_description", "canonical_tag", "meta_keyword", "header_tag", "h1_tag", "h2_tag", "h3_tag", "top_content", "bottom_content", "faqs"]
          let hotelData = showArr.map((ele, i) => {
            if (showArr.indexOf(ele) > -1 && recordData[ele] && recordData[ele] != "") {
              if (ele === "faqs") {
                var faqContent = (recordData.faqs === null || recordData.faqs === "") ? [] : JSON.parse(recordData.faqs) || []
              }
              return (
                ele === "faqs" && faqContent.length > 0 ? faqContent.map((v, k) => {
                        return(<li key={k}>
                             <b className="showFieldName">{k == 0 ? ele.replace("_", " ")+":" : ""}</b><br /><b>{v["question"]}</b><br />{v["answer"]}
                        </li>)
                    }) :
                <li key={i}>
                <b>{ele}:</b>{(ele == "top_content" || ele === "bottom_content")&&(ele !== "faqs") ? ReactHtmlParser(recordData[ele]) : recordData[ele]}
                </li>
                );
            }
          });
          _self.setState({ show: true, hotelData: hotelData });
        })
      }
    }).catch(function (error) {
      console.log(error);
    });
  }
  approveFunction(item) {
    let _self = this
    let updatedList = _self.state.approvalData.map(obj => {
       if(obj.id === item.id) {
         return Object.assign({}, obj, {
            is_approved:!item.is_approved
         });
       }
       return obj;
    });
    _self.setState({
      approvalData : updatedList
    });
    return new Promise(function (resolve) {
      axios.get(`${_self.state.host}/approve/${item.id}`).then((response) => {
        if (response.status == 200) {
              if(item.is_approved){
                NotificationManager.info("Data UN-Approved", "UN-Approve", 1500);
              }else{
                NotificationManager.success("Data Approved", "Approve", 1500);
              }
              return resolve(response)

          // return new Promise(function () {
          //   var data = { content_type: _self.state.content_type, domain_name: _self.state.domain_name, country_name: _self.state.country_name }
          //   if (_self.state.content_type === "common data") {
          //     data["page_type"] = _self.state.page_type
          //   } 
          //   var urlPath = _self.state.content_type === "common data" ? QUERY_COMMON_URL : QUERY_URL
          //   axios.post(`${urlPath}`,data)
          //    .then((resp) => {
          //     _self.setState({
          //       approvalData: resp.data
          //     })
          //     if(item.is_approved){
          //       NotificationManager.info("Data UN-Approved", "UN-Approve", 1500);
          //     }else{
          //       NotificationManager.success("Data Approved", "Approve", 1500);
          //     }
          //     return resolve(resp)
          //   })
          // })
        }
      }).catch(function (error) {
        console.log(error);
      });
    })
  }

  handleChange(e) {
    var content_type = e.target.value;
    axios.get(`${QUERY_URL}${content_type}`).then((response) => {
      if (response.data.length > 0) {
        this.setState({
          approvalData: response.data,
          content_type: content_type,
          dataMessage: ''
        })
      } else {
        this.setState({
          dataMessage: "******** There is no data to approve ********",
          approvalData: [],
          content_type: content_type
        })
      }
    }).catch(function (error) {
      console.log(error);
    });
  }

  // handleCommonChange(e) {
  //   e.preventDefault();
  //   this.setState({
  //     [e.target.name]: e.target.value
  //   }, function(){
  //     if(this.state.domain_name !== '' &&  this.state.country_name !== '' && this.state.page_type !== '') {
  //       const data = { content_type: this.state.content_type, domain_name: this.state.domain_name, country_name: this.state.country_name, page_type: this.state.page_type }
  //       axios.post(`${QUERY_COMMON_URL}`, data)
  //         .then(res => {
  //             this.setState({
  //               approvalData: res.data,
  //               content_type: "common data"
  //             })
  //         })
  //         .catch((err) => {
  //             console.log(err);
  //         })
  //     }
  //   });
  // }

  render() {
    const data = {}
    let dataField;
    // let uniqueDataField;
    let rows = []
    const { approvalData, content_type, hotelData, is_admin, dataMessage } = this.state
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

    // if (isUniq) {
    //   uniqueDataField = (
    //     <div className="top-wrapper">
    //     <div className="filter-fileds">
    //     <ul className="list-inline">
    //     <li>
    //     <label>Domain Name</label>
    //     <select
    //     onChange={this.handleChangeUniqueData}
    //     name="domain_name"
    //     value={this.state.domain_name}
    //     >
    //     <option value="" disabled={true} selected>
    //     Domain Type
    //     </option>
    //     {this.returnOptions(domainType)}
    //     </select>
    //     </li>
    //     <li>
    //     <label>Country Name</label>
    //     <Select1
    //     value={this.state.selectedCountry}
    //     name="country_name"
    //     onChange={p => this.handleSelectedInput(p, "country_name")}
    //     onInputChange={e => this.handleAutoSearch(e, "country_name")}
    //     options={this.state.options}
    //     />
    //     </li>
    //     </ul>
    //     <div className="clearfix"></div>
    //     </div>
    //     <div className="clearfix"></div>
    //     </div>
    //     )
    // }

    // if (isCommon) {
    //   uniqueDataField = (
    //     <div className="top-wrapper">
    //         <div className="filter-fileds">
    //           <ul className="list-inline">
    //             <li>
    //               <label>Domain Name</label>
    //               <select
    //                 onChange={this.handleCommonChange}
    //                 name="domain_name"
    //                 value={this.state.domain_name}
    //               >
    //                 <option value="" disabled={true} selected>
    //                   Domain Type
    //                 </option>
    //                 {this.returnOptions(domainType)}
    //               </select>
    //             </li>
    //             <li>
    //               <label>Country</label>
    //               <Select1
    //                   value={this.state.selectedCountry}
    //                   name="country_name"
    //                   onChange={p => this.handleSelectedInput(p, "country_name")}
    //                   onInputChange={e => this.handleAutoSearch(e, "country_name")}
    //                   options={this.state.options}
    //               />
    //             </li>
    //             <li>
    //               <label>Page Type</label>
    //               <select
    //                 onChange={this.handleCommonChange}
    //                 name="page_type"
    //                 value={this.state.page_type}
    //               >
    //                 <option value="" disabled={true} selected>
    //                   Page Type
    //                 </option>
    //                 {this.state.country_name.toLowerCase() === "india" ? this.returnOptions(pageType) : this.returnOptions(localPageType)}
    //               </select>
    //             </li>
    //           </ul>
    //           <div className="clearfix"></div>
    //         </div>
    //       <div className="clearfix"></div>
    //     </div>
    //     )
    // }

    if (approvalData.length > 0) {
      if (content_type === "unique data") {
        data["columns"] = uniqueColoumn
        approvalData.map((item, idx) => {
          let obj = {}
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
      } else if (content_type === "common data") {
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
      <h3 className="approveTag">Please select content section to approve data</h3>
      <select name="content_type" onChange={this.handleChange}  value={this.state.content_type} className="approval_table">
      <option value="" selected disabled={true}>Select Content</option>
      <option value="unique data">Unique Content Data</option>
      <option value="common data">Common Content Data</option>
      </select>
      <div className="appovalTable">
      { dataMessage }
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
