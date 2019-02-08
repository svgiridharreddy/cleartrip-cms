import React, { PureComponent } from "react";
import { Button, Form, Col, ButtonToolbar } from "react-bootstrap";
import axios from "axios";
import "../Banner.css";
import FlightsTable from "./FlightsTable";
const pageTypes = [
  "Select Page Type",
  "flight-booking",
  "flight-schedule",
  "flight-tickets"
];
const languages = ["Select language", "en", "ar"];
const domains = {
  selectCountry: "Select Country",
  IN: "India",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  KW: "Kuwait",
  OM: "Oman",
  QA: "Qatar",
  BH: "Bahrain"
};
class FlightsHomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      result: {
        "flight-booking": { overview: [], routes: [], pnr: [], webcheckin: [] },
        "flight-schedule": { routes: [], from: [], to: [] },
        "flight-tickets": { tickets: [] }
      },
      pageType: "",
      domain: "",
      language: "",
      subType: "",
      message: "",
      renderTables: false
    };
  }
  handleChange = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      pageType: nextProps.pageType,
      domain: nextProps.domain,
      language: nextProps.language,
      subType: nextProps.subType
    });
  }

  componentWillMount = () => {
    const { result, pageType, subType, domain, language } = this.state;

    var url = "http://localhost:3000/fetch_details";
    var parameters = {
      page_type: pageType,
      domain: domain,
      sub_type: subType,
      language: language
    };

    if (pageType.length > 0 && subType.length > 0) {
      axios
        .get(url, { params: { args: parameters } })
        .then(response => {
          //handle success
          debugger;
          if (
            typeof response.data.result[pageType][subType] !== "undefined" &&
            response.data.result[pageType][subType].length > 0
          ) {
            result[pageType][subType] = response.data.result[pageType][subType];
            this.setState({ result: result, renderTables: true });
          } else {
            this.setState({
              message: (
                <div>
                  <h4>
                    "No results found with your search. Click Add button to
                    create one "
                  </h4>
                </div>
              )
            });
          }
        })
        .catch(response => {
          this.setState({ renderTables: false });
        });
    }
  };
  handleDelete = (index, id) => {
    var url = "http://localhost:3000/delete_data";
    axios
      .delete(url, {
        data: {
          id: id,
          page_type: this.state.pageType,
          page_subtype: this.state.subType
        }
      })
      .then(response => {
        const result = { ...this.state.result };
        const { pageType, subType } = this.state;
        const values = result[pageType][subType];
        if (index !== -1) {
          values.splice(index, 1);
          result[pageType][subType] = values;
          this.setState({ result });
        }
      })
      .catch(error => console.log(error));
  };
  handleAdd = () => {
    window.location.href = "/flights";
  };

  handleGetInfo = () => {
    this.componentWillMount();
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
  render() {
    const { result, pageType, subType, domain, language } = this.state;
    let subTypes = [];
    let tableFields = {};
    let tableTitle = {
      Domain: "domain",
      Langugage: "language",
      "Page Type": "page_type",
      "Sub Page Type": "page_subtype",
      URL: "url"
    };
    if (pageType === "flight-booking") {
      subTypes = ["overview", "routes", "pnr", "web-checkin", "index"];
      tableFields = {
        overview: { AirlineName: "airline_name" },
        routes: {
          AirlineName: "airline_name",
          source: "url",
          destination: "url"
        }
      };
    } else if (pageType === "flight-schedule") {
      subTypes = ["routes", "from", "to", "index"];
      tableFields = {
        from: { "From City": "city_name", Url: "url" },
        to: { "To City": "city_name", Url: "url" },
        routes: { source: "source", destination: "destination" }
      };
    } else if (pageType === "flight-tickets") {
      subTypes = ["routes", "index"];
      tableFields = {
        routes: { source: "source", destination: "destination" }
      };
    }

    return (
      <div>
        <Form>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Select Country</Form.Label>
              <Form.Control
                as="select"
                onChange={e => this.handleChange(e, "domain")}
                name="domain"
                value={this.state.domain}
              >
                {Object.keys(domains).map(option => (
                  <option key={option} value={option}>
                    {domains[option]}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Select language</Form.Label>
              <Form.Control
                as="select"
                onChange={e => this.handleChange(e, "language")}
                name="language"
                value={this.state.language}
              >
                {this.returnOptions(languages)}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label> Page type</Form.Label>
              <Form.Control
                as="select"
                onChange={e => this.handleChange(e, "pageType")}
                name="pageType"
                value={this.state.pageType}
              >
                {this.returnOptions(pageTypes)}
              </Form.Control>
            </Form.Group>
            <Form.Group
              as={Col}
              className={this.state.subType.length >= 0 ? "" : "hidden"}
            >
              <Form.Label> Page Subtype</Form.Label>
              <Form.Control
                as="select"
                onChange={e => this.handleChange(e, "subType")}
                name="subType"
                value={this.state.subType}
              >
                <option key="select sub pagetype" value="Select sub pagetype">
                  select sub pagetype
                </option>
                {this.returnOptions(subTypes)}
              </Form.Control>
            </Form.Group>
          </Form.Row>
          <ButtonToolbar>
            <Button variant="info" onClick={this.handleGetInfo}>
              Get Info
            </Button>
          </ButtonToolbar>
        </Form>
        {/* <ButtonToolbar>
          <Button variant="primary">Add</Button>
        </ButtonToolbar> */}
        {this.state.renderTables ? (
          <FlightsTable
            domain={domain}
            language={language}
            response={result}
            pageType={pageType}
            subType={subType}
            handleDelete={this.handleDelete.bind(this)}
            tableFields={tableFields}
            tableTitle={tableTitle}
          />
        ) : (
          this.state.message
        )}
      </div>
    );
  }
}

export default FlightsHomePage;
