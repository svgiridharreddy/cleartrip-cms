import React, { Component } from 'react';
import TableContent from '../TableContent';
import axios from 'axios';
import Select1 from 'react-select';
import AddCommonForm from '../AddCommonForm';
import EditCommonForm from '../EditCommonForm';
import { host } from "../../helper";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

const QUERY_URL = host()+"/cmshotels/common-content-data-collection"

const domainType = ["IN", "AE", "SA", "QA", "OM", "BH", "KW"] 
const pageType = ["City", "Stars", "Locality", "Chain", "PropertyType", "Amenity", "Budget", "Landmark", "Hospital", "PropertyInLocality","Region"]
const localPageType = ["City", "Stars", "Locality", "Chain", "PropertyType", "Amenity", "Budget"]

class CommonContentDataCollection extends Component {
	constructor(props) {
    super(props)
    this.state = {
      options: [],
      itemData: {},
      domain_name: '',
      country_name: '',
      selectedCountry:null,
      page_type: '',
      content_type: props.content_type,
      h1_tag: '',
      h2_tag: '',
      h3_tag: '',
      meta_title: '',
      meta_description: '',
      meta_keyword: '',
      top_content: '',
      bottom_content: '',
      faq: '',
      content_result: [],
      isDataPresent: false,
      isAddForm: false,
      isEditForm: false,
      host: host()
    }
    this.handleChange = this.handleChange.bind(this);
    this.returnOptions = this.returnOptions.bind(this);
    this.handleAutoSearch = this.handleAutoSearch.bind(this);
    this.handleSelectedInput = this.handleSelectedInput.bind(this);
  }

	handleChange(e) {
		e.preventDefault();
		this.setState({
			[e.target.name]: e.target.value
		}, function(){
			if(this.state.domain_name !== '' &&  this.state.country_name !== '' && this.state.page_type !== '') {
				const data = { content_type: this.props.content_type, domain_name: this.state.domain_name, country_name: this.state.country_name, page_type: this.state.page_type }
				axios.post(`${QUERY_URL}`, data)
		      .then(res => {
		          this.setState({ isDataPresent: true, isAddForm: false, isEditForm: false, content_result: res.data })
		      })
		      .catch((err) => {
		          console.log(err);
		      })
			}
		});
	}

	handleChangeFunction = (name,item) => {
		if (name === "add") {
			this.setState({isAddForm: true, isDataPresent: false, isEditForm: false})
		}	else if (name === "edit") {
			this.setState({
				isEditForm: true,
				isAddForm: false,
				isDataPresent: false,
				itemData: item
			})
		} else if (name === "delete") {
				const alrt = window.confirm('Are you sure you wish to delete this item?')
				if (alrt === true) {
				    axios.delete(`${this.state.host}/cmshotels/delete/${item.id}`)
				      .then(res => {
				          console.log(res.message);
				          const data = { content_type: this.state.content_type, domain_name: this.state.domain_name, country_name: this.state.country_name, page_type: this.state.page_type }
									axios.post(`${QUERY_URL}`, data)
							      .then(res => {
							          this.setState({ isDataPresent: true, isAddForm: false, isEditForm: false,content_result: res.data })
							          NotificationManager.info("Common content data deleted successfully", "Common Data deleted", 2000);
							      })
							      .catch((err) => {
							          console.log(err);
							      })
				      })
				      .catch((err) => {
				          console.log(err);
				      })
				}
		}
	}

	handleChangeData(result) {
    const data = {
      domain_name: this.state.domain_name,
      content_type: this.state.content_type,
      country_name: this.state.country_name,
      page_type: this.state.page_type,
      h1_tag: result.h1_tag,
      h2_tag: result.h2_tag,
      h3_tag: result.h3_tag,
      meta_title: result.meta_title,
      meta_description: result.meta_description,
      meta_keyword: result.meta_keyword,
      top_content: result.top_content,
      bottom_content: result.bottom_content,
      faq: result.faq
    }
    axios.post(`${this.state.host}/cmshotels/common-content-section-data`, data)
    .then(({ data }) => {
        if(data.message) {
					const hdata = { content_type: this.state.content_type, domain_name: this.state.domain_name, country_name: this.state.country_name, page_type: this.state.page_type }
					axios.post(`${QUERY_URL}`, hdata)
			      .then(res => {
			          this.setState({ isDataPresent: true, isAddForm: false, content_result: res.data })
			          NotificationManager.info("Common content data added successfully", "Common Data Added", 2000);
			      })
			      .catch((err) => {
			          console.log(err);
			      })
				}
    })
    .catch(function (error) {
      console.log(error);
    });
	}

