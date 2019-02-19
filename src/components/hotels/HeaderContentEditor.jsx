import React, { Component } from 'react';
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
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class HeaderContentEditor extends Component {
	constructor(props) {
    super(props);
    debugger;
      this.state = {
        editorState: EditorState.createEmpty(),
        content: props.content
      };
  }

  componentDidMount() {
    const html = this.state.content;
    const contentBlock = convertFromHTML(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock);
      const editorState = EditorState.createWithContent(contentState);
      this.setState = {
        editorState: editorState,
      };
    }
  }

  onEditorStateChange: Function = (editorState) => {
    this.setState({editorState})
    this.props.onHeaderChangeEditor(this.state.editorState, "top_content")
  };

  render() {
    const { editorState } = this.state;
    return (
      <Editor
        editorState={editorState}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={this.onEditorStateChange}
      />
    )
  }
}

export default HeaderContentEditor;