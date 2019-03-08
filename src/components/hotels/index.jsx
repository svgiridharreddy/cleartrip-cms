import React, { Component } from "react";
import { Form, Col } from "react-bootstrap";
import './css/Hotels.css';
import UniqueContentDataCollection from './unique/UniqueContentDataCollection';
import CommonContentDataCollection from './common/CommonContentDataCollection';
import loginHelpers from "../helper";

const contentType = ["Common Data", "Unique Data"];

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content_type: "",
      uniqData: false
    };
  }

  handleOnChange = e => {
    let uniqData = false 
    if(e.target.value === "Unique Data"){
      uniqData = true
    }
    this.setState({ content_type: e.target.value,uniqData:uniqData });
  };

  render() {
    loginHelpers.checkUser()
    let contentFields;
    const { content_type,uniqData } = this.state;
    if (content_type === "Unique Data") {
      contentFields = (
        <UniqueContentDataCollection content_type={content_type} uniqData={uniqData} />
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
