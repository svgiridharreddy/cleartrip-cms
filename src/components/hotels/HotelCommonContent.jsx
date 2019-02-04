import React, { Component } from 'react';

class HotelCommonContent extends Component {
	constructor(props) {
		super(props);
		this.state = { 	page_type: ["CityPage", "Stars", "Chain", "Locality", "PropertyType", "AmenityPage", "Budget", "LandmarkPage", "HospitalPage", "PropertyLocalityPage", "WeekendGetaways", "RegionName", "ChainPage", "InfoPage", "ReviewsPage", "MapsPage"],
						domain_name: ["IN", "AE", "QA", "SA", "BH", "KW", "OM"],
						content_type: 'Templatize',
						country_name: '',
						canonical_tag: '',
						meta_title: '',
						meta_description: '',
						meta_keywords:'',
						top_content: '',
						bottom_contnet: '',
						faq: ''
					 };
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		const data = new FormData(event.target);
		fetch('/api/domainurlwise-data',{
			method: 'POST',
			body: data
		});
	}

	render() {
		return(
				<div style={{marginTop: 10}}>
          <h3>Add new data </h3>
          <form onSubmit={this.handleSubmit}>
          	<label>
          		Content Type:
          		<input type="text" name="content_type" onChange={this.handleChange} />
          	</label>
          	<label>
          		Page Type:
          		<select multiple={true} value={ this.state.page_type }>
          	</label>
          	<label>
          		Domain Type:
          		<select multiple={true} value={ this.state.domain_name }>
          	</label>
          	<label>
          		Country Name:
          		<input type="text" name="country_name" onChange={this.handleChange} />
          	</label>
            <label>
                Canonical Tag: 
                <input type="text" name="canonical_tag" onChange={this.handleChange} />
            </label>
            <label>
            	Meta Title: 
            	<input type="text" name="meta_title" onChange={this.handleChange} />
            </label>
            <label>
            	Meta Description: 
            	<input type="text" name="meta_description" onChange={this.handleChange} />
            </label>
            <label>
            	Meta Keywords: 
            	<input type="text" name="meta_keywords" onChange={this.handleChange} />
            </label>
            <label>
            	Top Templatized Content: 
            	<textarea name="top_contnet" onChange={this.handleChange} />
            </label>
            <label>
                Bottom Templatized Content: 
                <textarea name="bottom_contnet" onChange={this.handleChange} />
            </label>
            <label>
            	Templatized FAQ: 
              <textarea name="faq" onChange={this.handleChange} />
            </label>
            <input type="submit" value="Submit">
          </form>
      </div>
			)
	}
}

export default HotelCommonContent;