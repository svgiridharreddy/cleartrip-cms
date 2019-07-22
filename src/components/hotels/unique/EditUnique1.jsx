import React, { Component } from "react";
import { host } from '../../helper';
import {Button} from "react-bootstrap";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import 'jodit';
import 'jodit/build/jodit.min.css';
import JoditEditor from "jodit-react";
import $ from "jquery";
window.jQuery = $;
window.$ = $;
global.jQuery = $;


const API_URL = host()+"/cmshotels/edit/";

class EditUniqueContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      top_content: "",
      bottom_content: "",
      domain_url: "",
      domain_name: this.props.domain_name,
      content_type: '',
      country_name: this.props.country_name,
      h1_tag: "",
      h2_tag: "",
      h3_tag: "",
      meta_title: "",
      meta_description: "",
      meta_keyword: "",
      faqs: [],
      reviews: [],
      last_modified: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.returnOptions = this.returnOptions.bind(this);
    this.onChangeFaq = this.onChangeFaq.bind(this);
    this.onChangeReview = this.onChangeReview.bind(this);
    this.checkBackBtnFun = this.checkBackBtnFun.bind(this);
    this.updateHeaderContent = this.updateHeaderContent.bind(this);
    this.updateFooterContent = this.updateFooterContent.bind(this);
  }

  checkBackBtnFun(){
    const alrt = window.confirm('Do you want to save the changes you made?')
    if (alrt === true) {
      this.props.handleChangeEditData(this.state)
    } else {
      this.props.backBtnFun()
    }
  }

  addNewFaq(e) {
    let _self = this
    let faqs = this.state.faqs
    let addNew = true
    faqs.map((faq, i) => {
      if (faq["question"] != "" && faq["answer"] != "") {
        addNew = true
      } else {
        addNew = false
      }
    })
    if (addNew) {
      faqs.push({ question: "", answer: "" })
      _self.setState({
        faqs: faqs
      })
    } else {
      NotificationManager.error("Please Fill All Faq's Properly", "Field Missing", "3000")
    }
  }
  addNewReview(e) {
    let _self = this
    let reviews = _self.state.reviews
    let addReview = true
    reviews.map( (review, i) => {
      if (review["user_name"] != "" && review["review"] != "" && review["rating"] != "") {
        addReview = true
      } else {
        addReview = false
      }
    })
    if (addReview) {
      reviews.push({ user_name: "", review: "", rating: "" })
      _self.setState({
        reviews: reviews
      })
    } else {
      NotificationManager.error("Please Fill All Review's Properly", "Field Missing", "3000")
    }
  }
  removeFaq(e) {
    let _self = this
    let faqs = this.state.faqs
    let index = parseInt(e.target.dataset.btnid)
    faqs.splice(index, 1)
    _self.setState({
      faqs: faqs
    })
  };
  removeReview(e) {
    let _self = this
    let reviews = _self.state.reviews
    let index = parseInt(e.target.dataset.btnid)
    reviews.splice(index, 1)
    _self.setState({
      reviews: reviews
    })
  };
  onChangeFaq(e) {
    let _self = this
    let faqs = _self.state.faqs
    let qIndex = parseInt(e.target.dataset.question)
    let aIndex = parseInt(e.target.dataset.answer)
    let index = e.target.name === "question" ? qIndex : aIndex
    faqs[index][e.target.name] = e.target.value
    _self.setState({
      faqs: faqs
    })
  }
  onChangeReview(e) {
    let _self = this
    let reviews = _self.state.reviews
    let uNIndex = parseInt(e.target.dataset.user_name)
    let rIndex = parseInt(e.target.dataset.review)
    let raIndex = parseInt(e.target.dataset.rating)
    let index;
    if (e.target.name === "user_name") {
      index =  uNIndex
    } else if (e.target.name === "review") {
      index =  rIndex
    } else if (e.target.name === "rating") {
      index =  raIndex
    }
    reviews[index][e.target.name] = e.target.value
    _self.setState({
      reviews: reviews
    })
  }

  componentDidMount() {
    var pathName = API_URL + this.props.contentRecord.id;
    fetch(pathName)
      .then(response => response.json())
      .then(resData => {
      var faqContent = (resData.faqs === null || resData.faqs === "") ? [] : JSON.parse(resData.faqs) || []
      var reviewSection = (resData.reviews === null || resData.reviews === "") ? [] : JSON.parse(resData.reviews) || []
      this.setState({
        id: resData.id,
        domain_url: resData.domain_url,
        content_type: resData.content_type,
        country_name: resData.country_name,
        h1_tag: resData.h1_tag,
        h2_tag: resData.h2_tag,
        h3_tag: resData.h3_tag,
        meta_title: resData.meta_title,
        meta_description: resData.meta_description,
        meta_keyword: resData.meta_keyword,
        top_content: resData.top_content || '',
        bottom_content: resData.bottom_content || '',
        faqs: faqContent,
        reviews: reviewSection
      });
    });
  }

  updateHeaderContent(value) {
      let _self = this;
      _self.setState({ top_content: value })
  }
  updateFooterContent(value) {
      let _self = this;
      _self.setState({ bottom_content: value })
  }
  jodit;
  setRef = jodit => this.jodit = jodit;
  config = {
      readonly: false
  }

  handleChange(e) {
    let lastModifiedArray = this.state.last_modified
    if (lastModifiedArray.indexOf(e.target.name) == -1) {
      lastModifiedArray.push(e.target.name)
    }
    this.setState({
      [e.target.name]: e.target.value,
      last_modified: lastModifiedArray
    });
  }

  addEmojiTitle = (e) => {
    //console.log(e.unified)
    if (e.unified.length <= 5){
      let emojiPic = String.fromCodePoint(`0x${e.unified}`)
      this.setState({
        meta_title: this.state.meta_title + emojiPic
      })
    }else {
      let sym = e.unified.split('-')
      let codesArray = []
      sym.forEach(el => codesArray.push('0x' + el))
      //console.log(codesArray.length)
      //console.log(codesArray)  // ["0x1f3f3", "0xfe0f"]
      let emojiPic = String.fromCodePoint(...codesArray)
      this.setState({
        meta_title: this.state.meta_title + emojiPic
      })
    }
  }

  addEmojiDescription = (e) => {
    //console.log(e.unified)
    if (e.unified.length <= 5){
      let emojiPic = String.fromCodePoint(`0x${e.unified}`)
      this.setState({
        meta_description: this.state.meta_description + emojiPic
      })
    }else {
      let sym = e.unified.split('-')
      let codesArray = []
      sym.forEach(el => codesArray.push('0x' + el))
      //console.log(codesArray.length)
      //console.log(codesArray)  // ["0x1f3f3", "0xfe0f"]
      let emojiPic = String.fromCodePoint(...codesArray)
      this.setState({
        meta_description: this.state.meta_description + emojiPic
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

  handleSubmit(e) {
    this.props.handleChangeEditData(this.state)
  }

  render() {
    const {
      faqs,
      reviews,
      top_content,
      bottom_content,
      domain_url,
      content_type,
      country_name,
      h1_tag,
      h2_tag,
      h3_tag,
      meta_title,
      meta_description,
      meta_keyword,
    } = this.state;

    return (
      <div className="common-hotel-wrapper">
      <div className="top-wrapper">
        <h3 align="center">Update Data</h3>
        <div className="filter-fileds">
          <ul className="list-inline">
            <li>
                  <Button variant="secondary" onClick ={() => this.checkBackBtnFun()}>Back</Button>
                </li>
            <li>
              <label>Domain Url</label>
              <input type="text" value={domain_url} name="domain_url" />
            </li>
            <li>
              <label>Content Section</label>
              <input value={content_type} name="content_type" />
            </li>
            <li>
              <label>Country Name</label>
              <input value={country_name} name="country_name" />
            </li>
          </ul>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
      </div>
      <div className="common-hotel-content">
          <ul className="common-hotels-field">
            <li>
              <label>H1 Title</label>
              <input type="text" value={h1_tag} name="h1_tag" onChange={this.handleChange} />
            </li>
            <li>
              <label>H2 Title(Search widget tag line)</label>
              <input type="text" value={h2_tag} name="h2_tag" onChange={this.handleChange} />
            </li>
            <li>
              <label>H3 Title(Search widget tag line)</label>
              <input type="text" value={h3_tag} name="h3_tag" onChange={this.handleChange} />
            </li>
            <li>
              <label>Meta Title</label>
              <input type="text" value={meta_title} name="meta_title" onChange={this.handleChange} />
              <span>
                <Picker onSelect={this.addEmojiTitle} />
              </span>
            </li>
            <li>
              <label>Meta Description</label>
              <input type="text" value={meta_description} name="meta_description" onChange={this.handleChange} />
              <span>
                <Picker onSelect={this.addEmojiDescription} />
              </span>
            </li>
            <li>
              <label>Meta Keywords</label>
              <input type="text" value={meta_keyword} name="meta_keyword" onChange={this.handleChange} />
            </li>
            <li>
              <label>Header Content</label>
              <JoditEditor
                  editorRef={this.setRef}
                  value={this.state.top_content}
                  config={this.config}
                  onChange={this.updateHeaderContent}
              />
            </li>
            <li>
              <label>Footer Content</label>
              <JoditEditor
                  editorRef={this.setRef}
                  value={this.state.bottom_content}
                  config={this.config}
                  onChange={this.updateFooterContent}
              />
            </li>
            <li>
              <label>Faq Content</label>
              {
                faqs.map((val, i) => {
                  return (
                    <div className="faqData">
                      <label>Question {i + 1}: </label>
                        <input type="text" onChange={this.onChangeFaq.bind(i)} name="question" data-question={i} value={faqs[i]["question"]} />
                      <label>Answer {i + 1}:</label>
                        <input type="text" onChange={this.onChangeFaq.bind(i)} name="answer" data-answer={i} value={faqs[i]["answer"]} />
                      {
                        i == faqs.length - 1 ? 
                        <div>
                          <button type="button" className="plusButton" onClick={this.removeFaq.bind(this)} data-btnid={i}>-</button>
                          <button type="button" className="plusButton" onClick={this.addNewFaq.bind(this)} data-btnid={i}>+</button> 
                        </div>
                          : 
                        <div>
                          <button type="button" className="plusButton" onClick={this.removeFaq.bind(this)} data-btnid={i}>-</button>
                        </div>
                      }
                    </div>
                  )
                })
              }
              {
                faqs.length === 0 ? <button type="button"
                        className="plusButton" onClick={this.addNewFaq.bind(this)} data-btnid={0}>+</button> : ""
              }
            </li>
            <li>
              <label>Reviews Section</label>
              {
                reviews.map((val, i) => {
                  return (
                    <div className="faqData">
                      <label>User Name {i + 1}: </label>
                        <input type="text" onChange={this.onChangeReview.bind(i)} name="user_name" data-user_name={i} value={reviews[i]["user_name"]} />
                      <label>Review {i + 1}:</label>
                        <input type="text" onChange={this.onChangeReview.bind(i)} name="review" data-review={i} value={reviews[i]["review"]} />
                      <label>Rating {i + 1}:</label>
                        <input type="text" onChange={this.onChangeReview.bind(i)} name="rating" data-rating={i} value={reviews[i]["rating"]} />
                      {
                        i == reviews.length - 1 ? 
                        <div>
                          <button type="button" className="plusButton" onClick={this.removeReview.bind(this)} data-btnid={i}>-</button>
                          <button type="button" className="plusButton" onClick={this.addNewReview.bind(this)} data-btnid={i}>+</button> 
                        </div>
                          : 
                        <div>
                          <button type="button" className="plusButton" onClick={this.removeReview.bind(this)} data-btnid={i}>-</button>
                        </div>
                      }
                    </div>
                  )
                })
              }
              {
                reviews.length === 0 ? <button type="button"
                        className="plusButton" onClick={this.addNewReview.bind(this)} data-btnid={0}>+</button> : ""
              }
            </li>
            <li>
              <button
              type="button"
              onClick={this.handleSubmit}
              className="button">
              Update
            </button>
            </li>
          </ul>
      </div>
      </div>
    );
  }
}

export default EditUniqueContent;
