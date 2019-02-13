import React, { Component } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import TableContent from '../tableContent';
import axios from 'axios';

const QUERY_URL = "http://localhost:3000/hotels/common-content-data-collection" 

const domainType = ["IN", "AE", "SA", "QA", "OM", "BH", "KW"] 
const pageType = ["City", "Stars", "Locality", "Chain", "PropertyType", "Amenity", "Budget", "Landmark", "Hospital", "Weekend Getaways", "PropertyInLocality","Region"]
const countryList = ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Chad", "Chile", "China", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia", "Cyprus", "Czech Republic", "Democratic Republic of Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Islas Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "South Africa", "Spain", "Sri Lanka", "St, Martin", "St. Barts (St. Barthelemy)", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands", "Western Samoa", "Yemen", "Zambia", "Zimbabwe"]

class CommonContentDataCollection extends Component {
	constructor(props) {
    super(props)
    this.state = {
      domain_name: '',
      country_name: '',
      page_type: '',
      content_type: props.content_type,
      content_result: [],
      linkUrlValue: 'addCommonData',
      isValueSelected: false, 
      isDataPresent: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.returnOptions = this.returnOptions.bind(this);
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
		          this.setState({ isDataPresent: true, content_result: res.data })
		      })
		      .catch((err) => {
		          console.log(err);
		      })
			}
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
		let dataField; 
		if (this.state.isDataPresent) {
				 dataField = <TableContent isDataPresent={this.state.isDataPresent} linkURl={this.state.linkUrlValue} content_type={this.state.content_type} tableResult={this.state.content_result} />
		} 
		return(
				<div>
	        <Form>
	          <Form.Row>
	          	<Form.Group as={Col} style={{width: '50%'}}>
                <Form.Label>Domain Name</Form.Label>
                <Form.Control
                  as="select"
                  onChange={this.handleChange}
                  name="domain_name"
                >
                  <option value="">
                    Domain Type
                  </option>
                  {
                  this.returnOptions(domainType)
                }
                </Form.Control>
              </Form.Group>
	            <Form.Group as={Col}>
	              <Form.Label>Country</Form.Label>
	              <Form.Control
	                as="select"
	                onChange={this.handleChange}
	                name="country_name"
	              >
	                <option value="">
	                  Select Country
	                </option>
	                {
	                	this.returnOptions(countryList)
	                }
	              </Form.Control>
	            </Form.Group>
	            <Form.Group as={Col}>
	              <Form.Label>Page Type</Form.Label>
	              <Form.Control
	                as="select"
	                onChange={this.handleChange}
	                name="page_type"
	              >
	                <option value="">
	                  Page Type
	                </option>
	                {
                  this.returnOptions(pageType)
                }
	              </Form.Control>
	            </Form.Group>
	          </Form.Row>
	        </Form>
	        { dataField }
        </div>
			)
	}
}

export default CommonContentDataCollection;