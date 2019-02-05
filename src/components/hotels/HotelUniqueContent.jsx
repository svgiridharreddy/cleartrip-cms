import React, { Component } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000'

class HotelUniqueContent extends Component {
	constructor(props) {
		super(props);
		this.state = { domain_url: '',
						content_type: 'Unique Data',
						country_name: '',
						canonical_tag: '',
						meta_title: '',
						meta_description: '',
						meta_keywords:'',
						top_content: '',
						bottom_content: '',
						faq: '',
						message: ''
					 };
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}
	handleSubmit(event) {
		event.preventDefault();
		const data = this.state
		axios.post(`${API_URL}/hotels/content-section-data`, data)
		.then(({ data }) => {
				this.setState({
					message: data.message // MusicGraph returns an object named data, 
					// as does axios. So... data.data                             
				})
				setTimeout(function(){
					this.setState({
						domain_url: '',
						content_type: 'Unique Data',
						country_name: '',
						canonical_tag: '',
						meta_title: '',
						meta_description: '',
						meta_keywords:'',
						top_content: '',
						bottom_content: '',
						faq: '',
						message: ''
					})
				}.bind(this),2000)
		})
		.catch(function (error) {
	    console.log(error);
	  });
	}
	render() {
		return(
				<div style={{marginTop: 10}}>
					{ this.state.message }
	                <h3>Add new data </h3>
	                <form onSubmit={this.handleSubmit}>
	                	<label>
	                		DomainUrl:
	                		<input type="text" name="domain_url" onChange={this.handleChange} />
	                	</label>
	                	<label>
	                		Content Section: 
	                		<input name="content_type" value={ this.state.content_type } />
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
                        	Top Content: 
                        	<textarea name="top_content" onChange={this.handleChange} />
                        </label>
	                    <label>
	                        Bottom Content: 
	                        <textarea name="bottom_content" onChange={this.handleChange} />
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