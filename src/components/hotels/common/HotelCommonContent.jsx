import React, { Component } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';
import '../../css/Hotels.css';
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

const API_URL = 'http://localhost:3000'
const AUTO_COMPLETE = "http://localhost:3000/country_autocomplete"

const domainType = ["IN", "AE", "SA", "QA", "OM", "BH", "KW"] 
const pageType = ["City", "Stars", "Locality", "Chain", "PropertyType", "Amenity", "Budget", "Landmark", "Hospital", "Weekend Getaways", "Property in Locality","Region"]

class HotelCommonContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
      options: [], 	
      page_type: '',
  		domain_name: '',
  		content_type: 'Common Data',
  		country_name: '',
      selectedCountry: null,
      h1_tag: '',
      h2_tag: '',
      h3_tag: '',
  		meta_title: '',
  		meta_description: '',
  		meta_keyword:'',
  		headerEditorState: EditorState.createEmpty(),
      footerEditorState: EditorState.createEmpty(),
      faqEditorState: EditorState.createEmpty(),
      message: ''
	 };
	 this.handleChange = this.handleChange.bind(this);
   this.returnOptions = this.returnOptions.bind(this);
	 this.handleSubmit = this.handleSubmit.bind(this);
	}

  onHeaderEditorStateChange: Function = (headerEditorState) => {
    let convertedData = draftToHtml(
        convertToRaw(headerEditorState.getCurrentContent())
      );
      convertedData = convertedData.replace(/"/g, "'");
     this.setState({
       headerEditorState: convertedData
     });
  };

  onFooterEditorStateChange: Function = (footerEditorState) => {
    let convertedData = draftToHtml(
      convertToRaw(footerEditorState.getCurrentContent())
    );
    convertedData = convertedData.replace(/"/g, "'");
    this.setState({
      footerEditorState: convertedData
    });
  };
  onFaqEditorStateChange: Function = (faqEditorState) => {
    let convertedData = draftToHtml(
      convertToRaw(faqEditorState.getCurrentContent())
    );
    convertedData = convertedData.replace(/"/g, "'");
    this.setState({
      faqEditorState: convertedData
    });
  };

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSubmit(e) {
    e.preventDefault();
    let headerState = this.state.headerEditorState;
    let footerState = this.state.footerEditorState;
    let faqState = this.state.faqEditorState;
    headerState = typeof(headerState) == "string" ? headerState : ""
    footerState = typeof(footerState) == "string" ? footerState : ""
    faqState = typeof(faqState) == "string" ? faqState : ""
    const data = {
      domain_name: this.state.domain_name,
      content_type: this.state.content_type,
      country_name: this.state.country_name,
      page_type: this.state.page_type,
      h1_tag: this.state.h1_tag,
      h2_tag: this.state.h2_tag,
      h3_tag: this.state.h3_tag,
      meta_title: this.state.meta_title,
      meta_description: this.state.meta_description,
      meta_keyword: this.state.meta_keyword,
      top_content: headerState,
      bottom_content: footerState,
      faq: faqState
    }
    axios.post(`${API_URL}/cmshotels/common-content-section-data`, data)
    .then(({ data }) => {
        this.setState({
          message: data.message,
          domain_name: '',
            page_type: '',
            content_type: '',
            country_name: '',
            selectedCountry: null,
            h1_tag: '',
            h2_tag: '',
            h3_tag: '',
            meta_title: '',
            meta_description: '',
            meta_keyword:'',
            headerEditorState: "",
            footerEditorState: "",
            faqEditorState: ""
        })
    })
    .catch(function (error) {
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
    const { message, headerEditorState, footerEditorState, faqEditorState } = this.state
    let alertMessage;
    if(message !== '') {
      alertMessage = (
         <Alert variant="info">
            { this.state.message }
          </Alert>
          )
    }
		return(
      <div className="common-hotel-wrapper">
        <div className="top-wrapper">
          { alertMessage }
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
                <label>Content Section</label>
                <input value={ this.state.content_type } name="content_type" />
              </li>
              <li>
                <label>Country Name</label>
                <Select
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
          <div className="clearfix"></div>
        </div>


        <div className="common-hotel-content">
          <ul className="list-unstyled">
            <li>
              <label>H1 Title</label>
              <input type="text" name="h1_tag" onChange={this.handleChange} value={this.state.h1_tag} />
            </li>
            <li>
              <label>H2 Title</label>
              <input type="text" name="h2_tag" onChange={this.handleChange} value={this.state.h2_tag} />
            </li>
            <li>
              <label>H3 Title</label>
              <input type="text" name="h3_tag" onChange={this.handleChange} value={this.state.h3_tag} />
            </li>
            <li>
              <label>Meta Title</label>
              <input type="text" name="meta_title" onChange={this.handleChange} value={this.state.meta_title} />
            </li>
            <li>
              <label>Meta Description</label>
              <input type="text" name="meta_description" onChange={this.handleChange} value={this.state.meta_description} />
            </li>
            <li>
              <label>Meta Keywords</label>
              <input type="text" name="meta_keyword" onChange={this.handleChange} value={this.state.meta_keyword} />
            </li>
            <li>
              <label>Header Content</label>
              <Editor
                headerEditorState={headerEditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onHeaderEditorStateChange}
              />
            </li>
            <li>
              <label>Footer Content</label>
              <Editor
                footerEditorState={footerEditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onFooterEditorStateChange}
              />
            </li>
            <li>
              <label>Frequently Asked Questions</label>
              <Editor
                faqEditorState={faqEditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onFaqEditorStateChange}
              />
            </li>
            <button
              type="button"
              onClick={this.handleSubmit}
              className="button">
              Submit
            </button>
          </ul>
        </div>
      </div>
			)
	}
}

export default HotelCommonContent;