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
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import $ from "jquery";
import { func } from "prop-types";
window.jQuery = $;
window.$ = $;
global.jQuery = $;
class MetaFields extends Component {
    constructor(props) {
        super(props);
        debugger
        this.state = {
            pageType: this.props.pageType,
            subType: this.props.subType,
            title: this.props.title,
            description: this.props.description,
            content: this.props.content ? this.props.content : "",
            h1Tag: "",
            keywords: "",
            airlinName: "",
            airlineTagName: "",
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
            categoryType: "",
            content_tabs_data: this.props.content_tabs_data && this.props.content_tabs_data.length > 0 ? this.props.content_tabs_data : [],
            h2_lowest_fare_title: this.props.h2_lowest_fare_title ? this.props.h2_lowest_fare_title : "",
            bottom_content: this.props.bottom_content && this.props.bottom_content !== "" ? this.props.bottom_content : ""
        };
        this.onChageFaq = this.onChageFaq.bind(this)
        this.reviewsObject = this.reviewsObject.bind(this)
        this.updateContent = this.updateContent.bind(this)
        this.updateBottomContent = this.updateBottomContent.bind(this)
        this.updateTabContent = this.updateTabContent.bind(this)
        this.addNewTabCotnent = this.addNewTabCotnent.bind(this)
        this.removeTabCotnent = this.removeTabCotnent.bind(this)
        this.removeObjData = this.removeObjData.bind(this)
        this.addEmojiTitle = this.addEmojiTitle.bind(this)
        this.addEmojiDescription = this.addEmojiDescription.bind(this)
    }

    onChange1 = content => {
        this.setState({ content });
        if (this.props.onChange) {
            // Send the changes up to the parent component as an HTML string.
            // This is here to demonstrate using `.toStringTouchListal app it
            // would be better to avoid generating a string on each change.
            // this.props.onChange(content.toString("html"));
            this.props.onChange(content.toString("html"));
        }
        this.props.handleChange(content, "rte");
    };

