import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Select1 from "react-select";
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
        airline_name: "",
        keywords:""
      },
      routesHide: true,
      sectionHide: true,
      pageSubTypeHide: true,
      contentTypeHide: true,
      from_cities_list: [],
      to_cities_list: [],
      results: [],
      showEmptymsg: true,
      options_dep: [],
      options_arr: [],
      sourcedOption: null,
      destinationdOption: null
    };
    this.optReturn = this.optReturn.bind(this);
    this.countryRtn = this.countryRtn.bind(this);
    this.createRouteInfo = this.createRouteInfo.bind(this);
    this.fetchFlightsData = this.fetchFlightsData.bind(this);
  }

  fetchFlightsData(form_data) {
    let hitAPI = false;
    if (
      form_data["domain"] !== "" &&
      form_data["language"] !== "" &&
      form_data["page_type"] !== "" &&
      form_data["section"] !== "" &&
      form_data["page_subtype"] !== ""
    ) {
      this.setState({
        results: []
      });
      if (form_data["page_subtype"] == "index") {
        hitAPI = true;
      } else if (
        form_data["page_subtype"] == "routes" &&
        form_data["content_type"] !== ""
      ) {
        if (form_data["content_type"] === "uniq") {
          // if (form_data["source"] !== "" && form_data["destination"] !== "") {
            hitAPI = true;
          // }
        } else {
          hitAPI = true;
        }
      }
      if (form_data["page_type"] === "flight-schedule") {
        delete form_data["airline_name"];
      }
      if (hitAPI) {
        axios
          .get("http://localhost:3000/get_flights_data", {
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
                showEmptymsg: false,
                results: []
              });
            }
          });
      }
    }
  }
  handleChange(field, e) {
    let _self = this;
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
       this.fetchFlightsData(form_data)
    }
    if (e.target.name == "content_type") {
      let form_json = {
        destination: "",
        source: ""
      };
      let autoComplete={
      options_dep: [],
      options_arr: [],
      sourcedOption: null,
      destinationdOption: null
      }
      this.setState({
        autoComplete
      })
      Object.keys(form_json).map(form => (form_data[form] = ""));
      this.setState({
        form_data
      });
      this.setState({
        routesHide: e.target.value == "uniq" ? false : true
      });
    }
    this.fetchFlightsData(form_data); //calling api data
    // Flight schedule flow ending

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

  createRouteInfo() {
    axios({
      method: "post",
      url: "http://localhost:3000/get_flights_data",
      data: this.state.form_data
    }).then(response => {
      debugger;
      this.setState({
        results: response.data,
        showEmptymsg: true
      });
    });
  }

  handleSelectedInput(p, fieldName) {
    let _self = this;
    let form_data = _self.state;
    form_data = _self.state.form_data;
    if (fieldName === "airlineName") {
      this.setState({ selectedOption: p, airlineName: p.value });
    } else if (fieldName === "source") {
      this.setState({ sourcedOption: p });
      form_data["source"] = p.value;
      _self.setState({ form_data });
    } else if (fieldName === "destination") {
      this.setState({ destinationdOption: p });
      form_data["destination"] = p.value;
      _self.setState({ form_data });
    } else if (fieldName === "cityName") {
      this.setState({ cityNameSelected: p, cityName: p.value });
    }
    if (form_data["source"] !== "" && form_data["destination"] !== "") {
      this.fetchFlightsData(form_data);
    }
  }

  handleAutoSearch(e, fieldName) {
    let _self = this;
    let target_value = e;
    if (target_value !== "" && target_value.length >= 3) {
      let url = "";
      if (fieldName === "airlineName") {
        url = "http://localhost:3000/airline_autocomplete";
      } else {
        url = "http://localhost:3000/city_autocomplete_revamp";
      }
      axios
        .get(url, { params: { query_term: target_value } })
        .then(response => {
          if (fieldName === "airlineName") {
            _self.setState({ options: response.data });
          } else if (fieldName === "source") {
            _self.setState({ options_dep: response.data });
          } else if (fieldName === "destination") {
            _self.setState({ options_arr: response.data });
          } else if (fieldName === "cityName") {
            _self.setState({ options: response.data });
          }
        })
        .then(response => {
        });
    }
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
                <Select1
                  value={_self.state.sourcedOption}
                  onChange={p => this.handleSelectedInput(p, "source")}
                  options={_self.state.options_dep}
                  onInputChange={e => this.handleAutoSearch(e, "source")}
                />
              </li>
              <li>
                <label>Arrival city</label>
                <Select1
                  value={_self.state.destinationdOption}
                  onChange={p => this.handleSelectedInput(p, "destination")}
                  options={_self.state.options_arr}
                  onInputChange={e => this.handleAutoSearch(e, "destination")}
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
          <button
            type="button"
            onClick={this.createRouteInfo.bind(this)}
            className="button"
          >
            create
          </button>
          <span>No record found</span>
        </div>
        {_self.state.results.length > 0 ? (
          <TableData
            formData={_self.state.results}
            className={_self.state.results.length > 0 ? "" : "hidden"}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default FlightScheduleRevamp;
