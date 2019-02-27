import React, { Component } from 'react';
import axios from 'axios';
import { Alert } from 'react-bootstrap';
import Select from 'react-select';
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

const API_URL = 'http://13.251.49.54'
const AUTO_COMPLETE = "http://13.251.49.54/country_autocomplete" 

class HotelUniqueContent extends Component {
	constructor(props) {
		super(props);
		this.state = { domain_url: '',
			content_type: 'Unique Data',
			country_name: '',
			selectedCountry: null,
			canonical_tag: '',
			h1_tag: '',
			h2_tag: '',
			h3_tag: '',
			meta_title: '',
			meta_description: '',
			meta_keyword:'',
			top_content: '',
			bottom_content: '',
			faq: '',
			headerEditorState: EditorState.createEmpty(),
			footerEditorState: EditorState.createEmpty(),
			faqEditorState: EditorState.createEmpty(),
			message: ''
		 };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.contentConvertion = this.contentConvertion.bind(this);
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

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(e) {
		this.props.handleChangeData(this.state)
	}

	contentConvertion(html) {
    if (html === "<p></p>\n" || html === "<p></p>") {
      html = "";
    }
    if (html) {
      const headerContentBlock = convertFromHTML(html);
      const headerContentState = ContentState.createFromBlockArray(
        headerContentBlock
      );
      const HeaderEditorState = EditorState.createWithContent(
        headerContentState
      );
      return HeaderEditorState;
    } else {
      return "";
    }
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

	render() {
		const { message, headerEditorState, footerEditorState, faqEditorState } = this.state;
	    let alertMessage;
	    if(message !== '') {
	      alertMessage = (
	         <Alert variant="info">
	            { this.state.message }
	          </Alert>
	          )
	    }
		return(
			<div className="top-wrapper">
				{ alertMessage }
        <div className="filter-fileds">
          <ul className="list-inline">
            <li>
            	<label>Domain Url</label>
            	<input type="text" name="domain_url" onChange={this.handleChange} value={ this.state.domain_url }/>
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
            	<label>Canonical Tag</label>
            	<input type="text" name="canonical_tag" onChange={this.handleChange} value={ this.state.canonical_tag } />
            </li>
            <li>
            	<label>H1 Title</label>
            	<input type="text" name="h1_tag" onChange={this.handleChange} value={ this.state.h1_tag } />
            </li>
            <li>
            	<label>H2 Title</label>
            	<input type="text" name="h2_tag" onChange={this.handleChange} value={ this.state.h2_tag } />
            </li>
            <li>
            	<label>H3 Title</label>
            	<input type="text" name="h3_tag" onChange={this.handleChange} value={ this.state.h3_tag } />
            </li>
            <li>
            	<label>Meta Title</label>
            	<input type="text" name="meta_title" onChange={this.handleChange} value={ this.state.meta_title }/>
            </li>
            <li>
            	<label>Meta Description</label>
            	<input type="text" name="meta_description" onChange={this.handleChange} value={ this.state.meta_description }/>
            </li>
            <li>
            	<label>Meta Keywords</label>
            	<input type="text" name="meta_keyword" onChange={this.handleChange} value={ this.state.meta_keyword }/>
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

export default HotelUniqueContent;