    addNewFaq(e) {
        let _self = this
        let faq_object = this.state.faq_object
        let noTabData = false
        if (faq_object.length == 0) {
            noTabData = true
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
            if (!noTabData) {
                NotificationManager.error("Please Fill All Faq's Properly", "Field Missing", 3000)
            }
        }
    }
    removeFaq(e) {
        let _self = this
        let faq_object = this.state.faq_object
        let index = parseInt(e.target.dataset.btnid)
        _self.removeObjData(faq_object, index, "faq_object")
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
        if (reviews_object.length == 0 || reviews_object[0]["reviews_list"].length == 0) {
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

    updateTabContent(field, e) {
        let _self = this
        let content_tabs_data = _self.state.content_tabs_data
        let index = field.target && field.target.name === "heading" ? parseInt(field.target.dataset.heading) : parseInt(field)
        let key_name = field.target && field.target.name ? field.target.name : "content"
        content_tabs_data[index][key_name] = field.target && field.target.value ? field.target.value : e
        _self.setState({
            content_tabs_data: content_tabs_data
        })
        _self.props.faqOnchange(content_tabs_data, "content_tabs_data")

    }

    addNewTabCotnent(e) {
        let _self = this
        let noTabData = false
        let content_tabs_data = _self.state.content_tabs_data
        if (content_tabs_data && content_tabs_data.length === 0) {
            noTabData = true
            content_tabs_data.push({ heading: "", content: "" })
            _self.setState({
                content_tabs_data: content_tabs_data
            })
        }
        let addNew = false
        content_tabs_data.map((obj, k) => {
            if (obj["heading"] !== "" && obj["content"] != "") {
                addNew = true
            } else {
                addNew = false
            }
        })
        if (addNew) {
            content_tabs_data.push({ heading: "", content: "" })
            _self.setState({
                content_tabs_data: content_tabs_data
            })
        } else {
            if (!noTabData) {
                NotificationManager.error("Please Enter content and heading  Properly", "Field Missing", 3000)
            }
        }
    }
    removeTabCotnent(e) {
        let _self = this
        let content_tabs_data = _self.state.content_tabs_data
        let index = parseInt(e.target.dataset.btnid)
        _self.removeObjData(content_tabs_data, index, "content_tabs_data")
    }

    removeObjData(data, index, col) {
        let _self = this
        data.splice(index, 1)
        _self.setState({
            [col]: data
        })
        _self.props.faqOnchange(data, col)
    }

    updateContent(value) {
        let _self = this;
        _self.setState({ content: value })
        _self.props.handleChange(_self.state.content, "rte");
    }
    updateBottomContent(val) {
        let _self = this
        _self.setState({
            bottom_content: val
        })
        _self.props.faqOnchange(_self.state.bottom_content, "bottom_content")
    }
    jodit;
    setRef = jodit => this.jodit = jodit;
    config = {
        readonly: false
    }

    addEmojiTitle = (e) => {
        let _self = this
        let current_title = _self.state.title
        if (e.unified.length <= 5) {
            let emojiPic = String.fromCodePoint(`0x${e.unified}`)
            setTimeout(function () {
                _self.setState({
                    title: current_title + emojiPic
                })
                _self.props.handleMetaChanges(_self.state.title, "title")
            }, 10)
        } else {
            let sym = e.unified.split('-')
            let codesArray = []
            sym.forEach(el => codesArray.push('0x' + el))
            let emojiPic = String.fromCodePoint(...codesArray)
            setTimeout(function () {
                _self.setState({
                    title: current_title + emojiPic
                })
                _self.props.handleMetaChanges(_self.state.title, "title")
            }, 10)
        }
    }

    addEmojiDescription = (e) => {
        let _self = this
        let current_description = _self.state.description
        if (e.unified.length <= 5) {
            let emojiPic = String.fromCodePoint(`0x${e.unified}`)
            setTimeout(function(){
                _self.setState({
                    description: current_description + emojiPic
                })
                _self.props.handleMetaChanges(_self.state.description, "description")
            },10)
        } else {
            let sym = e.unified.split('-')
            let codesArray = []
            sym.forEach(el => codesArray.push('0x' + el))
            let emojiPic = String.fromCodePoint(...codesArray)
            setTimeout(function(){
                _self.setState({
                    description: current_description + emojiPic
                })
            },10)
            _self.props.handleMetaChanges(_self.state.description, "description")
        }
    }
    componentWillReceiveProps(nextProps) {
        debugger
        this.setState({
            title: nextProps.title,
            description: nextProps.description,
            keywords: nextProps.keywords,
            h1Tag: nextProps.h1Tag,
            content: nextProps.content,
            faq_object: nextProps.faq_object,
            airlineTagName: nextProps.airlineTagName
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
        const { title, description, keywords, h1Tag, categoryType, h2_lowest_fare_title, airlineTagName } = this.props;
        const { pageType, subType, faq_object, reviews_object, content_tabs_data } = this.state
        let showReviews = false
        let show_content_tabs = false
        let show_h2_lowest_fare_title = false
        let show_airline_tag_name = false
        if ((pageType === "flight-booking" || pageType === "flight-schedule") && categoryType != "common") {
            if (pageType === "flight-booking" && subType == "overview") {
                showReviews = true
                show_content_tabs = true
                show_airline_tag_name = true
            } else if (pageType === "flight-schedule" && subType == "routes") {
                showReviews = true
                show_h2_lowest_fare_title = true
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
                        value={this.state.title}
                        required
                        onChange={e => this.state.addEmojiTitle(e, "title")}
                    />
                    <span>
                        <Picker onSelect={this.addEmojiTitle} />
                    </span>
                </li>
                <li>
                    <label>Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        aria-label="Description"
                        aria-describedby="basic-addon1"
                        value={this.state.description}
                        required
                        onChange={e => this.props.handleMetaChanges(e, "description")}
                    />
                    <span>
                        <Picker onSelect={this.addEmojiDescription} />
                    </span>
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
                {show_airline_tag_name ? <li>
                    <label>Airline Tag Name</label>
                    <input
                        type="text"
                        aria-label="Airline Tag Name"
                        value={airlineTagName}
                        required
                        onChange={e => this.props.handleMetaChanges(e, "airlineTagName")}
                        name="airlineTagName"
                        placeholder="Enter the airline tag name"
                    />
                </li> : ""}

                {show_h2_lowest_fare_title ? <li><label>Lowest fare title(H2)</label>
                    <input type="text" aria-label="Lowest fare title" value={h2_lowest_fare_title} onChange={e => this.props.handleMetaChanges(e, "h2_lowest_fare_title")}
                        name="h2_lowest_fare_title" required placeholder="Lowest fare title" /></li> : ''}
                {show_content_tabs ? (content_tabs_data.length > 0 ? <div><li><h3>Tab Content</h3></li>
                    <li>{(content_tabs_data.map((value, key) => {
                        return (
                            <div key={key} className="contentTabs">
                                <label>Heading</label>
                                <input type="text" name="heading" data-heading={key} value={content_tabs_data[key]['heading']} onChange={this.updateTabContent.bind(this)} />
                                <label>Content </label>
                                <JoditEditor data-content={key}
                                    editorRef={this.setRef}
                                    value={content_tabs_data[key]['content']}
                                    config={this.config}
                                    name="content"
                                    onChange={this.updateTabContent.bind(this, key)}
                                />
                                {key == content_tabs_data.length - 1 ? <div className="add-btns"><button type="button"
                                    className="plusButton" onClick={this.removeTabCotnent.bind(this)} data-btnid={key}>-</button><button type="button"
                                        className="plusButton" onClick={this.addNewTabCotnent.bind(this)} data-btnid={key}>+</button></div> : <button type="button"
                                            className="plusButton" onClick={this.removeTabCotnent.bind(this)} data-btnid={key}>-</button>}
                            </div>)
                    }))}
                    </li></div> : <li>No Tab content is present<button type="button"
                        className="plusButton" onClick={this.addNewTabCotnent.bind(this)} data-btnid="0">+</button></li>) : ''}
                <li><h3>{show_content_tabs ? 'Top Content' : 'Content'}</h3></li>
                <li>
                    <JoditEditor
                        editorRef={this.setRef}
                        value={this.state.content}
                        config={this.config}
                        onChange={this.updateContent}
                    /></li>
                {show_content_tabs ?
                    <li><h3>Bottom Content</h3>
                        <JoditEditor
                            editorRef={this.setRef}
                            value={this.state.bottom_content}
                            config={this.config}
                            onChange={this.updateBottomContent}
                        />
                    </li> : ''}
                {(faq_object && faq_object.length > 0) ? <li>
                    <h3>Faq content</h3>
                    {faq_object.map((val, i) => {
                        return (
                            <div className="faqData">
                                <label>
                                    Question {i + 1}: </label>
                                <input type="text" onChange={this.onChageFaq.bind(i)} name="question" data-question={i} value={faq_object[i]["question"]} />
                                <label>Answer {i + 1}:</label>
                                <input type="text" onChange={this.onChageFaq.bind(i)} name="answer" data-answer={i} value={faq_object[i]["answer"]} />
                                {i == faq_object.length - 1 ? <div className="add-btns"><button type="button"
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
                        <h3>User reviews</h3>
                        {reviews_object.map((rev, i) => {
                            return (<div className="reviews">
                                <label>Average review rating</label>
                                <input type="text" onChange={this.reviewsObject.bind(this)} data-listreviewid={i} name="avg_review_rating" value={this.state.reviews_object[i]["avg_review_rating"]} />
                                <label>Total number of reviews</label>
                                <input type="text" onChange={this.reviewsObject.bind(this)} data-listreviewid={i} name="total_reviews_count" value={this.state.reviews_object[i]["total_reviews_count"]} />
                                <div className="reviewsList">
                                    <h3>Reviews List</h3>
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
                                                {k == reviews_object[i]["reviews_list"].length - 1 ? <div className="add-btns"><button type="button"
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
            </ul>
        );
    }
}

export default MetaFields;
