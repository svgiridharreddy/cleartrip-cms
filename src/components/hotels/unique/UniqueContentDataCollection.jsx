import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import axios from 'axios';
import Promise from "promise"
import Select1 from 'react-select';
import TableContent from '../TableContent';
import AddHotelUniqueContent from './AddHotelUniqueContent1';
import EditUniqueContent from './EditUnique1';
import { host } from "../../helper";
import {
	NotificationContainer,
	NotificationManager
} from "react-notifications";

const QUERY_URL = host() + "/cmshotels/unique-content-data-collection"
const domainType = ["IN", "AE", "SA", "QA", "OM", "BH", "KW"] 

class UniqueContentDataCollection extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: '',
			content_result: [],
			domain_name: '',
			domain_url: '',
			country_name: '',
			canonical_tag: '',
			h1_tag: '',
			h2_tag: '',
			h3_tag: '',
			meta_title: '',
			meta_description: '',
			meta_keyword: '',
			top_content: '',
			bottom_content: '',
			faq: '',
			faqs: JSON.stringify([]),
			content_type: props.content_type,
			itemData: {},
			isDataPresent: false,
			isAddForm: false,
			isEditForm: false,
			host: host()
		}
		this.getInfo = this.getInfo.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleChangeFunction = this.handleChangeFunction.bind(this);
		this.handleChangeEditData = this.handleChangeEditData.bind(this);
		this.handleChangeData = this.handleChangeData.bind(this);
		this.returnOptions = this.returnOptions.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		e.preventDefault();
		if(this.state.domain_name !== '' &&  this.state.country_name !== '') {
			const data = { content_type: this.state.content_type, domain_name: e.target.value, country_name: this.state.country_name, prefix: this.state.query }
			axios.post(`${QUERY_URL}`, data)
	      .then(res => {
	          this.setState({ isDataPresent: true, isAddForm: false, isEditForm: false, content_result: res.data })
	      })
	      .catch((err) => {
	          console.log(err);
	      })
		}
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	getInfo = () => {
		const params = {prefix: this.state.query, content_type: this.props.content_type, domain_name: this.state.domain_name, country_name: this.state.country_name }
		axios.post(`${QUERY_URL}`, params)
			.then((response) => {
				this.setState({
					isDataPresent: true,
					content_result: response.data
				})
			})
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

  handleSelectedInput = (p, source) => {
		this.setState({
			[source]: p.value,
			selectedCountry: p
		})
		if(this.state.domain_name !== '' &&  p.value !== '') {
			const data = { content_type: this.props.content_type, domain_name: this.state.domain_name, country_name: p.value, prefix: this.state.query }
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

	backBtnFun = () =>{
    let _self =this
    axios.post(`${QUERY_URL}?prefix=${_self.state.query}&content_type=${_self.state.content_type}&domain_name=${_self.state.domain_name}&country_name=${_self.state.country_name}`)
		.then((response) => {
			_self.setState({
				isDataPresent: true,
				isAddForm: false,
				isEditForm: false,
				content_result: response.data
			})
		})
  }

	handleInputChange = (event) => {
		this.setState({
			query: this.search.value
		}, () => {
			if (this.state.domain_name && this.state.country_name && this.state.query.length > 10) {
				this.getInfo()
			} else {
				this.getInfo()
			}
		})
	}

	handleChangeFunction = (name, item) => {
		if (name === "add") {
			this.setState({ isAddForm: true, isDataPresent: false, isEditForm: false })
		} else if (name === "edit") {
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
						axios.post(`${QUERY_URL}?prefix=${this.state.query}&content_type=${this.state.content_type}&domain_name=${this.state.domain_name}&country_name=${this.state.country_name}`)
							.then((response) => {
								this.setState({
									isDataPresent: true,
									content_result: response.data
								})
								NotificationManager.warning("Unique content data deleted successfully", "Unique Data deleted", 1500);
							})
					})
					.catch((err) => {
						console.log(err);
					})
			}
		}
	}

	handleChangeData(result) {
		var faqContent = JSON.stringify(result.faqs)
		const data = {
			domain_url: result.domain_url,
			domain_name: result.domain_name,
			content_type: result.content_type,
			country_name: result.country_name,
			canonical_tag: result.canonical_tag,
			h1_tag: result.h1_tag,
			h2_tag: result.h2_tag,
			h3_tag: result.h3_tag,
			meta_title: result.meta_title,
			meta_description: result.meta_description,
			meta_keyword: result.meta_keyword,
			top_content: result.top_content,
			bottom_content: result.bottom_content,
			faqs: faqContent
		}
		axios.post(`${this.state.host}/cmshotels/content-section-data`, data)
			.then(({ data }) => {
				if (data.message) {
					axios.post(`${QUERY_URL}?prefix=${this.state.query}&content_type=${this.state.content_type}&domain_name=${this.state.domain_name}&country_name=${this.state.country_name}`)
						.then((response) => {
							this.setState({
								isDataPresent: true,
								isAddForm: false,
								isEditForm: false,
								content_result: response.data
							})
							NotificationManager.success("Unique content data added successfully", "Unique Data Added", 1500);
						})
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	handleChangeEditData(result) {
		var faqContent = JSON.stringify(result.faqs)
		const data = {
			domain_url: result.domain_url,
			content_type: result.content_type,
			country_name: result.country_name,
			domain_name: result.domain_name,
			h1_tag: result.h1_tag,
			h2_tag: result.h2_tag,
			h3_tag: result.h3_tag,
			canonical_tag: result.canonical_tag,
			meta_title: result.meta_title,
			meta_description: result.meta_description,
			meta_keyword: result.meta_keyword,
			top_content: result.top_content,
			bottom_content: result.bottom_content,
			faqs: faqContent
		};
		axios
			.post(
				`${this.state.host}/cmshotels/update/${result.id}`,
				data
			)
			.then(({ data }) => {
				if (data.message) {
					axios.post(`${QUERY_URL}?prefix=${this.state.query}&content_type=${this.state.content_type}&domain_name=${this.state.domain_name}&country_name=${this.state.country_name}`)
						.then((response) => {
							this.setState({
								isDataPresent: true,
								isAddForm: false,
								isEditForm: false,
								content_result: response.data
							})
							NotificationManager.success("Unique content data updation done successfully", "Updation", 1500);
						})
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	render() {
		let dataField;
		if (this.state.isDataPresent) {
			dataField = <TableContent isDataPresent={this.state.isDataPresent} tableResult={this.state.content_result} contentType={this.state.content_type} changeFunction={(name, item) => this.handleChangeFunction(name, item)} />
		}

		if (this.state.isAddForm) {
			dataField = <AddHotelUniqueContent backBtnFun= {this.backBtnFun.bind(this)} domain_name={this.state.domain_name} country_name={this.state.country_name} handleChangeData={(result) => this.handleChangeData(result)} />
		}
		if (this.state.isEditForm) {
			dataField = <EditUniqueContent backBtnFun= {this.backBtnFun.bind(this)} domain_name={this.state.domain_name} country_name={this.state.country_name} handleChangeEditData={(result) => this.handleChangeEditData(result)} contentRecord={this.state.itemData} />
		}

		return (
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
		            	<label>Country Name</label>
		            	<Select1
			                value={this.state.selectedCountry}
			                name="country_name"
			                onChange={p => this.handleSelectedInput(p, "country_name")}
			                onInputChange={e => this.handleAutoSearch(e, "country_name")}
			                options={this.state.options}
			            />
		            </li>
		            <li>
		            	<label>Domain Url</label>
		            	<FormControl type="text" placeholder="Search for Domain Url..." ref={input => this.search = input}
					onChange={this.handleInputChange} className="mr-sm-8" style={{ width: '100%' }} />
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

export default UniqueContentDataCollection;