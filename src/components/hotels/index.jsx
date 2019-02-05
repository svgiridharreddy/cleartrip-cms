import React, { Component } from "react";
import UniqueContentDataCollection from './UniqueContentDataCollection.jsx';
// import Typography from "@material-ui/core/Typography";
// import { withStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
// import { BrowserRouter as Router, NavLink } from "react-router-dom";
// import MenuItem from "@material-ui/core/MenuItem";
// import TextField from "@material-ui/core/TextField";
// import Route from "react-router-dom/Route";

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

    }
    return (
      <div>
        <h1>Cleartrip Hotels</h1>
        <div className="filter">
          <label htmlFor="contentType">
            Content Section: 
            <select
              id="contentType"
              name="contentType"
              onChange={this.handleOnChange}
            >
            <option value="">Select Options</option>
            {
              contentType.map((content,i) => <option key={i}>{content}</option>)
            }
            </select>
          </label>
          { contentFields }
        </div>
      </div>
    );
  }
}

export default Index;
