import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import FlightBookingFields from "./FlightBooking";
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
      cityNameSelected: "",
      value: ""
    };
  }

  handleChange = (e, fieldName) => {
    if ([fieldName] == "rte") {
      this.handleRTEchange(e);
    } else {
      debugger;
      this.setState({ [fieldName]: e.target.value });
    }
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
      url = "http://localhost:3000/airline_autocomplete";
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
        url = "http://localhost:3000/airline_autocomplete";
      } else {
        url = "http://localhost:3000/city_autocomplete";
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
    debugger;

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
          name="flight-booking"
          handleChange={(e, fieldName) => this.handleChange(e, fieldName)}
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
        <div>
          <ul className="list-inline">
            <li>
              <label>Country</label>
              <select
                onChange={e => this.handleChange(e, "currentDomain")}
                name="currentDomain"
                value={this.state.currentDomain}
              >
                {Object.keys(domains).map(option => (
                  <option key={option} value={option}>
                    {domains[option]}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label>Language</label>
              <select
                onChange={e => this.handleChange(e, "language")}
                name="currentLanguage"
                value={this.state.currentLanguage}
              >
                {this.returnOptions(languages)}
              </select>
            </li>

            <li>
              <label>Page Type</label>
              <select
                onChange={e => this.handleChange(e, "currentPageType")}
                name="currentPageType"
                value={this.state.currentPageType}
              >
                {this.returnOptions(pageTypes)}
              </select>
            </li>
            {fields}
          </ul>
        </div>
        <button type="submit" onClick={this.handleFormSubmit.bind(this)}>
          Submit
        </button>
      </div>
    );
  }
}

export default Flights;
