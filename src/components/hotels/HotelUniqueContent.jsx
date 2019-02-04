import React, { Component } from 'react';

class HotelUniqueContent extends Component {
	constructor(props) {
		super(props);
		this.state = { domain_url: '',
						content_type: 'Uniq',
						country_name: '',
						canonical_tag: '',
						meta_title: '',
						meta_description: '',
						meta_keywords:'',
						top_content: '',
						bottom_contnet: '',
						faq: ''
					 };
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	onChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(event) {
		event.preventDefault();

		// const data = new FormData(event.target);
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
	                		DomainUrl:
	                		<input type="text" name="domain_url" onChange={this.handleChange} />
	                	</label>
	                	<label>
	                		CountryName:
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
                        	Top Content: 
                        	<textarea name="top_contnet" onChange={this.handleChange} />
                        </label>
	                    <label>
	                        Bottom Content: 
	                        <textarea name="bottom_contnet" onChange={this.handleChange} />
	                    </label>
	                    <div className="form-group">
	                        <label>FAQ: </label>
	                        <textarea name="faq" onChange={this.handleChange} />
	                    </div>
	                    <div className="form-group">
	                        <input type="submit" value="Add Data" className="btn btn-primary"/>
	                    </div>
	                </form>
	            </div>
			)
	}
}

export default HotelUniqueContent;