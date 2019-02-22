import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { stateToHTML } from "draft-js-export-html";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const API_URL = "http://localhost:3000";

class EditUniqueContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      HeaderEditorState: "",
      FootereditorState: "",
      FaqeditorState: "",
      domain_url: "",
      domain_name: "",
      content_type: '',
      country_name: "",
      page_type: "",
      canonical_tag: "",
      h1_tag: "",
      h2_tag: "",
      h3_tag: "",
      meta_title: "",
      meta_description: "",
      meta_keyword: "",
      top_content: "",
      bottom_content: "",
      faq: "",
      message: "",
      isUpdate: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.conentConvertion = this.conentConvertion.bind(this);
  }

  componentDidMount() {
    var pathName = API_URL + this.props.location.pathname;
    fetch(pathName)
      .then(response => response.json())
      .then(resData => {
        const headerHtml = resData.top_content;
        const footerHtml = resData.bottom_content;
        const faqHtml = resData.faq;
        this.setState({
          HeaderEditorState: this.conentConvertion(headerHtml),
          FootereditorState: this.conentConvertion(footerHtml),
          FaqeditorState: this.conentConvertion(faqHtml),
          domain_name: resData.domain_name,
          domain_url: resData.domain_url,
          content_type: resData.content_type,
          country_name: resData.country_name,
          page_type: resData.page_type,
          canonical_tag: resData.canonical_tag,
          h1_tag: resData.h1_tag,
          h2_tag: resData.h2_tag,
          h3_tag: resData.h3_tag,
          meta_title: resData.meta_title,
          meta_description: resData.meta_description,
          meta_keyword: resData.meta_keyword,
          top_content: resData.top_content,
          bottom_content: resData.bottom_content,
          faq: resData.faq
        });
      });
  }

  conentConvertion(html) {
    if (html == "<p></p>\n" || html == "<p></p>") {
      html = "";
    }
    if (html) {
      const headerContentBlock = convertFromHTML(html);
      const headerContentState = ContentState.createFromBlockArray(
        headerContentBlock
      );
      const HeaderEditorState = EditorState.createWithContent(
        headerContentState
      );
      return HeaderEditorState;
    } else {
      return "";
    }
  }

  onHeaderEditorStateChange: Function = HeaderEditorState => {
    this.setState({ HeaderEditorState });
  };
  onFooterEditorStateChange: Function = FootereditorState => {
    this.setState({ FootereditorState });
  };
  onFaqEditorStateChange: Function = FaqeditorState => {
    this.setState({ FaqeditorState });
  };

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let convertedHeaderData;
    let convertedFooterData;
    let convertedFaqData;
    if (this.state.HeaderEditorState.getCurrentContent !== undefined) {
      convertedHeaderData = draftToHtml(
        convertToRaw(this.state.HeaderEditorState.getCurrentContent())
      );
      convertedHeaderData = convertedHeaderData.replace(/"/g, "'");
    } else {
      convertedHeaderData = this.state.HeaderEditorState;
    }
    if (this.state.FootereditorState.getCurrentContent !== undefined) {
      convertedFooterData = draftToHtml(
        convertToRaw(this.state.FootereditorState.getCurrentContent())
      );
      convertedFooterData = convertedFooterData.replace(/"/g, "'");
    } else {
      convertedFooterData = this.state.FootereditorState;
    }
    if (this.state.FaqeditorState.getCurrentContent !== undefined) {
      convertedFaqData = draftToHtml(
        convertToRaw(this.state.FaqeditorState.getCurrentContent())
      );
      convertedFaqData = convertedFaqData.replace(/"/g, "'");
    } else {
      convertedFaqData = this.state.FaqeditorState;
    }
    const data = {
      domain_name: this.state.domain_name,
      domain_url: this.state.domain_url,
      content_type: this.state.content_type,
      country_name: this.state.country_name,
      page_type: this.state.page_type,
      h1_tag: this.state.h1_tag,
      h2_tag: this.state.h2_tag,
      h3_tag: this.state.h3_tag,
      canonical_tag: this.state.canonical_tag,
      meta_title: this.state.meta_title,
      meta_description: this.state.meta_description,
      meta_keyword: this.state.meta_keyword,
      top_content: convertedHeaderData,
      bottom_content: convertedFooterData,
      faq: convertedFaqData
    };
    axios
      .post(
        `${API_URL}/cmshotels/update/${this.props.match.params.id}`,
        data
      )
      .then(({ data }) => {
        this.setState({
          message: data.message,
          isUpdate: true
        });
        setTimeout(
          function() {
            this.setState({
              domain_name: "",
              domain_url: "",
              content_type: "",
              country_name: "",
              page_type: "",
              canonical_tag: "",
              h1_tag: "",
              h2_tag: "",
              h3_tag: "",
              meta_title: "",
              meta_description: "",
              meta_keyword: "",
              top_content: "",
              bottom_content: "",
              faq: "",
              message: ""
            });
          }.bind(this),
          2000
        );
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    const {
      isUpdate,
      HeaderEditorState,
      FootereditorState,
      FaqeditorState,
      domain_name,
      domain_url,
      content_type,
      country_name,
      page_type,
      canonical_tag,
      h1_tag,
      h2_tag,
      h3_tag,
      meta_title,
      meta_description,
      meta_keyword,
      top_content,
      bottom_content,
      faq
    } = this.state;

    if (isUpdate) {
      return <Redirect to="/hotels" />;
    }
    return (
      <div>
        {this.state.message}
        <h3 align="center">Update Data</h3>
        <Form onSubmit={this.handleSubmit}>
          {domain_url ? (
            <Form.Group as={Row} controlId="formHorizontalDomainUrl">
              <Form.Label column sm={2}>
                Domain Url
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={domain_url}
                  name="domain_url"
                />
              </Col>
            </Form.Group>
          ) : null}
          {domain_name ? (
            <Form.Group as={Row} controlId="formHorizontalDomainName">
              <Form.Label column sm={2}>
                Domain Name
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={domain_name}
                  name="domain_name"
                />
              </Col>
            </Form.Group>
          ) : null}
          <Form.Group as={Row} controlId="formHorizontalContnetSection">
            <Form.Label column sm={2}>
              Content Section
            </Form.Label>
            <Col sm={10}>
              <Form.Control value={content_type} name="content_type" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalCountryName">
            <Form.Label column sm={2}>
              Country Name
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={country_name}
                name="country_name"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>
          {page_type ? (
            <Form.Group as={Row} controlId="formHorizontalPageType">
              <Form.Label column sm={2}>
                Page Type
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={page_type}
                  name="page_type"
                />
              </Col>
            </Form.Group>
          ) : null}
          {canonical_tag ? (
            <Form.Group as={Row} controlId="formHorizontalCanonicalTag">
              <Form.Label column sm={2}>
                Canonical Tag
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={canonical_tag}
                  name="canonical_tag"
                  onChange={this.handleChange}
                />
              </Col>
            </Form.Group>
          ) : null}
          <Form.Group as={Row} controlId="formHorizontalH1Title">
            <Form.Label column sm={2}>
              H1 Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={h1_tag}
                name="h1_tag"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalH2Title">
            <Form.Label column sm={2}>
              H2 Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={h2_tag}
                name="h2_tag"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalH3Title">
            <Form.Label column sm={2}>
              H3 Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={h3_tag}
                name="h3_tag"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalMetaTitle">
            <Form.Label column sm={2}>
              Meta Title
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={meta_title}
                name="meta_title"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalMetaDescription">
            <Form.Label column sm={2}>
              Meta Description
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={meta_description}
                name="meta_description"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalMetaKeywords">
            <Form.Label column sm={2}>
              Meta Keywords
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={meta_keyword}
                name="meta_keyword"
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalTopContent">
            <Form.Label column sm={2}>
              Header Content
            </Form.Label>
            <Col sm={10}>
              <Editor
                editorState={HeaderEditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onHeaderEditorStateChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalFooterContent">
            <Form.Label column sm={2}>
              Footer Content
            </Form.Label>
            <Col sm={10}>
              <Editor
                editorState={FootereditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onFooterEditorStateChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formHorizontalFaqContent">
            <Form.Label column sm={2}>
              Freaquently Asked Questions
            </Form.Label>
            <Col sm={10}>
              <Editor
                editorState={FaqeditorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={this.onFaqEditorStateChange}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit">Update</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

export default EditUniqueContent;
