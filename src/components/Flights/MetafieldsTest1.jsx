import React, { Component } from "react";
import "froala-editor/js/froala_editor.pkgd.min.js";
import { Button } from "react-bootstrap";
import "../../../node_modules/react-notifications/lib/notifications.css";
import {
    NotificationContainer,
    NotificationManager
} from "react-notifications";
import "font-awesome/css/font-awesome.css";
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";
import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;
class MetaFields extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageType: this.props.pageType,
            subType: this.props.subType,
            title: "",
            description: "",
            content: this.props.content,
            h1Tag: "",
            keywords: "",
            airlinName: "",
            depCityName: "",
            arrCityName: "",
            readOnlyValue: "",
            selectedOption: null,
            options: [],
            options_dep: [],
            options_arr: [],
            depCityNameSelected: "",
            arrCityNameSelected: "",
            editorState: "",
            faq_object: this.props.faq_object,
            reviews_object: this.props.reviews_object,
            categoryType: ""
        };
        this.onChageFaq = this.onChageFaq.bind(this)
        this.reviewsObject = this.reviewsObject.bind(this)
        this.updateContent = this.updateContent.bind(this)
    }

    onChange1 = content => {
        this.setState({ content });
        if (this.props.onChange) {
            // Send the changes up to the parent component as an HTML string.
            // This is here to demonstrate using `.toString()` but in a real app it
            // would be better to avoid generating a string on each change.
            // this.props.onChange(content.toString("html"));
            this.props.onChange(content.toString("html"));
        }
        this.props.handleChange(content, "rte");
    };

    addNewFaq(e) {
        let _self = this
        let faq_object = this.state.faq_object
        if (faq_object.length == 0) {
            faq_object.push({ question: "", answer: "" })
            _self.setState({
                faq_object: faq_object
            })
        }
        let addNew = false
        faq_object.map((faq, i) => {
            if ((faq["question"] != "" && faq["answer"] != "")) {
                addNew = true
            } else {
                addNew = false
            }
        })
        if (addNew) {
            faq_object.push({ question: "", answer: "" })
            _self.setState({
                faq_object: faq_object
            })
        } else {
            if (!faq_object.length == 0) {
                NotificationManager.error("Please Fill All Faq's Properly", "Field Missing", 3000)
            }
        }
    }
    removeFaq(e) {
        let _self = this
        let faq_object = this.state.faq_object
        let index = parseInt(e.target.dataset.btnid)
        faq_object.splice(index, 1)
        _self.setState({
            faq_object: faq_object
        })
        _self.props.faqOnchange(faq_object, "faq_object")
    };
    onChageFaq(e) {
        let _self = this
        let faq_object = _self.state.faq_object
        let qIndex = parseInt(e.target.dataset.question)
        let aIndex = parseInt(e.target.dataset.answer)
        let index = e.target.name === "question" ? qIndex : aIndex
        faq_object[index][e.target.name] = e.target.value
        _self.setState({
            faq_object: faq_object
        })
        _self.props.faqOnchange(faq_object, "faq_object")
    }
    reviewsObject(e) {
        let _self = this
        let reviews_object = _self.state.reviews_object
        if (Object.keys(e.target.dataset).length > 1) {
            reviews_object[parseInt(e.target.dataset["listreviewid"])]["reviews_list"][parseInt(e.target.dataset.listid)][e.target.name] = e.target.value
        } else {
            reviews_object[parseInt(e.target.dataset["listreviewid"])][e.target.name] = e.target.value
        }
        _self.setState({
            reviews_object: reviews_object
        })
        _self.props.faqOnchange(reviews_object, "reviews_object")
    }

    removeReview(e) {
        let _self = this
        let reviews_object = _self.state.reviews_object
        let index = parseInt(e.target.dataset["btnid"])
        reviews_object[0]["reviews_list"].splice(index, 1)
        if (reviews_object.lenght == 0 || reviews_object[0]["reviews_list"].length == 0) {
            reviews_object = []
        }
        _self.setState({
            reviews_object: reviews_object
        })
        _self.props.faqOnchange(reviews_object, "reviews_object")
    }
    addReview(e) {
        let _self = this
        let reviews_object = _self.state.reviews_object
        if (reviews_object.length == 0) {
            reviews_object.push({ avg_review_rating: '', total_reviews_count: '', reviews_list: [] })
        }
        if (reviews_object[0]["reviews_list"].length == 0) {
            reviews_object[0]["reviews_list"].push({ rating: "", review_text: "", reviewer_name: "" })
        } else {
            let addNew = false
            reviews_object[0]["reviews_list"].map((r, i) => {
                addNew = (r["rating"] != "" && r["review_text"] != "" && r["reviewer_name"] != "") ? true : false
            })
            if (addNew) {
                reviews_object[0]["reviews_list"].push({ rating: "", review_text: "", reviewer_name: "" })
            } else {
                NotificationManager.error("Please Fill All Reviews's Properly", "Field Missing", 3000)
            }
        }
        _self.setState({
            reviews_object: reviews_object
        })
    }

    updateContent(value) {
        let _self = this;
        _self.setState({ content: value })
        _self.props.handleChange(_self.state.content, "rte");
    }
    jodit;
    setRef = jodit => this.jodit = jodit;
    config = {
        readonly: false
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title,
            description: nextProps.description,
            keywords: nextProps.keywords,
            h1Tag: nextProps.h1Tag,
            conent: nextProps.content,
            faq_object: nextProps.faq_object
        });
    }

    render() {
        const toolbarConfig = {
            // Optionally specify the groups to display (displayed in the order listed).
            display: [
                "INLINE_STYLE_BUTTONS",
                "BLOCK_TYPE_BUTTONS",
                "LINK_BUTTONS",
                "BLOCK_TYPE_DROPDOWN",
                "HISTORY_BUTTONS"
            ],
            INLINE_STYLE_BUTTONS: [
                { label: "Bold", style: "BOLD", className: "custom-css-class" },
                { label: "Italic", style: "ITALIC" },
                { label: "Underline", style: "UNDERLINE" }
            ],
            BLOCK_TYPE_DROPDOWN: [
                { label: "Normal", style: "unstyled" },
                { label: "H1", style: "header-one" },
                { label: "H2", style: "header-two" },
                { label: "H3", style: "header-three" },
                { label: "H4", style: "header-four" },
                { label: "H5", style: "header-five" },
                { label: "H6", style: "header-six" }
            ],
            BLOCK_TYPE_BUTTONS: [
                { label: "UL", style: "unordered-list-item" },
                { label: "OL", style: "ordered-list-item" }
            ]
        };
        let subTypeField, category, fields;
        const subtypeOptions = {
            "select subtype": "Select sub page type",
            "airline-routes": "Airline Routes",
            overview: "Overview",
            "pnr-status": "PNR Status",
            "web-checkin": "Web Checkin",
            index: "Index"
        };
        const { title, description, keywords, content, h1Tag, categoryType } = this.props;
        const { pageType, subType, faq_object, reviews_object } = this.state
        let showReviews = false
        if ((pageType === "flight-booking" || pageType === "flight-schedule") && categoryType != "common") {
            if (pageType === "flight-booking" && subType == "overview") {
                showReviews = true
            } else if (pageType === "flight-schedule" && subType == "routes") {
                showReviews = true
            }
        }
        return (
            <ul>
                <li>
                    <Button variant="secondary" onClick={() => this.props.backBtnFun()}>
                        Back
          </Button>
                </li>
                <li>
                    <label>Title</label>
                    <input
                        type="text"
                        placeholder="Title"
                        name="title"
                        placeholder="Title"
                        aria-label="Title"
                        value={title}
                        required
                        onChange={e => this.props.handleMetaChanges(e, "title")}
                    />
                </li>
                <li>
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        aria-label="Description"
                        aria-describedby="basic-addon1"
                        value={description}
                        required
                        onChange={e => this.props.handleMetaChanges(e, "description")}
                    />
                </li>
                <li>
                    <label>Keywords</label>
                    <input
                        name="keywords"
                        type="text"
                        placeholder="Key words"
                        aria-label="key words"
                        value={keywords}
                        required
                        onChange={e => this.props.handleMetaChanges(e, "keywords")}
                    />
                </li>
                <li>
                    <label>H1 Title</label>
                    <input
                        type="text"
                        aria-label="H1 Title"
                        value={h1Tag}
                        required
                        onChange={e => this.props.handleMetaChanges(e, "h1Tag")}
                        name="h1Tag"
                        placeholder="Enter H1 Title"
                    />
                </li>
                <label>Content</label>
                <li>
                    {/* <FroalaEditor
            model={this.state.content}
            base="https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4"
            onModelChange={this.handleModelChange}
          /> */}
                    <JoditEditor
                        editorRef={this.setRef}
                        value={this.state.content}
                        config={this.config}
                        onChange={this.updateContent}
                    />
                    <li>
                        {/* <FroalaEditor
              base='https://cdnjs.cloudflare.com/ajax/libs/froala-editor/2.3.4'
              value={this.state.florContent} /> */}
                    </li>
                    {(faq_object && faq_object.length > 0) ? <li>
                        <b>Faq content</b>
                        {faq_object.map((val, i) => {
                            return (
                                <div className="faqData">
                                    <label>
                                        Question {i + 1}: </label>
                                    <input type="text" onChange={this.onChageFaq.bind(i)} name="question" data-question={i} value={faq_object[i]["question"]} />
                                    <label>Answer {i + 1}:</label>
                                    <input type="text" onChange={this.onChageFaq.bind(i)} name="answer" data-answer={i} value={faq_object[i]["answer"]} />
                                    {i == faq_object.length - 1 ? <div><button type="button"
                                        className="plusButton" onClick={this.removeFaq.bind(this)} data-btnid={i}>-</button><button type="button"
                                            className="plusButton" onClick={this.addNewFaq.bind(this)} data-btnid={i}>+</button></div> : <button type="button"
                                                className="plusButton" onClick={this.removeFaq.bind(this)} data-btnid={i}>-</button>}
                                </div>
                            )
                        })}
                    </li> : <li>No faq's present<button type="button"
                        className="plusButton" onClick={this.addNewFaq.bind(this)} data-btnid="0">+</button></li>}
                    {showReviews ? (reviews_object && reviews_object.length > 0) ?
                        <li>
                            <b>User reviews</b>
                            {reviews_object.map((rev, i) => {
                                return (<div className="reviews">
                                    <label>Average review rating</label>
                                    <input type="text" onChange={this.reviewsObject.bind(this)} data-listreviewid={i} name="avg_review_rating" value={this.state.reviews_object[i]["avg_review_rating"]} />
                                    <label>Total number of reviews</label>
                                    <input type="text" onChange={this.reviewsObject.bind(this)} data-listreviewid={i} name="total_reviews_count" value={this.state.reviews_object[i]["total_reviews_count"]} />
                                    <div className="reviewsList">
                                        <p>Reviews List</p>
                                        {this.state.reviews_object[i]["reviews_list"] && this.state.reviews_object[i]["reviews_list"].length > 0 ?
                                            this.state.reviews_object[i]["reviews_list"].map((list, k) => {
                                                return (<div>
                                                    <label>Rating</label>
                                                    <input type="text" value={this.state.reviews_object[i]["reviews_list"][k]["rating"]} onChange={this.reviewsObject.bind(this)} data-listid={k} data-listreviewid={i} name="rating" />
                                                    <label>Reviewer Name</label>
                                                    <input type="text" value={this.state.reviews_object[i]["reviews_list"][k]["reviewer_name"]} onChange={this.reviewsObject.bind(this)} data-listid={k} data-listreviewid={i} name="reviewer_name" />
                                                    <label>Review Text</label>
                                                    <textarea value={this.state.reviews_object[i]["reviews_list"][k]["review_text"]}
                                                        onChange={this.reviewsObject.bind(this)} data-listid={k} data-listreviewid={i} name="review_text" />
                                                    {k == reviews_object[i]["reviews_list"].length - 1 ? <div><button type="button"
                                                        className="plusButton" onClick={this.removeReview.bind(this)} data-btnid={k}>-</button><button type="button"
                                                            className="plusButton" onClick={this.addReview.bind(this)} data-btnid={k}>+</button></div> : <button type="button"
                                                                className="plusButton" onClick={this.removeReview.bind(this)} data-btnid={k}>-</button>}
                                                </div>)
                                            })
                                            : ""}
                                    </div>
                                </div>)
                            })}
                        </li> : <li>No reviews are present for this page<button type="button"
                            className="plusButton" onClick={this.addReview.bind(this)} data-btnid="0">+</button></li> : ""}
                    <button
                        className="save-btn"
                        type="submit"
                        onClick={this.props.handleFormSubmit}
                        ref={input => this.inputElement = input}
                    >
                        Save{" "}
                    </button>
                </li>
            </ul>
        );
    }
}

export default MetaFields;