import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Banner.css";
import TableData from "./TableData";
class FlightScheduleRevamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form_data: {
        domain: "",
        language: "",
        page_type: "",
        page_subtype: "",
        section: "",
        source: "",
        destination: "",
        content_type: "",
        airline_name: ""
      },
      routesHide: true,
      sectionHide: true,
      pageSubTypeHide: true,
      contentTypeHide: true,
      from_cities_list: [],
      to_cities_list: [],
      results: [],
      showEmptymsg: true
    };
    this.optReturn = this.optReturn.bind(this);
    this.countryRtn = this.countryRtn.bind(this);
    this.routesAutoComplete = this.routesAutoComplete.bind(this);
    this.createRouteInfo = this.createRouteInfo.bind(this);
  }
  handleChange(field, e) {
    let _self = this;
    _self.setState({ results: [] });
    let form_data = _self.state.form_data;
    form_data[field] = e.target.value;
    _self.setState({
      form_data
    });

    // Flight schedule flow starting
    if (
      e.target.name === "page_type" &&
      (e.target.value === "flight-schedule" ||
        e.target.value == "flight-tickets")
    ) {
      let form_json = {
        section: "",
        destination: "",
        source: "",
        page_subtype: "",
        content_type: ""
      };
      Object.keys(form_json).map(form => (form_data[form] = ""));
      this.setState({
        form_data
      });
      this.setState({
        sectionHide: true,
        pageSubTypeHide: false,
        routesHide: true,
        contentTypeHide: true
      });
    }
    if (e.target.name === "page_subtype") {
      let form_json = {
        section: "",
        destination: "",
        source: "",
        content_type: ""
      };
      Object.keys(form_json).map(form => (form_data[form] = ""));
      this.setState({
        form_data
      });
      this.setState({
        sectionHide: false,
        routesHide: true,
        contentTypeHide: e.target.value == "routes" ? false : true
      });
    }
    if (e.target.name == "content_type") {
      let form_json = {
        destination: "",
        source: ""
      };
      Object.keys(form_json).map(form => (form_data[form] = ""));
      this.setState({
        form_data
      });
      this.setState({
        routesHide: e.target.value == "unique" ? false : true
      });
    }
    // Flight schedule flow ending

    if (
      form_data["domain"] !== "" &&
      form_data["language"] !== "" &&
      form_data["page_type"] !== "" &&
      form_data["section"] !== "" &&
      form_data["page_subtype"] !== ""
    ) {
      axios
        .get("http://localhost:3000/fetch_details_revamp", {
          params: { data: form_data }
        })
        .then(response => {
          if (response.data && response.data.length > 0) {
            this.setState({
              showEmptymsg: true,
              results: response.data
            });
          } else {
            this.setState({
              showEmptymsg: false
            });
          }
        });
    }
    if (e.target.name === "page_type" && e.target.value === "flight-booking") {
      let form_json = {
        page_subtype: "",
        section: "",
        source: "",
        destination: "",
        content_type: ""
      };
      Object.keys(form_json).map(form => (form_data[form] = ""));
      this.setState({
        form_data
      });
      this.setState({
        bookingPage: false,
        sectionHide: false,
        pageSubTypeHide: false,
        routesHide: true
      });
    }
  }
  optReturn(optdata) {
    return optdata.map((sub, i) => {
      return (
        <option key={i} value={sub}>
          {sub}
        </option>
      );
    });
  }
  countryRtn(optData) {
    return optData.map((country, i) => {
      return (
        <option key={i} value={country.code}>
          {country.name}
        </option>
      );
    });
  }
  routesAutoComplete(r) {
    debugger;
  }
  createRouteInfo() {
    axios({
      method: "post",
      url: "http://localhost:3000/fetch_details_revamp",
      data: this.state.form_data
    }).then(response => {
      debugger;
    });
  }
  render() {
    let _self = this;
    let form_data = _self.state.form_data;

    let country_codes = [
      { name: "India", code: "IN" },
      { name: "Qatar", code: "QA" },
      { name: "Arab Emirates", code: "AE" },
      { name: "Kuwait", code: "KW" },
      { name: "Saudi Arabia", code: "SA" },
      { name: "Bahrain", code: "BH" },
      { name: "Oman", code: "OM" }
    ];
    let languages = [
      { name: "English", code: "en" },
      { name: "Arabic", code: "ar" },
      { name: "Hindi", code: "hi" }
    ];
    let pageType = [
      { code: "flight-schedule", name: "Flight Schedule" },
      { code: "flight-booking", name: "Flight Booking" },
      { code: "flight-tickets", name: "Flight Tickets" }
    ];
    let flightScheduleSubPages = ["index", "routes"];
    let flightBookingSubPages = [
      "overview",
      "airline-route",
      "pnr",
      "webcheck-in",
      "baggages",
      "customer-support"
    ];
    let flightTicketSubpages = ["index", "route"];
    let sections = ["dom", "int"];
    let contentTypeOpt = ["uniq", "templetized"];
    let countryOpt = this.countryRtn(country_codes);
    let languageOpt = this.countryRtn(languages);
    let pageTypeOpt = this.countryRtn(pageType);
    let flightScheduleSubPagesOpt = this.optReturn(flightScheduleSubPages);
    let flightBookingSubPagesOpt = this.optReturn(flightBookingSubPages);
    let flightTicketSubpagesOpt = this.optReturn(flightTicketSubpages);
    let sectionOpt = this.optReturn(sections);
    let contentOpt = this.optReturn(contentTypeOpt);
    return (
      <div className="top-wrapper">
        <div className="filter-fileds">
          <ul className="list-inline">
            <li>
              <label>Country</label>
              <select
                onChange={this.handleChange.bind(this, "domain")}
                name="domain"
                value={form_data.domain}
              >
                <option value="" disabled={true} selected>
                  select country
                </option>
                {countryOpt}
              </select>
            </li>
            <li>
              <label>Language</label>
              <select
                as="select"
                onChange={this.handleChange.bind(this, "language")}
                name="language"
                value={form_data.language}
              >
                <option value="" disabled={true} selected>
                  select language
                </option>
                {languageOpt}
              </select>
            </li>
            <li>
              <label>Page Type</label>
              <select
                as="select"
                onChange={this.handleChange.bind(this, "page_type")}
                name="page_type"
                value={form_data.page_type}
              >
                <option value="" disabled={true} selected>
                  select pagetype
                </option>
                {pageTypeOpt}
              </select>
            </li>
            <li className={_self.state.pageSubTypeHide ? "hidden" : ""}>
              <label>Sub Page Type</label>
              <select
                as="select"
                onChange={this.handleChange.bind(this, "page_subtype")}
                name="page_subtype"
                value={form_data.page_subtype}
              >
                <option value="" disabled={true} selected>
                  page subtype
                </option>
                {form_data.page_type == "flight-schedule" ||
                form_data.page_type == "flight-tickets"
                  ? form_data.page_type == "flight-schedule"
                    ? flightScheduleSubPagesOpt
                    : flightTicketSubpagesOpt
                  : flightBookingSubPagesOpt}
              </select>
            </li>
            <li className={this.state.sectionHide ? "hidden" : ""}>
              <label>Section</label>
              <select
                name="section"
                value={form_data.section}
                onChange={this.handleChange.bind(this, "section")}
              >
                <option value="" disabled={true} selected>
                  section
                </option>
                {sectionOpt}
              </select>
            </li>
            <li
              className={
                form_data.page_subtype == "index" || this.state.contentTypeHide
                  ? "hidden"
                  : ""
              }
            >
              <label>content type</label>
              <select
                name="content_type"
                value={form_data.content_type}
                onChange={this.handleChange.bind(this, "content_type")}
              >
                <option value="" disabled={true} selected>
                  content type
                </option>
                {contentOpt}
              </select>
            </li>
            <div className={this.state.routesHide ? "hidden" : ""}>
              <li>
                <label>Departure city</label>
                <input
                  type="text"
                  name="source"
                  placeholder="Departure city"
                  onChange={this.handleChange.bind(this, "source")}
                />
              </li>
              <li>
                <label>Arrival city</label>
                <input
                  type="text"
                  placeholder="Arrival city"
                  name="destination"
                  onChange={this.handleChange.bind(this, "destination")}
                />
              </li>
            </div>
            <li
              className={
                form_data.page_type == "flight-booking" &&
                form_data.page_subtype == "airline-route"
                  ? ""
                  : "hidden"
              }
            >
              <label>Airline Name</label>
              <input
                type="text"
                placeholder="Airline Name"
                name="airline_name"
                onChange={this.handleChange.bind(this, "airline_name")}
              />
            </li>
          </ul>
        </div>

        <div className={_self.state.showEmptymsg ? "hidden" : ""}>
          <p>No data found please create it</p>
          <button type="button" onClick={this.createRouteInfo.bind(this)}>
            create
          </button>
        </div>
        {_self.state.results.length > 0 ? (
          <TableData formData={_self.state.results} />
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default FlightScheduleRevamp;
