import React, { Component } from "react";
import { Button, Form, Col, ButtonToolbar } from "react-bootstrap";
import axios from "axios";
import "../Banner.css";
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
import "../../../node_modules/react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

class FlightScheduleForm extends Component {
  constructor(props) {
    super(props);
    const html = props.content;
    const contentBlock = convertFromHTML(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        form_data: props.formdata,
        editorState: editorState
      };
    }
    this.onChange = this.onChange.bind(this);
    this.checkData = this.checkData.bind(this);
  }
  onChange(editorState) {
    this.setState({ editorState });
  }
  checkData(e) {
    let convertedData = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    convertedData = convertedData.replace(/"/g, "'");
  }
  render() {
    const { editorState } = this.state;
    let _self = this;
    let form_data = _self.state.form_data;
    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="textbox"
                name="country_code"
                value={form_data.country_code}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Page type</Form.Label>
              <Form.Control
                type="textbox"
                name="page_type"
                value={form_data.page_type}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Sub page type</Form.Label>
              <Form.Control
                type="text"
                name="page_subtype"
                value={form_data.page_subtype}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Language</Form.Label>
              <Form.Control
                type="textbox"
                name="language"
                value={form_data.language}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>section</Form.Label>
              <Form.Control
                type="text"
                name="section"
                value={form_data.section}
              />
            </Form.Group>
          </Form.Row>
          <Editor
            editorState={this.state.editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="editer-content"
            onEditorStateChange={this.onChange}
          />
          <Button onClick={this.checkData}>save</Button>
        </Form>
      </div>
    );
  }
}
export default FlightScheduleForm;
