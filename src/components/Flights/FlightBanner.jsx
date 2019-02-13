import React, { Component } from "react";
import Modal from "react-responsive-modal";



class FlightBanner extends Component {
	constructor(props) {
		super(props);
		this.state = {
			form_json: {
				country_code: "in",
				language: "en",
				section: "",
				page_type: "",
				page_subtype: "",
				source_city: "",
				destination_city: "",
				imagedata: []
			},
			sectionHide: true,
			pageSubtypeHide: true,
			bookingPage: true,
			pageSubTypeHide: true,
			routesHide: true,
			open: false,
			model_form_data:{
				banner_type: "",
				bannerism_type: "Flight",
				section_click_ga_event_action: "",
				section_click_ga_event_category: "",
				section_click_ga_event_label: "",
				section_load_ga_event_action: "",
				section_load_ga_event_category: "",
				section_load_ga_event_label: "",
				section_image_link: "",
				section_image_src: ""
			}

		};
		this.handleChange = this.handleChange.bind(this);
		this.onOpenModal = this.onOpenModal.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.upload = this.upload.bind(this);
		this.saveBannerData = this.saveBannerData.bind(this);
	}

	
	onOpenModal(e) {
		let _self = this;
		let form_data = _self.state.form_json;
		this.setState({
			open: true
		});
		if(form_data.imagedata.length > 0){
			let json_exst = false
			form_data.imagedata.map((a,b) => {
				if(a["banner_type"] == e.target.textContent){
					_self.state["model_form_data"]= a
					json_exst = true
				}
			})
			if(!json_exst){
				_self.state["model_form_data"]["banner_type"] = e.target.textContent
			}
		}
		this.setState({_self})
	}

	onCloseModal() {
		this.setState({
			open: false
		});
	}

	handleChange(field, e) {
		let _self = this;
		let form_data = _self.state.form_json;
		form_data[field] = e.target.value;
		this.setState({
			form_data
		});
		if (
			e.target.name === "page_type" &&
			(e.target.value === "flight-schedule" ||
				e.target.value == "flight-tickets")
			) {
			let form_json = {
				section: "",
				source_city: "",
				destination_city: "",
				page_subtype: ""
			};
			Object.keys(form_json).map(form => (form_data[form] = ""));
			this.setState({
				form_data
			});

			this.setState({
				sectionHide: false,
				bookingPage: true,
				pageSubTypeHide: false,
				routesHide: true
			});
		}
		if (
			e.target.name === "page_type" &&
			e.target.value === "flight-booking"
			) {
			let form_json = {
				page_subtype: "",
				section: "",
				source_city: "",
				destination_city: ""
			};
			Object.keys(form_json).map(form => (form_data[form] = ""));
			this.setState({
				form_data
			});
			this.setState({
				bookingPage: false,
				sectionHide: false,
				pageSubTypeHide: false,
				routesHide: true
			});
		}
		if (e.target.name === "page_subtype" && e.target.value === "routes") {
			this.setState({
				routesHide: false
			});
		}
	}

	upload(e) {
		let _self = this
		let model_form_data = _self.state.model_form_data
		model_form_data[e.target.name] = e.target.value
		this.setState({
			_self
		})
	}
	saveBannerData(e){
		e.preventDefault()
		let file = e.target[1].files[0]
		debugger
	}
	render() {
		let form_banner = (
			<div className="Banner Modal">
			<p>{this.state.model_form_data.banner_type}</p>
			<form name="bannerImage" onSubmit={this.saveBannerData}>
			<div>
			<label>section image link</label>
			<input type="text" name="section_image_link" onChange={this.upload} />
			</div>
			<div>
			<label>upload new image</label>
			<input type="file" name="section_image_src" onChange={this.upload} />
			</div>
			<div>
			<button type="submit">Save and continue</button>
			</div>
			</form>
			</div>);
		let _self = this.state;
		const { open } = this.state;
		const country_code = [
		{ name: "India", code: "in" },
		{ name: "Qatar", code: "qa" },
		{ name: "Arab Emirates", code: "ae" },
		{ name: "Kuwait", code: "kw" },
		{ name: "Saudi Arabia", code: "sa" },
		{ name: "Bahrain", code: "bh" },
		{ name: "Oman", code: "om" }
		];
		const languages = [
		{ name: "English", code: "en" },
		{ name: "Arabic", code: "ar" },
		{ name: "Hindi", code: "hi" }
		];

		return (
			<div>
			<p> Flights Banner</p>
			<select
			name="country_code"
			value={this.state.country_code}
			onChange={this.handleChange.bind(this, "country_code")}
			>
			{country_code.map((e, key) => {
				return (
					<option key={key} value={e.code}>
					{e.name}
					</option>
					);
			})}
			</select>

			<select
			name="language"
			value={this.state.language}
			onChange={this.handleChange.bind(this, "language")}
			>
			{languages.map((e, key) => {
				return (
					<option key={key} value={e.code}>
					{e.name}
					</option>
					);
			})}
			</select>
			<select
			name="page_type"
			value={_self.form_json.page_type}
			onChange={this.handleChange.bind(this, "page_type")}
			>
			<option />
			<option value="flight-schedule">Flight schedule</option>
			<option value="flight-tickets">Flight tickets</option>
			<option value="flight-booking">Flight booking</option>
			</select>
			<select
			name="page_subtype"
			value={_self.form_json.page_subtype}
			onChange={this.handleChange.bind(this, "page_subtype")}
			className={this.state.pageSubTypeHide ? "hidden" : ""}
			>
			<option />
			<option
			value="allpages"
			className={this.state.bookingPage ? "hidden" : ""}
			>
			All pages
			</option>
			<option
			value="index"
			className={this.state.bookingPage ? "" : "hidden"}
			>
			Index
			</option>
			<option value="routes">Route</option>
			</select>
			<select
			name="section"
			value={_self.form_json.section}
			onChange={this.handleChange.bind(this, "section")}
			className={this.state.sectionHide ? "hidden" : ""}
			>
			<option />
			<option value="domestic">Domestic </option>
			<option value="international">International </option>
			</select>
			<div className={this.state.routesHide ? "hidden" : ""}>
			<label> Source</label>
			<input
			type="text"
			value={_self.form_json.source_city}
			onChange={this.handleChange.bind(this, "source_city")}
			name="source_city"
			/>
			<label>Destination</label>
			<input
			type="text"
			value={_self.form_json.destination_city}
			onChange={this.handleChange.bind(
				this,
				"destination_city"
				)}
			name="destination_city"
			/>
			</div>
			<div className="banner-type">
			<ul className="list-inline">
			<li onClick={this.onOpenModal}>RHS</li>
			<li onClick={this.onOpenModal}>LHS</li>
			<li onClick={this.onOpenModal}>Header-Sticky</li>
			<li onClick={this.onOpenModal}>Footer-Sticky</li>
			</ul>
			<Modal open={open} onClose={this.onCloseModal} center>
			{form_banner}
			</Modal>
			</div>
			</div>
			);
	}
}
export default FlightBanner;
