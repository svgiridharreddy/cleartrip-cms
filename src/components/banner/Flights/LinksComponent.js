import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import "../Banner.css";
class LinksComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headerLinks: [
				{
					about: [
						{
							anchorName: "about bangalore",
							anchorUrl: "about hyderabad"
						}
					],
					how_to_reach: [
						{
							anchorName: "reach",
							anchorUrl: "reah url"
						}
					]

				}
			],
			RsideBarLinks: [],
			FooterLinks: [],
			showErrormsg: false
		};
		this.addTag = this.addTag.bind(this);
		this.headerAddBtn = this.headerAddBtn.bind(this);
	}
	addTag() {
		const node = ReactDOM.findDOMNode(this);
		if (node instanceof HTMLElement) {
			let ele = node.querySelector(".tag_name");
			let headerTagsList = this.state.headerLinks;
			if (
				(!headerTagsList.includes(ele.value) ||
					headerTagsList.length == 0) &&
				ele.value != ""
			) {
				headerTagsList.push({
					[ele.value]: [{ anchorName: "", anchorUrl: "" }]
				});
				this.setState({
					showErrormsg: false
				});
				ele.value = "";
			} else {
				this.setState({
					showErrormsg: true
				});
			}
			this.setState({
				headerLinks: headerTagsList
			});
		}
	}
	handleChange(field, tag, e) {
		let _self = this;
		let tag_name = tag;
		let target = parseInt(e.target.dataset.tag.split("-")[1]);
		let headerData = _self.state.headerLinks;
		headerData = headerData.map((obj, k) => {
			if (obj[tag_name]) {
				obj[tag_name].map((sub, b) => {
					if (b == target) {
						sub[field] = e.target.value;
					}
				});
			}
			this.setState({ headerLinks: headerData });
		});
	}
	headerAddBtn(menuName, linkName, e) {
		let _self = this;
		let presentall = true;
		let linkData = _self.state[linkName];
		linkData = linkData.map((link, k) => {
			if (link[menuName]) {
				link[menuName].map((sub, j) => {
					if (sub.anchorUrl === "" || sub.anchorName === "") {
						presentall = false;
						_self.setState({ showErrormsg: true });
					}
				});
				if (presentall) {
					link[menuName].push({ anchorName: "", anchorUrl: "" });
					_self.setState({ showErrormsg: false });
				}
			}
			_self.setState({
				_self
			});
		});
	}

	renderForm = data => {
		return Object.keys(data).map((sub, j) => {
			return data[sub].map((asc, k, arr) => {
				return (
					<li keys={k} key={k}>
						<b>{k == 0 ? sub + ":" : ""} </b>
						<input
							type="text"
							name="ancorTagName"
							data-tag={"anchorTagName-" + k}
							value={asc.anchorName}
							onChange={this.handleChange.bind(
								this,
								"anchorName",
								sub
							)}
						/>
						<input
							type="text"
							data-tag={"anchorUrl-" + k}
							name="anchorUrl"
							value={asc.anchorUrl}
							onChange={this.handleChange.bind(
								this,
								"anchorUrl",
								sub
							)}
						/>
						{k == arr.length - 1 ? (
							<button
								type="button"
								className="plusButton"
								data-btnid={k}
								data-btnname="add"
								onClick={this.headerAddBtn.bind(
									this,
									sub,
									"headerLinks"
								)}
							>
								+
							</button>
						) : (
							<button
								type="button"
								className="plusButton"
								data-btnid={k}
								data-btnname="sub"
								onClick={this.headerAddBtn.bind(
									this,
									sub,
									"headerLinks"
								)}
							>
								-
							</button>
						)}
					</li>
				);
			});
		});
	};

	render() {
		let _self = this;
		return (
			<div>
				{_self.state.showErrormsg ? (
					<p className="errormsg">*please enter all fields</p>
				) : (
					""
				)}
				<h2>Header Links</h2>
				<ul className="list-inline">
					<li>
						<input
							type="text"
							name="tag_name"
							className="tag_name"
						/>
						<span className="addTagBtn" onClick={this.addTag}>
							Add tag
						</span>
					</li>
				</ul>
				<div>
					<ul className="list-inline">
						{_self.state.headerLinks.map((link, i) =>
							this.renderForm(link)
						)}
					</ul>
				</div>
				{JSON.stringify(this.state.headerLinks)}
			</div>
		);
	}
}
export default LinksComponent;
