import React, { Component } from "react";
import { Form, Col } from 'react-bootstrap';

import UniqueContentDataCollection from './unique/UniqueContentDataCollection';
import CommonContentDataCollection from './common/CommonContentDataCollection';

const contentType = ["Common Data","Unique Data"]
const domainType = { "IN": "https://www.cleartrip.com", "AE": "https://www.cleartrip.ae", "SA": "https://www.cleartrip.sa", "QA": "https://qa.cleartrip.com", "OM": "https://om.cleartrip.com", "BH": "https://bh.cleartrip.com", "KW": "https://kw.cleartrip.com"}
const pageType = ["City", "Stars", "Locality", "Chain", "PropertyType", "Amenity", "Budget", "Landmark", "Hospital", "Weekend Getaways", "PropertyInLocality","Region"]

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contentValue: ''
    }
  }

  handleOnChange = e => {
    this.setState({ contentValue: e.target.value });
  };

  render() {
    let contentFields;
    const { contentValue } = this.state
    if (contentValue === "Unique Data") {
       contentFields = (
        <UniqueContentDataCollection />
        )
    } else if (contentValue === "Common Data") {
        contentFields = (
          <CommonContentDataCollection />
          )
    }
    return (
      <div>
        <h1>Cleartrip Hotels</h1>
        <div className="filter">
            <Form.Group as={Col} style={{width: '50%'}}>
              <Form.Label>Content Section</Form.Label>
              <Form.Control
                as="select"
                defaultValue="Content Section"
                onChange={this.handleOnChange}
                name="contentType"
              >
                <option value="">
                  Select Content
                </option>
                {
                contentType.map((content,i) => <option key={i}>{content}</option>)
              }
              </Form.Control>
            </Form.Group>
          { contentFields }
        </div>
      </div>
    );
  }
}

export default Index;
