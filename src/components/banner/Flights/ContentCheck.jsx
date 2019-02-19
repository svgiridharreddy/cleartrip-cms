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
class ContentCheck extends Component {
  constructor(props) {
    super(props);
    const html = "<p> hello world</p>";
    const contentBlock = convertFromHTML(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock);
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        form_data: props.formdata,
        editorState: editorState,
        content: ""
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
    this.setState({
      content:convertedData
    })
  }
  render() {
    const { editorState } = this.state;
    let _self = this;
    let form_data = _self.state.form_data;
    return (
      <div>
        <Form>
          <Editor
            editorState={this.state.editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="editer-content"
            onEditorStateChange={this.onChange}
          />
          <Button onClick={this.checkData}>save</Button>
          {JSON.stringify(this.state.content)}
        </Form>
      </div>
    );
  }
}
export default ContentCheck;