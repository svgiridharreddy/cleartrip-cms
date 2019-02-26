import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';
import TableContent from '../TableContent';
import axios from 'axios';
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
import AddCommonForm from '../AddCommonForm';
import EditCommonForm from '../EditCommonForm';


const API_URL = 'http://localhost:3000'

const QUERY_URL = "http://localhost:3000/cmshotels/common-content-data-collection"
const AUTO_COMPLETE = "http://localhost:3000/country_autocomplete" 

const domainType = ["IN", "AE", "SA", "QA", "OM", "BH", "KW"] 
const pageType = ["City", "Stars", "Locality", "Chain", "PropertyType", "Amenity", "Budget", "Landmark", "Hospital", "Weekend Getaways", "PropertyInLocality","Region"]

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
      headerEditorState: "",
      footerEditorState: "",
      faqEditorState: "",
      content_result: [],
      isDataPresent: false,
      isAddForm: false,
      isEditForm: false
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
			debugger;
			this.setState({
				isEditForm: true,
				isAddForm: false,
				isDataPresent: false,
				itemData: item
			})
		} else if (name === "delete") {
				const alrt = window.confirm('Are you sure you wish to delete this item?')
				if (alrt == true) {
				    axios.delete(`${API_URL}/cmshotels/delete/${item.id}`)
				      .then(res => {
				          console.log(res.message);
				          const data = { content_type: this.state.content_type, domain_name: this.state.domain_name, country_name: this.state.country_name, page_type: this.state.page_type }
									axios.post(`${QUERY_URL}`, data)
							      .then(res => {
							          this.setState({ isDataPresent: true, isAddForm: false, isEditForm: false,content_result: res.data })
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
		let headerState = result.headerEditorState;
    let footerState = result.footerEditorState;
    let faqState = result.faqEditorState;
    headerState = typeof(headerState) == "string" ? headerState : ""
    footerState = typeof(footerState) == "string" ? footerState : ""
    faqState = typeof(faqState) == "string" ? faqState : ""
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
      top_content: headerState,
      bottom_content: footerState,
      faq: faqState
    }
    axios.post(`${API_URL}/cmshotels/common-content-section-data`, data)
    .then(({ data }) => {
			      	debugger;
        if(data.message) {
					const hdata = { content_type: this.state.content_type, domain_name: this.state.domain_name, country_name: this.state.country_name, page_type: this.state.page_type }
					axios.post(`${QUERY_URL}`, hdata)
			      .then(res => {
			          this.setState({ isDataPresent: true, isAddForm: false, content_result: res.data })
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
      domain_name: result.domain_name,
      domain_url: result.domain_url,
      content_type: result.content_type,
      country_name: result.country_name,
      page_type: result.page_type,
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
        `${API_URL}/cmshotels/commondata/update/${result.id}`,
        data
      )
      .then(({ data }) => {
      	debugger;
        if(data.message) {
					const hdata = { content_type: this.state.content_type, domain_name: this.state.domain_name, country_name: this.state.country_name, page_type: this.state.page_type }
					axios.post(`${QUERY_URL}`, hdata)
			      .then(res => {
			          this.setState({ isDataPresent: true, isAddForm: false, isEditForm: false, content_result: res.data })
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


	handleSelectedInput = (p, source) => {
		this.setState({
			[source]: p.value,
			selectedCountry: p
		})
	}

	handleAutoSearch = (e, source) => {
		if (e !== "" && e.length > 2) {
			axios.get(`${AUTO_COMPLETE}?country=${e}`)
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
			dataField = <AddCommonForm handleChangeData={(result) => this.handleChangeData(result)} />
		}
		if (this.state.isEditForm) {
			dataField = <EditCommonForm handleChangeEditData={(result) => this.handleChangeEditData(result)} contentRecord={this.state.itemData} />
		}
		 
		return(
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
		                {this.returnOptions(pageType)}
		              </select>
		            </li>
		          </ul>
		        </div>
		        { dataField }
		    </div>
			)
	}
}

export default CommonContentDataCollection;