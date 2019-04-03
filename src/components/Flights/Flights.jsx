import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import FlightBookingFields from "./FlightBooking1";
import FlightScheduleFields from "./FlightSchedule";
import { Button, Form, Col, ButtonToolbar } from "react-bootstrap";

const pageTypes = [
  "Select Page Type",
  "flight-booking",
  "flight-schedule",
  "flight-tickets"
];
const languages = ["Select Language", "English", "Arabic"];
const domains = {
  selectDomain: "Select Domain",
  IN: "India",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  KW: "Kuwait",
  OM: "Oman",
  QA: "Qatar",
  BH: "Bahrain"
};

class Flights extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // currentPageType: this.props.currentPageType,
      // currentDomain: this.props.currentDomain,
      // currentLanguage: this.props.currentLanguage,

      currentPageType: "",
      currentDomain: "",
      currentLanguage: "",
      currentSubType: "",
      categoryType: "",
      title: "",
      description: "",
      keywords: "",
      content: "",
      h1Tag: "",
      airlineName: "",
      cityName: "",
      depCityName: "",
      arrCityName: "",
      options: [],
      isHomePage: false,
      flight: {},
      readOnlyValue: false,
      selectedOption: "",
      options: [],
      options_dep: [],
      options_arr: [],
      depCityNameSelected: "",
      arrCityNameSelected: "",
      airlineNameSelected: "",
      cityNameSelected: "",
      value: ""
    };
  }

  handleChange = (e, fieldName) => {
    debugger
    if ([fieldName] == "rte") this.handleRTEchange(e);
    else this.setState({ [fieldName]: e.target.value });
  };

  handleRTEchange = content => {
    this.setState({ content });
    if (this.props.onChange) {
      // Send the changes up to the parent component as an HTML string.
      // This is here to demonstrate using `.toString()` but in a real app it
      // would be better to avoid generating a string on each change.
      this.props.onChange(content.toString("html"));
    }
  };

  getInfo = fieldName => {
    let url = "";
    if (fieldName === "airlineName") {
      url = "http://13.251.49.54:82/airline_autocomplete";
    } else {
      url = "/city_autocomplete";
    }
    axios
      .get(url, { params: { query_term: this.state.query } })
      .then(({ response }) => {
        this.setState({
          options: response.data
        });
      });
  };

  handleInputChange = (e, fieldName) => {
    this.setState(
      {
        query: e.target.value
      },
      () => {
        if (this.state.query && this.state.query.length > 1) {
          if (this.state.query.length % 2 === 0) {
            this.getInfo();
          }
        } else if (!this.state.query) {
        }
      }
    );
  };

  returnOptions = options => {
    return options.map((opt, idx) => {
      return (
        <option key={idx} value={opt}>
          {opt}
        </option>
      );
    });
  };
  handleAutoSearch = (e, fieldName) => {
    let target_value = e;
    if (target_value !== "" && target_value.length >= -1) {
      let url = "";
      if (fieldName === "airlineName") {
        url = "http://13.251.49.54:82/airline_autocomplete";
      } else {
        url = "http://13.251.49.54:82/city_autocomplete";
      }
      axios
        .get(url, { params: { query_term: target_value } })
        .then(response => {
          if (fieldName === "airlineName") {
            this.setState({ options: response.data });
          } else if (fieldName === "depCityName") {
            this.setState({ options_dep: response.data });
          } else if (fieldName === "arrCityName") {
            debugger;
            this.setState({ options_arr: response.data });
          } else if (fieldName === "cityName") {
            this.setState({ options: response.data });
          }
        })
        .then(response => {
          console.log();
        });
      console.log(`Option selected:`, target_value);
    }
  };

  handleSelectedInput = (p, fieldName) => {
    debugger;
    if (fieldName === "airlineName") {
      this.setState({ selectedOption: p, airlineName: p.value });
    } else if (fieldName === "depCityName") {
      this.setState({ depCityNameSelected: p, depCityName: p.value });
    } else if (fieldName === "arrCityName") {
      this.setState({ arrCityNameSelected: p, arrCityName: p.value });
    } else if (fieldName === "cityName") {
      debugger;
      this.setState({ cityNameSelected: p, cityName: p.value });
    }
  };

  handleFormSubmit = e => {
    e.preventDefault();
    debugger;
    const flightValues = this.state;

    let postData = {
      flights_data: {
        domain: flightValues["currentDomain"],
        language: flightValues["currentLanguage"],
        page_type: flightValues["currentPageType"],
        page_subtype: flightValues["currentSubType"],
        category: flightValues["categoryType"],
        title: flightValues["title"],
        description: flightValues["description"],
        keywords: flightValues["keywords"],
        content: flightValues["content"].toString("html"),
        h1_title: flightValues["h1Tag"],
        airline_name: flightValues["airlineName"],
        city_name: flightValues["cityNameSelected"]["value"],
        dep_city_name: flightValues["depCityNameSelected"]["value"],
        arr_city_name: flightValues["arrCityNameSelected"]["value"],
        readOnlyValue: true
      }
    };

    axios({
      method: "post",
      url: "http://localhost:3000/flights",
      data: postData,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        //handle success
        console.log(response);

        this.setState({ isHomePage: true });
      })
      .catch(response => {
        this.setState({ isHomePage: false });
      });
  };
  onRecieveProps = () => {
    var { flight } = this.props.location.state;
    debugger;
    this.setState({
      currentPageType: flight.page_type,
      currentDomain: flight.domain,
      currentLanguage: flight.language,
      currentSubType: flight.page_subtype,
      categoryType: "uniq",
      title: flight.title,
      description: flight.description,
      keywords: flight.keyword,
      content: flight.content,
      h1Tag: flight.heading,
      airlineName: flight.airline_name,
      cityName: flight.city_name,
      depCityNameSelected: { label: flight.source, value: flight.source },
      depCityName: flight.source,
      arrCityNameSelected: {
        label: flight.destination,
        value: flight.destination
      },
      airlineNameSelected: { label: flight.airline_name, value:flight.airline_name },
      arrCityName: flight.destination,
      readOnlyValue: true
    });
  };
  componentWillMount() {
    if (this.props.location.state !== undefined) {
      debugger;
      this.onRecieveProps();
    }
  }

  render() {
    const { classes } = this.props;

    const {
      currentPageType,
      currentDomain,
      currentLanguage,
      categoryType,
      currentSubType,
      title,
      description,
      keywords,
      content,
      h1Tag,
      airlineName,
      cityName,
      depCityName,
      arrCityName,
      depCityNameSelected,
      arrCityNameSelected,
      airlineNameSelected,
      readOnlyValue
    } = this.state;
    let fields;
    if (this.state.isHomePage) {
      return (
        <Redirect
          exact
          to={{
            pathname: "/",
            state: {
              domain: currentDomain,
              pageType: currentPageType,
              subType: currentSubType,
              language: currentLanguage
            }
          }}
        />
      );
    }
    if (currentPageType === "flight-booking") {
      fields = (
        <FlightBookingFields
          currentSubType={currentSubType}
          categoryType={categoryType}
          classes={classes}
          name="flight-booking"
          handleChange={(e, fieldName) => this.handleChange(e, fieldName)}
          handleRTEchange={content => this.handleRTEchange(content)}
          autoCompleteFields={(e, fieldName) =>
            this.autoCompleteFields(e, fieldName)
          }
          handleInputChange={(e, fieldName) =>
            this.handleInputChange(e, fieldName)
          }
          title={title}
          description={description}
          keywords={keywords}
          content={content}
          h1Tag={h1Tag}
          airlineName={airlineName}
          depCityName={depCityName}
          arrCityName={arrCityName}
          depCityNameSelected={depCityNameSelected}
          arrCityNameSelected={arrCityNameSelected}
          airlineNameSelected={airlineNameSelected}
          readOnlyValue={readOnlyValue}
          handleAutoSearch={(e, fieldName) =>
            this.handleAutoSearch(e, fieldName)
          }
          options={this.state.options}
          handleSelectedInput={(p, fieldName) =>
            this.handleSelectedInput(p, fieldName)
          }
          options_dep={this.state.options_dep}
          options_arr={this.state.options_arr}
        />
      );
    } else if (currentPageType === "flight-schedule") {
      fields = (
        <FlightScheduleFields
          currentSubType={currentSubType}
          categoryType={categoryType}
          classes={classes}
          name="flight-schedule"
          handleChange={(e, fieldName) => this.handleChange(e, fieldName)}
          handleRTEchange={content => this.handleRTEchange(content)}
          autoCompleteFields={(e, fieldName) =>
            this.autoCompleteFields(e, fieldName)
          }
          handleInputChange={(e, fieldName) =>
            this.handleInputChange(e, fieldName)
          }
          title={title}
          description={description}
          keywords={keywords}
          content={content}
          h1Tag={h1Tag}
          cityName={cityName}
          depCityName={depCityName}
          arrCityName={arrCityName}
          depCityNameSelected={depCityNameSelected}
          arrCityNameSelected={arrCityNameSelected}
          readOnlyValue={readOnlyValue}
          handleAutoSearch={(e, fieldName) =>
            this.handleAutoSearch(e, fieldName)
          }
          options={this.state.options}
          handleSelectedInput={(p, fieldName) =>
            this.handleSelectedInput(p, fieldName)
          }
          options_dep={this.state.options_dep}
          options_arr={this.state.options_arr}
        />
      );
    }
    return (
      <div className="top-wrapper">
        <h1>Cleartrip Flights</h1>
        <div>
          <ul>
            <li>
              <label>Select Country</label>
              <select
                disabled={readOnlyValue}
                as="select"
                onChange={e => this.handleChange(e, "currentDomain")}
                name="currentDomain"
                value={currentDomain}
              >
                {Object.keys(domains).map(option => (
                  <option key={option} value={option}>
                    {domains[option]}
                  </option>
                ))}
              </select>
            </li>

            <li>
              <label>Select language</label>
              <select
                disabled={readOnlyValue}
                onChange={e => this.handleChange(e, "currentLanguage")}
                name="currentLanguage"
                value={currentLanguage}
              >
                {this.returnOptions(languages)}
              </select>
            </li>
            <li>
              <label> Page type</label>
              <select
                disabled={readOnlyValue}
                onChange={e => this.handleChange(e, "currentPageType")}
                name="pageType"
                value={currentPageType}
              >
                {this.returnOptions(pageTypes)}
              </select>
            </li>
            {fields}
          </ul>
          <button type="submit" onClick={this.handleFormSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default Flights;