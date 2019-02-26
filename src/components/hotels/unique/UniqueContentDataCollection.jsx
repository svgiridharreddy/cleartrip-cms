import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import axios from 'axios';
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

const API_URL = "http://localhost:3000"

const QUERY_URL = "http://localhost:3000/cmshotels/unique-content-data-collection" 

class UniqueContentDataCollection extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: '',
			content_result: [],
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
			isEditForm: false
		}
		this.getInfo = this.getInfo.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleChangeFunction = this.handleChangeFunction.bind(this);
		this.handleChangeEditData = this.handleChangeEditData.bind(this);
		this.handleChangeData = this.handleChangeData.bind(this);
	}


	getInfo = () => {
		axios.get(`${QUERY_URL}?prefix=${this.state.query}`)
		.then((response) => {
			this.setState({
					isDataPresent: true,
				 content_result: response.data
			})
		})
	}

	handleInputChange = (event) => {
	    this.setState({
	      query: this.search.value
	    }, () => {
	      if (this.state.query) {
	          this.getInfo()
	      } 
	    })
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
				if (alrt == true) {
				    axios.delete(`${API_URL}/cmshotels/delete/${item.id}`)
				      .then(res => {
				          console.log(res.message);
				          axios.get(`${QUERY_URL}?prefix=${this.state.query}`)
									.then((response) => {
										this.setState({
												isDataPresent: true,
											 content_result: response.data
										})
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
    axios.post(`${API_URL}/cmshotels/content-section-data`, data)
    .then(({ data }) => {
			      	debugger;
        if(data.message) {
					axios.get(`${QUERY_URL}?prefix=${this.state.query}`)
					.then((response) => {
						this.setState({
								isDataPresent: true,
								isAddForm: false,
								isEditForm: false,
							 content_result: response.data
						})
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
        `${API_URL}/cmshotels/update/${result.id}`,
        data
      )
      .then(({ data }) => {
        if(data.message) {
					axios.get(`${QUERY_URL}?prefix=${this.state.query}`)
					.then((response) => {
						this.setState({
								isDataPresent: true,
								isAddForm: false,
								isEditForm: false,
							 content_result: response.data
						})
					})
				}
      })
      .catch(function(error) {
        console.log(error);
      });
	}

	render() {
		let dataField; 
		if (this.state.isDataPresent && this.state.query) {
				 dataField = <TableContent isDataPresent={this.state.isDataPresent} tableResult={this.state.content_result} contentType={this.state.content_type} changeFunction={(name,item ) => this.handleChangeFunction(name,item)} />
		}

		if (this.state.isAddForm) {
			dataField = <AddHotelUniqueContent handleChangeData={(result) => this.handleChangeData(result)} />
		}
		if (this.state.isEditForm) {
			dataField = <EditHotelUniqueData handleChangeEditData={(result) => this.handleChangeEditData(result)} contentRecord={this.state.itemData} />
		}
		
		return(
				<div>
					    <FormControl type="text" placeholder="Search for Domain Url..." ref={input => this.search = input}
			          onChange={this.handleInputChange} className="mr-sm-8" style={{width: '50%'}} />
			          <br />
			        { dataField }
			    </div>
			)
	}
}

export default UniqueContentDataCollection;