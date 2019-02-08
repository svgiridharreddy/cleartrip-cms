import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Col } from "react-bootstrap";
import axios from "axios";
import "../Banner.css";
class FlightSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form_data: {
        country_code: "",
        language: "",
        page_type: "",
        page_subtype: "",
        section: "",
        from_city: "",
        to_city: "",
        content_type: "",
        airline_name: ""
      },
      routesHide: true
    };
    this.optReturn = this.optReturn.bind(this);
    this.countryRtn = this.countryRtn.bind(this);
  }
  handleChange(field, e) {
    let _self = this;
    let form_data = _self.state.form_data;
    form_data[field] = e.target.value;
    _self.setState({
      form_data
    });
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
  render() {
    let _self = this;
    let form_data = _self.state.form_data;
    let country_codes = [
      { name: "India", code: "in" },
      { name: "Qatar", code: "qa" },
      { name: "Arab Emirates", code: "ae" },
      { name: "Kuwait", code: "kw" },
      { name: "Saudi Arabia", code: "sa" },
      { name: "Bahrain", code: "bh" },
      { name: "Oman", code: "om" }
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
    let sections = ["domestic", "international"];
    let contentTypeOpt = ["unique", "templetized"];
    let countryOpt = this.countryRtn(country_codes);
    let languageOpt = this.countryRtn(languages);
    let pageTypeOpt = this.countryRtn(pageType);
    let flightScheduleSubPagesOpt = this.optReturn(flightScheduleSubPages);
    let flightBookingSubPagesOpt = this.optReturn(flightBookingSubPages);
    let flightTicketSubpagesOpt = this.optReturn(flightTicketSubpages);
    let sectionOpt = this.optReturn(sections);
    let contentOpt = this.optReturn(contentTypeOpt);
    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Select Country</Form.Label>
              <Form.Control
                as="select"
                onChange={this.handleChange.bind(this, "country_code")}
                name="country_code"
                value={form_data.country_code}
              >
                <option>select country</option>
                {countryOpt}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Select language</Form.Label>
              <Form.Control
                as="select"
                onChange={this.handleChange.bind(this, "language")}
                name="language"
                value={form_data.language}
              >
                <option>select language</option>
                {languageOpt}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label> Page type</Form.Label>
              <Form.Control
                as="select"
                onChange={this.handleChange.bind(this, "page_type")}
                name="page_type"
              >
                <option>select pagetype</option>
                {pageTypeOpt}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label> Page Subtype</Form.Label>
              <Form.Control
                as="select"
                onChange={this.handleChange.bind(this, "page_subtype")}
                name="page_subtype"
              >
                {form_data.page_type == "flight-schedule" ||
                form_data.page_type == "flight-tickets"
                  ? form_data.page_type == "flight-schedule"
                    ? flightScheduleSubPagesOpt
                    : flightTicketSubpagesOpt
                  : flightBookingSubPagesOpt}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Section</Form.Label>
              <Form.Control
                as="select"
                name="section"
                value={form_data.section}
                onChange={this.handleChange.bind(this, "section")}
              >
                <option>section</option>
                {sectionOpt}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>content type</Form.Label>
              <Form.Control
                as="select"
                name="content_type"
                value={form_data.content_type}
                onChange={this.handleChange.bind(this, "content_type")}
              >
                {contentOpt}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row className={_self.state.routesHide ? "hidden" : ""}>
            <Form.Group as={Col}>
              <Form.Label>Departure city</Form.Label>
              <Form.Control
                type="textbox"
                name="from_city"
                onChange={this.handleChange.bind(this, "from_city")}
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Arrival city</Form.Label>
              <Form.Control
                type="textbox"
                name="to_city"
                onChange={this.handleChange.bind(this, "to_city")}
              />
            </Form.Group>
          </Form.Row>
          <Form.Row
            className={
              form_data.page_type == "flight-booking" &&
              form_data.page_subtype == "airline-route"
                ? ""
                : "hidden"
            }
          >
            <Form.Group as={Col}>
              <Form.Label>Airline Name</Form.Label>
              <Form.Control as="textbox" name="airline_name" />
            </Form.Group>
          </Form.Row>
        </Form>
        {JSON.stringify(this.state.form_data)}
      </div>
    );
  }
}
export default FlightSchedule;
