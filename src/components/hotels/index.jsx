import React, { Component } from "react";
import { Form, Col } from "react-bootstrap";

import UniqueContentDataCollection from './unique/uniqueContentDataCollection';
import CommonContentDataCollection from './common/commonContentDataCollection';

const contentType = ["Common Data", "Unique Data"];

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content_type: ""
    };
  }

  handleOnChange = e => {
    this.setState({ content_type: e.target.value });
  };

  render() {
    let contentFields;
    const { content_type } = this.state;
    if (content_type === "Unique Data") {
      contentFields = (
        <UniqueContentDataCollection content_type={content_type} />
      );
    } else if (content_type === "Common Data") {
      contentFields = (
        <CommonContentDataCollection content_type={content_type} />
      );
    }
    return (
      <div>
        <h1>Cleartrip Hotels</h1>
        <div className="filter">
          <Form>
            <Form.Row style={{ width: "50%" }}>
              <Form.Group as={Col}>
                <Form.Label>Content Section</Form.Label>
                <Form.Control
                  as="select"
                  defaultValue="Content Section"
                  onChange={this.handleOnChange}
                  name="content_type"
                >
                  <option value="">Select Content</option>
                  {contentType.map((content, i) => (
                    <option key={i}>{content}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>
          </Form>
          {contentFields}
        </div>
      </div>
    );
  }
}

export default Index;
