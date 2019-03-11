import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import axios from 'axios';
import Promise from "promise"
import Select1 from 'react-select';
import {
	EditorState,
	ContentState,
	convertFromHTML,
	convertFromRaw,
	convertToRaw
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from "draft-js-export-html";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TableContent from '../TableContent';
import AddHotelUniqueContent from './AddHotelUniqueContent';
import EditHotelUniqueData from './EditHotelUniqueData';
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
			headerEditorState: "",
			footerEditorState: "",
			faqEditorState: "",
			content_type: props.content_type,
			itemData: {},
			isDataPresent: false,
			isAddForm: false,
			isEditForm: false,
			host: host(),
			uniqData: props.uniqData
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
			const data = { content_type: this.props.content_type, domain_name: this.state.domain_name, country_name: p.value }
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

	handleInputChange = (event) => {
		this.setState({
			query: this.search.value
		}, () => {
			if (this.state.query.length > 10) {
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
				axios.delete(`${host}/cmshotels/delete/${item.id}`)
					.then(res => {
						console.log(res.message);
						axios.get(`${QUERY_URL}?prefix=${this.state.query}`)
							.then((response) => {
								this.setState({
									isDataPresent: true,
									content_result: response.data
								})
								NotificationManager.info("Unique content data deleted successfully", "Unique Data deleted", 1500);
							})
					})
					.catch((err) => {
						console.log(err);
					})
			}
		}
	}

	handleChangeData(result) {
		let headerState = result.headerEditorState;
		let footerState = result.footerEditorState;
		let faqState = result.faqEditorState;
		headerState = typeof (headerState) == "string" ? headerState : ""
		footerState = typeof (footerState) == "string" ? footerState : ""
		faqState = typeof (faqState) == "string" ? faqState : ""
		const data = {
			domain_url: result.domain_url,
			content_type: result.content_type,
			country_name: result.country_name,
			canonical_tag: result.canonical_tag,
			h1_tag: result.h1_tag,
			h2_tag: result.h2_tag,
			h3_tag: result.h3_tag,
			meta_title: result.meta_title,
			meta_description: result.meta_description,
			meta_keyword: result.meta_keyword,
			top_content: headerState,
			bottom_content: footerState,
			faq: faqState
		}
		axios.post(`${host}/cmshotels/content-section-data`, data)
			.then(({ data }) => {
				if (data.message) {
					axios.get(`${QUERY_URL}?prefix=${this.state.query}`)
						.then((response) => {
							this.setState({
								isDataPresent: true,
								isAddForm: false,
								isEditForm: false,
								content_result: response.data
							})
							NotificationManager.info("Unique content data added successfully", "Unique Data Added", 1500);
						})
				}
			})
			.catch(function (error) {
				console.log(error);
			});
	}

	handleChangeEditData(result) {
		let convertedHeaderData;
		let convertedFooterData;
		let convertedFaqData;
		if (result.HeaderEditorState.getCurrentContent !== undefined) {
			convertedHeaderData = draftToHtml(
				convertToRaw(result.HeaderEditorState.getCurrentContent())
			);
			convertedHeaderData = convertedHeaderData.replace(/"/g, "'");
		} else {
			convertedHeaderData = this.state.headerEditorState;
		}
		if (result.FootereditorState.getCurrentContent !== undefined) {
			convertedFooterData = draftToHtml(
				convertToRaw(result.FootereditorState.getCurrentContent())
			);
			convertedFooterData = convertedFooterData.replace(/"/g, "'");
		} else {
			convertedFooterData = this.state.footerEditorState;
		}
		if (result.FaqeditorState.getCurrentContent !== undefined) {
			convertedFaqData = draftToHtml(
				convertToRaw(result.FaqeditorState.getCurrentContent())
			);
			convertedFaqData = convertedFaqData.replace(/"/g, "'");
		} else {
			convertedFaqData = this.state.faqEditorState;
		}
		const data = {
			domain_url: result.domain_url,
			content_type: result.content_type,
			country_name: result.country_name,
			h1_tag: result.h1_tag,
			h2_tag: result.h2_tag,
			h3_tag: result.h3_tag,
			canonical_tag: result.canonical_tag,
			meta_title: result.meta_title,
			meta_description: result.meta_description,
			meta_keyword: result.meta_keyword,
			top_content: convertedHeaderData,
			bottom_content: convertedFooterData,
			faq: convertedFaqData
		};
		axios
			.post(
				`${this.state.host}/cmshotels/update/${result.id}`,
				data
			)
			.then(({ data }) => {
				if (data.message) {
					axios.get(`${QUERY_URL}?prefix=${this.state.query}`)
						.then((response) => {
							this.setState({
								isDataPresent: true,
								isAddForm: false,
								isEditForm: false,
								content_result: response.data
							})
							NotificationManager.info("Unique content data updation done successfully", "Updation", 1500);
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
			dataField = <AddHotelUniqueContent handleChangeData={(result) => this.handleChangeData(result)} />
		}
		if (this.state.isEditForm) {
			dataField = <EditHotelUniqueData handleChangeEditData={(result) => this.handleChangeEditData(result)} contentRecord={this.state.itemData} />
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