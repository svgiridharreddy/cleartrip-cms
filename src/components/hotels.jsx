import React from "react";
// import Typography from "@material-ui/core/Typography";
// import { withStyles } from "@material-ui/core/styles";
// import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
// import { BrowserRouter as Router, NavLink } from "react-router-dom";
// import MenuItem from "@material-ui/core/MenuItem";
// import TextField from "@material-ui/core/TextField";
// import Route from "react-router-dom/Route";
import FlightsTextFields from "./flightstextfields";
class Hotels extends React.Component {
  state = {
    page_type: "flight-booking",
    subtypes: [
      "booking-overview",
      "booking-route",
      "pnr-status",
      "web-checkin"
    ],
    defaultType: "booking-overview",
    languages: { en: "Eglish", ar: "Arabic" },
    domains: {
      IN: "India",
      AE: "United Arab Emirates",
      SA: "Saudi Arabia",
      KW: "Kuwait",
      OM: "Oman",
      QA: "Qatar",
      BH: "Bahrain"
    }
  };

  render() {
    const {
      page_type,
      subtypes,
      defaultType,
      title,
      description,
      keywords,
      h1Title,
      content
    } = this.state;
    return (
      <div>
        <h1>Cleartrip Hotels</h1>
        <FlightsTextFields
          page_type={page_type}
          subtypes={subtypes}
          defaultType={defaultType}
          title={title}
          description={description}
          h1Title={h1Title}
          content={content}
          keywords={keywords}
        />
      </div>
    );
  }
}

export default Hotels;
