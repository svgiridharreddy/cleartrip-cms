import React, { Component } from 'react';
import { Form, Col } from 'react-bootstrap';
import TableContent from '../TableContent';
import axios from 'axios';
import Select1 from 'react-select';

const QUERY_URL = "http://localhost:3000/cmshotels/common-content-data-collection"
const AUTO_COMPLETE = "http://localhost:3000/country_autocomplete" 

const domainType = ["IN", "AE", "SA", "QA", "OM", "BH", "KW"] 
const pageType = ["City", "Stars", "Locality", "Chain", "PropertyType", "Amenity", "Budget", "Landmark", "Hospital", "Weekend Getaways", "PropertyInLocality","Region"]

class CommonContentDataCollection extends Component {
	constructor(props) {
    super(props)
    this.state = {
    	options: [],
      domain_name: '',
      country_name: '',
      selectedCountry:null,
      page_type: '',
      content_type: props.content_type,
      content_result: [],
      linkUrlValue: 'addCommonData',
      isValueSelected: false, 
      isDataPresent: false
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
		          this.setState({ isDataPresent: true, content_result: res.data })
		      })
		      .catch((err) => {
		          console.log(err);
		      })
			}
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
		            <Form.Label column sm={2}>
		              Country
		            </Form.Label>
		            <Col sm={10}>
		              <Select1
		                value={this.state.selectedCountry}
		                name="country_name"
		                onChange={p => this.handleSelectedInput(p, "country_name")}
		                onInputChange={e => this.handleAutoSearch(e, "country_name")}
		                options={this.state.options}
		              />
		            </Col>
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