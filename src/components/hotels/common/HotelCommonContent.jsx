import React, { Component } from 'react';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
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

const API_URL = 'http://localhost:3000'

const domainType = ["IN", "AE", "SA", "QA", "OM", "BH", "KW"] 
const pageType = ["City", "Stars", "Locality", "Chain", "PropertyType", "Amenity", "Budget", "Landmark", "Hospital", "Weekend Getaways", "Property in Locality","Region"]
const countryList = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cyprus", "Czech Republic", "Democratic Republic of Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "South Africa", "Spain", "Sri Lanka", "St, Martin", "St. Barts (St. Barthelemy)", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands", "Western Samoa", "Yemen", "Zambia", "Zimbabwe"]

class HotelCommonContent extends Component {
	constructor(props) {
		super(props);
		this.state = { 	page_type: '',
						domain_name: '',
						content_type: 'Common Data',
						country_name: '',
						canonical_tag: '',
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

	handleSubmit(event) {
    event.preventDefault();
    let headerState = this.state.headerEditorState;
    let footerState = this.state.footerEditorState;
    let faqState = this.state.faqEditorState;
    headerState = typeof(headerState) == "string" ? headerState : ""
    footerState = typeof(footerState) == "string" ? footerState : ""
    faqState = typeof(faqState) == "string" ? faqState : ""
    debugger;
    const data = {
      domain_name: this.state.domain_name,
      content_type: this.state.content_type,
      country_name: this.state.country_name,
      page_type: this.state.page_type,
      meta_title: this.state.meta_title,
      meta_description: this.state.meta_description,
      meta_keyword: this.state.meta_keyword,
      top_content: headerState,
      bottom_content: footerState,
      faq: faqState
    }
    axios.post(`${API_URL}/hotels/common-content-section-data`, data)
    .then(({ data }) => {
        this.setState({
          message: data.message,
          domain_name: '',
            page_type: '',
            content_type: '',
            country_name: '',
            canonical_tag: '',
            meta_title: '',
            meta_description: '',
            meta_keyword:'',
            headerEditorState: EditorState.createEmpty(),
            footerEditorState: EditorState.createEmpty(),
            faqEditorState: EditorState.createEmpty()
        })
    })
    .catch(function (error) {
      console.log(error);
    });
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
				<div>
            { alertMessage }
          <Form onSubmit={this.handleSubmit}>
            <Form.Group as={Row} controlId="formHorizontalDomainUrl">
              <Form.Label column sm={2}>
                Domain Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                as="select"
                onChange={this.handleChange}
                name="domain_name"
                value={this.state.domain_name}
                style={{width: '50%'}}
              >
                <option value="">
                  Domain Type
                </option>
                {
                this.returnOptions(domainType)
              }
              </Form.Control>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formHorizontalContnetSection">
              <Form.Label column sm={2}>
                Content Section
              </Form.Label>
              <Col sm={10}>
                <Form.Control style={{width: '50%'}} value={ this.state.content_type } name="content_type" onChange={this.handleChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalCountryName">
              <Form.Label column sm={2}>
                Country Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control style={{width: '50%'}} type="text" value={this.state.country_name} name="country_name" onChange={this.handleChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalPageType">
              <Form.Label column sm={2}>
                Page Type
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                as="select"
                onChange={this.handleChange}
                value={this.state.page_type}
                name="page_type"
                style={{width: '50%'}}
              >
                <option value="">
                  Page Type
                </option>
                {
                this.returnOptions(pageType)
              }
              </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalMetaTitle">
              <Form.Label column sm={2}>
                Meta Title
              </Form.Label>
              <Col sm={10}>
                <Form.Control type="text" value={this.state.meta_title} name="meta_title" onChange={this.handleChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalMetaDescription">
              <Form.Label column sm={2}>
                Meta Description
              </Form.Label>
              <Col sm={10}>
                <Form.Control type="text" value={this.state.meta_description} name="meta_description" onChange={this.handleChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalMetaKeywords">
              <Form.Label column sm={2}>
                Meta Keywords
              </Form.Label>
              <Col sm={10}>
                <Form.Control type="text" value={this.state.meta_keyword} name="meta_keyword" onChange={this.handleChange} />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalHeaderContent">
              <Form.Label column sm={2}>
                Header Content
              </Form.Label>
              <Col sm={10}>
                <Editor
                    headerEditorState={headerEditorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onHeaderEditorStateChange}
                  />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalFooterContent">
              <Form.Label column sm={2}>
                Footer Content
              </Form.Label>
              <Col sm={10}>
                <Editor
                    footerEditorState={footerEditorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onFooterEditorStateChange}
                  />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formHorizontalFaq">
              <Form.Label column sm={2}>
                Frequently Asked Questions
              </Form.Label>
              <Col sm={10}>
                <Editor
                    faqEditorState={faqEditorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onFaqEditorStateChange}
                  />
              </Col>
            </Form.Group>
            <Form.Group as={Row}>
              <Col sm={{ span: 10, offset: 2 }}>
                <Button type="submit">Submit</Button>
              </Col>
            </Form.Group>
          </Form>
        </div>
			)
	}
}

export default HotelCommonContent;