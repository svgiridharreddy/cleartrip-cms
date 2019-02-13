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
					]
				}
			],
			RsideBarLinks: [],
			FooterLinks: []
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
				!headerTagsList.includes(ele.value) ||
				headerTagsList.length == 0
			) {
				headerTagsList.push({
					[ele.value]: [{ anchorName: "", anchorUrl: "" }]
				});
			}
			ele.value = "";
			this.setState({
				headerLinks: headerTagsList
			});
		}
	}
	handleChange(field, tag, e) {
		let _self = this;
		let tag_name = tag;
		console.log(tag_name);
		let target = parseInt(e.target.dataset.tag.split("-")[1]);
		let headerData = _self.state.headerLinks;
		headerData = headerData.map((obj, k) => {
			Object.keys(obj).map((sub, j) => {
				if (tag_name == sub && target == j) {
					obj[sub].map((asc, k) => {
						asc[field] = e.target.value;
					});
				}
			});
			this.setState({ headerLinks: headerData });
		});
	}
	headerAddBtn(menuName,linkName,e) {
		let _self = this
		let linkData = _self.state[linkName]
		debugger
		linkData = linkData[menuName].map((a,b) => {
			debugger
		})
	}

	renderForm = data => {
		return Object.keys(data).map((sub, j) => {
			return data[sub].map((asc, k, arr) => {
				return (
					<li keys={k} key={k}>
						<b>{k == 0 ? sub : ""}: </b>
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
									onClick={this.headerAddBtn.bind(this, sub,"headerLinks")}
								>
									+
								</button>
						) : (
							<button
								type="button"
								className="plusButton"
								data-btnid={k}
								data-btnname="sub"
								onClick={this.headerAddBtn.bind(this, sub,"headerLinks")}
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
