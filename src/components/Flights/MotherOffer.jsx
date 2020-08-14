import React, { Component } from "react";
import axios from "axios";
import "./css/Flights.css";
import { Button } from "react-bootstrap";
import "../../../node_modules/react-notifications/lib/notifications.css";
import {
	NotificationContainer,
	NotificationManager
} from "react-notifications";
import { host } from "../helper";
import loginHelpers from "../helper";
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";
import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;

const pageTypes = ["flight-schedule", "flight-tickets"];
const domains = {
	IN: "India",
	AE: "United Arab Emirates",
	SA: "Saudi Arabia",
	KW: "Kuwait",
	OM: "Oman",
	QA: "Qatar",
	BH: "Bahrain"
};
const sections = ["domestic", "international"];
class MotherOffer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id:"",
			pageType: "",
			domain: "",
			language: "",
			subType: "",
			section: "",
			offer_body: "",
			offer_text: "",
			offer_heading: "",
			offer_code:"",
			offer_validity:"",
			offer_amount:"",
			renderTables: false,
			showForm: false,
			loading: false,
			showAddButton: false,
			readOnlyValue:false,
			host: host(),
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleAdd = this.handleAdd.bind(this);
		this.handleMetaChange = this.handleMetaChange.bind(this)
		this.updateContent = this.updateContent.bind(this)
		this.backBtnFun = this.backBtnFun.bind(this)
	}
	backBtnFun = () => {
		let _self = this
		_self.setState({
			loading:false,
			readOnlyValue:false,
			showAddButton: false,
			renderTables:false,
			offer_code:"",
			offer_validity:"",
			offer_amount:"",
			offer_body: "",
			offer_text: "",
			offer_heading: "",
			pageType: "",
			domain: "",
			language: "",
			subType: "",
			section: "",
		})
	}
	handleMetaChange = (e, fieldName) => {
		let _self = this
		if (fieldName === "offer_body") {
			_self.setState({
				offer_body: e.target.value ? e.target.value.toString("html") : ""
			})
		} else {
			_self.setState({
				[fieldName]: e.target.value,
			})
		}
	}

	updateContent(value) {
        let _self = this;
        _self.setState({ offer_body: value })
    }
	handleAdd = (e) => {
		let _self = this
		_self.setState({
			loading:true
		})
		let method = e.target.dataset.method
		let postData ={}
		let {pageType,domain,language,subType,section,offer_body,offer_text,offer_heading} = _self.state
		if(e.target.dataset.method  === "create"){
			 postData = {pageType:pageType,domain:domain,language:language,subType:subType,section:section}
		}else{
		 postData = {pageType:pageType,domain:domain,language:language,subType:subType,section:section,offer_body:offer_body,offer_text:offer_text,offer_heading:offer_heading,offer_code:offer_code,offer_validity:offer_validity,offer_amount:offer_amount}
		}
		 axios.post(host() + "/add-offer", { data: postData }).then(resp => {
			 if(method === "update"){
				_self.backBtnFun()
				NotificationManager.success("Offer updated successfully", "Offer updated", 3000);
			 }else{
			_self.setState({
				showAddButton: false,
				renderTables: true,
				readOnlyValue:true,
				loading:false
			})
		}
		})
	}
	handleChange = (e, fieldName) => {
		let _self = this
		this.setState({
			[fieldName]: e.target.value,
		});
		setTimeout(function () {
			let { domain, language, pageType, section } = _self.state
			if (domain !== "" && language !== "" && pageType !== "" && section !== "") {
				let postData = {
					domain: domain,
					language: language,
					pageType: pageType,
					section: section
				}
				_self.setState({
					loading:true
				})
				axios.get(host() + "/mother-offer", { params: postData }).then(resp => {
					if (resp.data.length > 0) {
						let obj = resp.data[0]
						_self.setState({
							renderTables: true,
							showAddButton: false,
							readOnlyValue:true,
							loading:false,
							offer_heading: obj["offer_heading"] ? obj["offer_heading"] : "" ,
							offer_text: obj["offer_text"] ? obj["offer_text"] : "",
							offer_body: obj["offer_body"] ? obj["offer_body"] : "",
							offer_code:obj["offer_code"] ? obj["offer_code"] : "",
							offer_validity:obj["offer_validity"] ? obj["offer_validity"] : "",
							offer_amount:obj["offer_amount"] ? obj["offer_amount"] : "",
							id: obj["id"]
						})
					} else {
						NotificationManager.info("No data present please add", "No data present", 3000);
						_self.setState({
							showAddButton: true,
							renderTables: false,
							readOnlyValue:false,
							loading:false
						})
					}
				})
			}
		}, 100)
	};
	returnOptions = options => {
		return options.map((opt, idx) => {
			return (
				<option key={idx} value={opt}>
					{opt}
				</option>
			);
		});
	};
	jodit;
	setRef = jodit => this.jodit = jodit;
	config = {
		readonly: false
	}

	render() {
		loginHelpers.checkUser();
		const { loading, language, pageType, domain, section, offer_text, offer_heading, offer_body,offer_amount,offer_validity,offer_code } = this.state
		return (
			<div>
				<div className={loading ? "loading" : ""}></div>
				<div className="top-wrapper">
					<div className="filter-fileds">
						<ul className="list-inline">
							<li>
								<label>Country</label>
								<select
									onChange={e => this.handleChange(e, "domain")}
									name="domain"
									disabled={this.state.readOnlyValue}
									value={this.state.domain}
								>
									<option value="" disabled={true} selected>
										Domain
                  </option>
									{Object.keys(domains).map(option => (
										<option key={option} value={option}>
											{domains[option]}
										</option>
									))}
								</select>
							</li>
							<li>
								<label>Language</label>
								<select
									onChange={e => this.handleChange(e, "language")}
									name="language"
									disabled={this.state.readOnlyValue}
									value={language}
								>
									<option value="" disabled={true} selected>
										Language
                  </option>
									<option value="en">En</option>
									<option value="ar" className={this.state.domain && this.state.domain == 'IN'
										? 'hidden' : ''}>Ar</option>
								</select>
							</li>
							<li>
								<label>Page Type</label>
								<select
									onChange={e => this.handleChange(e, "pageType")}
									name="pageType"
									value={pageType}
									disabled={this.state.readOnlyValue}
								>
									<option value="" disabled={true} selected>
										Page type
                  </option>
									{this.returnOptions(pageTypes)}
								</select>
							</li>
							{domain != "" && language !== "" && pageType !== "" ? (
								<li>
									<label>Section</label>
									<select
										name="section"
										value={section}
										onChange={e => this.handleChange(e, "section")}
										disabled={this.state.readOnlyValue}
									>
										{" "}
										<option value="" disabled={true} selected>
											section
                    				</option>
										{this.returnOptions(sections)}
									</select>
								</li>
							) : (
									""
								)}
						</ul>
						<div className="clearfix" />
					</div>
				</div>
				<div className="data-edit-section">
					{this.state.renderTables ? (<div>
						<ul>
						<li>
                    <Button variant="secondary" onClick={e  => this.backBtnFun()}>
                        Back
          </Button>
                </li>
							<li>
								<label>Offer text</label>
								<input
									type="text"
									placeholder="Offer text"
									name="offer_text"
									aria-label="Offer text"
									value={offer_text}
									required
									onChange={e => this.handleMetaChange(e, "offer_text")}
								/>
							</li>
							<li>
								<label>Model heading</label>
								<input
									type="text"
									placeholder="Model heading"
									name="model_heading"
									aria-label="Offer heading"
									value={offer_heading}
									required
									onChange={e => this.handleMetaChange(e, "offer_heading")}
								/>
							</li>
							<li>
								<label>Model body</label>
								<JoditEditor
									editorRef={this.setRef}
									value={offer_body}
									config={this.config}
									onChange={e => this.updateContent(e, "offer_body")}
								/>
							</li>
							<li>
								<label>Offer code</label>
								<input
									type="text"
									placeholder="Offer code"
									name="offer_code"
									aria-label="Offer code"
									value={offer_code}
									required
									onChange={e => this.handleMetaChange(e, "offer_code")}
								/>
							</li>
							<li>
								<label>Offer validity</label>
								<input
									type="text"
									placeholder="Offer validity"
									name="offer_validity"
									aria-label="Offer text"
									value={offer_validity}
									required
									onChange={e => this.handleMetaChange(e, "offer_validity")}
								/>
							</li>
								<li>
								<label>Offer amount</label>
								<input
									type="text"
									placeholder="Offer amount"
									name="offer_amount"
									aria-label="Offer amount"
									value={offer_amount}
									required
									onChange={e => this.handleMetaChange(e, "offer_amount")}
								/>
							</li>
							<button className="edit-btn"
								type="button"
								data-method="update"
								onClick={e => this.handleAdd(e)}
							>
								save
                </button>
						</ul>


					</div>) : (this.state.showAddButton ? <div>   <button
						className="add-btn"
						type="button"
						data-method="create"
						onClick={e => this.handleAdd(e)}
					>
						Add New
                </button></div> : null)}
				</div>
				<NotificationContainer />
			</div>
		);
	}
}

export default MotherOffer