	handleChangeEditData(result){
    const data = {
      domain_name: result.domain_name,
      content_type: result.content_type,
      country_name: result.country_name,
      page_type: result.page_type,
      h1_tag: result.h1_tag,
      h2_tag: result.h2_tag,
      h3_tag: result.h3_tag,
      meta_title: result.meta_title,
      meta_description: result.meta_description,
      meta_keyword: result.meta_keyword,
      top_content: result.top_content,
      bottom_content: result.bottom_content,
      faq: result.faq
    };
    axios
      .post(
        `${this.state.host}/cmshotels/commondata/update/${result.id}`,
        data
      )
      .then(({ data }) => {
        if(data.message) {
					const hdata = { content_type: this.state.content_type, domain_name: this.state.domain_name, country_name: this.state.country_name, page_type: this.state.page_type }
					axios.post(`${QUERY_URL}`, hdata)
			      .then(res => {
			          this.setState({ isDataPresent: true, isAddForm: false, isEditForm: false, content_result: res.data })
			          NotificationManager.info("Common content data updation done successfully", "Updation", 2000);
			      })
			      .catch((err) => {
			          console.log(err);
			      })
				}
      })
      .catch(function(error) {
        console.log(error);
      });
	}

	backBtnFun = () =>{
		let _self =this
		var backData = { content_type: _self.state.content_type, domain_name: _self.state.domain_name, country_name: _self.state.country_name, page_type: _self.state.page_type }
		axios.post(`${QUERY_URL}`, backData)
      .then(res => {
          _self.setState({ isDataPresent: true, isAddForm: false, isEditForm: false, content_result: res.data })
      })
      .catch((err) => {
          console.log(err);
      })
	}

	handleSelectedInput = (p, source) => {
		this.setState({
			[source]: p.value,
			selectedCountry: p
		})
		if(this.state.domain_name !== '' &&  p.value !== '' && this.state.page_type !== '') {
			const data = { content_type: this.props.content_type, domain_name: this.state.domain_name, country_name: p.value, page_type: this.state.page_type }
			axios.post(`${QUERY_URL}`, data)
	      .then(res => {
	          this.setState({ isDataPresent: true, isAddForm: false, isEditForm: false, content_result: res.data })
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

	returnOptions(optData) {
	    return optData.map((country, i) => {
	      return (
	        <option key={i} value={country}>
	          {country}
	        </option>
	      );
	    });
	  }

	render() {
		let dataField; 
		if (this.state.isDataPresent) {
				 dataField = <TableContent isDataPresent={this.state.isDataPresent} tableResult={this.state.content_result} contentType={this.state.content_type} changeFunction={(name,item ) => this.handleChangeFunction(name,item)} />
		}
		if (this.state.isAddForm) {
			dataField = <AddCommonForm backBtnFun= {this.backBtnFun.bind(this)} handleChangeData={(result) => this.handleChangeData(result)} />
		}
		if (this.state.isEditForm) {
			dataField = <EditCommonForm backBtnFun= {this.backBtnFun.bind(this)} handleChangeEditData={(result) => this.handleChangeEditData(result)} contentRecord={this.state.itemData} />
		}
		 
		return(
				<div className="common-hotel-wrapper">
					<div className="top-wrapper">
		        <div className="filter-fileds">
		          <ul className="list-inline">
		            <li>
		              <label>Domain Name</label>
		              <select
		                onChange={this.handleChange}
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
		            	<label>Country</label>
		            	<Select1
			                value={this.state.selectedCountry}
			                name="country_name"
			                onChange={p => this.handleSelectedInput(p, "country_name")}
			                onInputChange={e => this.handleAutoSearch(e, "country_name")}
			                options={this.state.options}
			            />
		            </li>
		            <li>
		              <label>Page Type</label>
		              <select
		                onChange={this.handleChange}
		                name="page_type"
		                value={this.state.page_type}
		              >
		                <option value="" disabled={true} selected>
		                  Page Type
		                </option>
		                {this.state.country_name.toLowerCase() === "india" ? this.returnOptions(pageType) : this.returnOptions(localPageType)}
		              </select>
		            </li>
		          </ul>
							<div className="clearfix"></div>
		        </div>
		      <div className="clearfix"></div>
		    </div>
				<div className="common-hotel-content">
					{ dataField }
				</div>
			</div>
			)
	}
}

export default CommonContentDataCollection;