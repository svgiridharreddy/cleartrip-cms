import React, { PureComponent } from "react";
import { Button, Form, Col, ButtonToolbar } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import FlightsTable from "./FlightsTable";
import Select1 from "react-select";
import MetaFields from "./MetaFields";
import RichTextEditor from "react-rte";
import "./css/Flights.css";
import "../../../node_modules/react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
const pageTypes = ["flight-booking", "flight-schedule", "flight-tickets"];
const languages = ["en", "ar"];
const domains = {
  IN: "India",
  AE: "United Arab Emirates",
  SA: "Saudi Arabia",
  KW: "Kuwait",
  OM: "Oman",
  QA: "Qatar",
  BH: "Bahrain"
};
const sections = ["domestic", "international"];
class FlightsHomePage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      result: {
        "flight-booking": {
          overview: [],
          routes: [],
          pnr: [],
          webcheckin: []
        },
        "flight-schedule": { routes: [], from: [], to: [] },
        "flight-tickets": { tickets: [] },
        common: []
      },
      pageType: "",
      domain: "",
      language: "",
      subType: "",
      message: "",
      renderTables: false,
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
      routesHide: true,
      sectionHide: true,
      pageSubTypeHide: true,
      contentTypeHide: true,
      section: "",
      categoryType: "",
      cityNameSelected: "",
      depCityNameSelected: "",
      arrCityNameSelected: "",
      arrCityName: "",
      depCityName: "",
      options: [],
      options_dep: [],
      options_arr: [],
      showAddButton: true,
      airlineNameSelected: "",
      airlineName: "",
      title: "",
      description: "",
      keywords: "",
      content: "",
      h1Tag: "",
      showComponent: false
    };
  }

  handleFormSubmit = e => {
    e.preventDefault();

    const flightValues = this.state;

    let postData = {
      flights_data: {
        domain: flightValues["domain"],
        language: flightValues["language"],
        page_type: flightValues["pageType"],
        page_subtype: flightValues["subType"],
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
        if (response["data"].status == 200) {
          NotificationManager.success(response["data"].message, "", 1500);
        }
        console.log(response);

        this.fetchDetails();
      })
      .catch(response => {
        this.setState({ isHomePage: false });
      });
  };
  handleMetaChanges = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value });
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

  handleChange = (e, fieldName) => {
    if (fieldName === "section") {
      this.setState(
        { [fieldName]: e.target.value },
        this.state.categoryType != "" || this.state.subType === "index"
          ? () => this.fetchDetails()
          : null
      );
    } else if (fieldName === "pageType") {
      this.setState(
        {
          [fieldName]: e.target.value,
          subType: "",
          categoryType: "",
          section: "",
          depCityName: "",
          arrCityName: "",
          airlineName: "",
          depCityNameSelected: "",
          arrCityNameSelected: "",
          airlineNameSelected: "",
          message: "",
          showAddButton: true
        },
        () => this.fetchDetails()
      );
    } else if (fieldName === "subType") {
      this.setState(
        {
          [fieldName]: e.target.value,
          depCityName: "",
          arrCityName: "",
          airlineName: "",
          depCityNameSelected: "",
          arrCityNameSelected: "",
          airlineNameSelected: "",
          airlineName: "",
          message: "",
          showAddButton: true
        },
        e.target.value !== "index" &&
          this.state.section != "" &&
          this.state.categoryType != ""
          ? () => this.fetchDetails()
          : null
      );
    } else if (fieldName === "airlineName") {
      this.setState(
        {
          [fieldName]: e.target.value,
          depCityName: "",
          arrCityName: "",
          depCityNameSelected: "",
          arrCityNameSelected: "",
          message: "",
          showAddButton: true
        },
        () => this.fetchDetails()
      );
    } else if (fieldName === "categoryType") {
      this.setState(
        {
          [fieldName]: e.target.value,
          message: "",
          showAddButton: true
        },
        () => this.fetchDetails()
      );
    } else if ([fieldName] == "rte") {
      this.handleRTEchange(e);
    } else {
      this.setState({ [fieldName]: e.target.value }, () => this.fetchDetails());
    }
  };

  fetchDetails = () => {
    const {
      result,
      pageType,
      subType,
      domain,
      language,
      section,
      categoryType,
      options,
      cityNameSelected,
      depCityNameSelected,
      arrCityNameSelected,
      airlineName,
      depCityName,
      arrCityName,
      options_arr,
      options_dep
    } = this.state;
    var url = "http://localhost:3000/fetch_details";

    // var url = "http://localhost:3000/fetch_details";

    var parameters = {
      page_type: pageType,
      domain: domain,
      sub_type: subType,
      language: language,
      section: section,
      category: categoryType,
      dep_city_name: depCityName,
      arr_city_name: arrCityName,
      city_name: cityNameSelected.value,
      airline_name: airlineName
    };

    if (
      (pageType != "" && subType != "" && categoryType != "") ||
      (pageType != "" && subType === "index")
    ) {
      axios
        .get(url, { params: { args: parameters } })
        .then(response => {
          this.setState({
            renderTables: false,
            showAddButton: false,
            showComponent: false
          });
          if (
            categoryType === "uniq" &&
            typeof response.data.result[pageType][subType] !== "undefined" &&
            response.data.result[pageType][subType].length > 0
          ) {
            result[pageType][subType] = response.data.result[pageType][subType];
            this.setState({
              result: result,
              renderTables: true,
              showAddButton: false,
              showComponent: false
            });
          } else if (
            (categoryType === "common" || subType === "index") &&
            typeof response.data.result["common"] !== "undefined" &&
            response.data.result["common"].length > 0
          ) {
            result["common"] = response.data.result["common"];
            this.setState({
              result: result,
              renderTables: true,
              showAddButton: false
            });
          } else {
            NotificationManager.error(
              "No record found",
              "Please try again",
              1500
            );
            this.setState({
              showAddButton: false,
              showComponent: false,
              renderTables: false
            });
          }
        })
        .catch(response => {
          this.setState({ renderTables: false, showAddButton: true });
        });
    }
  };
  handleDelete = (index, id) => {
    var result = window.confirm("Want to delete?");
    if (result) {
      var url = "http://localhost:3000/delete_data";
      axios
        .delete(url, {
          data: {
            id: id,
            page_type: this.state.pageType,
            page_subtype: this.state.subType,
            category: this.state.categoryType
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
          NotificationManager.warning(response.data.message, "", 1500);
        })
        .catch(error => {
          console.log(error);
          NotificationManager.error(error, "Something went wrong", 1500);
        });
    }
  };
  handleAdd = () => {
    this.setState({
      showComponent: true,
      message: "",
      showAddButton: false
    });
  };

  handleEdit = idx => {
    debugger;
    let { result, pageType, subType, categoryType } = this.state;
    if (categoryType === "common" || subType === "index") {
      this.setState({
        renderTables: false,
        showComponent: true,
        message: "",
        showAddButton: false,
        title: result["common"][idx]["title"],
        description: result["common"][idx]["description"],
        content: result["common"][idx]["content"]
      });
    } else {
      this.setState({
        renderTables: false,
        showComponent: true,
        message: "",
        showAddButton: false,
        title: result[pageType][subType][idx]["title"],
        description: result[pageType][subType][idx]["description"],
        content: result[pageType][subType][idx]["content"]
      });
    }
  };

  handleGetInfo = () => {
    if (
      (this.state.pageType === "flight-schedule" ||
        this.state.pageType === "flight-booking" ||
        this.state.pageType === "flight-tickets") &&
      this.state.categoryType == "uniq" &&
      this.state.domain != ""
    ) {
      this.fetchDetails();
    } else if (
      this.state.categoryType == "common" ||
      this.state.subType === "index"
    ) {
      this.fetchDetails();
    }
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
            this.setState({ options: response.data }, () =>
              this.fetchDetails()
            );
          } else if (fieldName === "depCityName") {
            this.setState({ options_dep: response.data });
          } else if (fieldName === "arrCityName") {
            this.setState({ options_arr: response.data });
          } else if (fieldName === "cityName") {
            this.setState({ options: response.data }, () =>
              this.fetchDetails()
            );
          }
        })
        .then(response => {
          console.log();
        });
      console.log(`Option selected:`, target_value);
    }
  };

  handleSelectedInput = (p, fieldName) => {
    if (fieldName === "airlineName") {
      debugger;
      this.setState(
        {
          airlineNameSelected: p,
          airlineName: p.value,
          domain: this.state.domain,
          language: this.state.language,
          pageType: this.state.pageType,
          subType: this.state.subType,
          categoryType: this.state.categoryType
        },
        () => this.fetchDetails()
      );
    } else if (fieldName === "depCityName") {
      this.setState({ depCityNameSelected: p, depCityName: p.value }, () =>
        this.fetchDetails()
      );
    } else if (fieldName === "arrCityName") {
      debugger;
      this.setState(
        {
          domain: this.state.domain,
          language: this.state.language,
          pageType: this.state.pageType,
          subType: this.state.subType,
          categoryType: this.state.categoryType,
          arrCityNameSelected: p,
          arrCityName: p.value
        },
        () => this.fetchDetails()
      );
    } else if (fieldName === "cityName") {
      this.setState(
        {
          cityNameSelected: p,
          cityName: p.value,
          domain: this.state.domain,
          language: this.state.language,
          pageType: this.state.pageType,
          subType: this.state.subType,
          categoryType: this.state.categoryType
        },
        () => this.fetchDetails()
      );
    }
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
    const {
      result,
      pageType,
      subType,
      domain,
      language,
      categoryType,
      options,
      cityNameSelected,
      depCityNameSelected,
      arrCityNameSelected,
      airlineName,
      depCityName,
      arrCityName,
      options_arr,
      options_dep,
      renderTables
    } = this.state;
    let category;
    let checkfields;
    let subTypes = [];
    let tableFields = {};
    let checkResult;
    let tableTitle = {
      Domain: "domain",
      Langugage: "language",
      Section: "section",
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
    if (
      subType === "routes" ||
      subType === "overview" ||
      subType === "from" ||
      subType === "to" ||
      subType === "pnr" ||
      subType === "web-checkin"
    ) {
      category = (
        <li>
          <label>Category</label>
          <select
            value={this.state.categoryType}
            onChange={e => this.handleChange(e, "categoryType")}
            name="categoryType"
          >
            <option>Select Category</option>
            <option value="uniq">Unique</option>
            <option value="common">Common</option>
          </select>
        </li>
      );
    }
    if (pageType === "flight-booking") {
      if (
        categoryType === "uniq" &&
        (subType === "overview" ||
          subType === "pnr" ||
          subType === "web-checkin" ||
          subType === "routes")
      ) {
        checkfields = (
          <li>
            <label>Airline Name</label>
            <Select1
              value={this.state.airlineNameSelected}
              onChange={p => this.handleSelectedInput(p, "airlineName")}
              options={options}
              name="airlineName"
              required
              placeholder="Search  Airline"
              onInputChange={e => this.handleAutoSearch(e, "airlineName")}
            />
          </li>
        );
      }
    } else if (pageType === "flight-schedule") {
      if (categoryType === "uniq" && (subType === "from" || subType === "to")) {
        checkfields = (
          <li>
            <label>City Name</label>
            <Select1
              // isDisabled = {readOnlyValue}
              value={cityNameSelected}
              onChange={p => this.handleSelectedInput(p, "cityName")}
              options={options}
              name="cityName"
              required
              placeholder="Search  City"
              // onInputChange={this.handleAirlineSearch}
              onInputChange={e => this.handleAutoSearch(e, "cityName")}
            />
          </li>
        );
      }
    }

    return (
      <div className="top-wrapper">
        <div className="filter-fileds">
          <ul className="list-inline">
            <li>
              <label>Country</label>
              <select
                onChange={e => this.handleChange(e, "domain")}
                name="domain"
                value={this.state.domain}
              >
                <option value="" disabled={true} selected>
                  Domain
                </option>
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
                name="language"
                value={this.state.language}
              >
                <option value="" disabled={true} selected>
                  Language
                </option>
                {this.returnOptions(languages)}}
              </select>
            </li>
            <li>
              <label>Page Type</label>
              <select
                onChange={e => this.handleChange(e, "pageType")}
                name="pageType"
                value={this.state.pageType}
              >
                <option value="" disabled={true} selected>
                  Page type
                </option>
                {this.returnOptions(pageTypes)}
              </select>
            </li>

            <li className={this.state.subType.length >= 0 ? "" : "hidden"}>
              <label>Page Subtype</label>
              <select
                onChange={e => this.handleChange(e, "subType")}
                name="subType"
                value={this.state.subType}
              >
                <option value="" disabled={true} selected>
                  page sub_type
                </option>
                {this.returnOptions(subTypes)}
              </select>
            </li>

            <li>
              <label>Section</label>
              <select
                name="section"
                value={this.state.section}
                onChange={e => this.handleChange(e, "section")}
              >
                {" "}
                <option value="" disabled={true} selected>
                  section
                </option>
                {this.returnOptions(sections)}
              </select>
            </li>
            {category}
            {/* {categoryType === "common" || subType === "index" ? (
              <li>
                <label>Section</label>
                <select
                  name="section"
                  value={this.state.section}
                  onChange={e => this.handleChange(e, "section")}
                >
                  {" "}
                  <option value="" disabled={true} selected>
                    section
                  </option>
                  {this.returnOptions(sections)}
                </select>
              </li>
            ) : null} */}

            {checkfields}

            {categoryType === "uniq" &&
            subType === "routes" &&
            (pageType === "flight-booking" ||
              pageType === "flight-schedule" ||
              pageType === "flight-tickets") ? (
              <ul>
                <li>
                  <label>Dep City Name</label>
                  <Select1
                    // isDisabled = {readOnlyValue}
                    value={depCityNameSelected}
                    onChange={p => this.handleSelectedInput(p, "depCityName")}
                    options={options_dep}
                    name="depCityName"
                    required
                    placeholder="Search Departure City"
                    // onInputChange={this.handleAirlineSearch}
                    onInputChange={e => this.handleAutoSearch(e, "depCityName")}
                  />
                </li>
                <li>
                  <label>Arr City Name</label>
                  <Select1
                    // isDisabled = {readOnlyValue}
                    value={arrCityNameSelected}
                    onChange={p => this.handleSelectedInput(p, "arrCityName")}
                    options={options_arr}
                    name="arrCityName"
                    placeholder="Search Arrival City"
                    required
                    // onInputChange={this.handleAirlineSearch}
                    onInputChange={e => this.handleAutoSearch(e, "arrCityName")}
                  />
                </li>
              </ul>
            ) : null}
          </ul>
        </div>

        {this.state.renderTables ? (
          <FlightsTable
            renderTables={renderTables}
            domain={domain}
            language={language}
            response={result}
            pageType={pageType}
            subType={subType}
            categoryType={categoryType}
            handleDelete={this.handleDelete.bind(this)}
            tableFields={tableFields}
            tableTitle={tableTitle}
            handleEdit={this.handleEdit.bind(this)}
          />
        ) : (
          <div className={this.state.showAddButton ? "hidden" : ""}>
            {this.state.message}
            {this.state.showComponent ? null : (
              <button
                type="button"
                data-method="create"
                onClick={this.handleAdd}
              >
                Add New
              </button>
            )}

            {this.state.showComponent ? (
              <MetaFields
                handleMetaChanges={(e, fieldName) =>
                  this.handleMetaChanges(e, fieldName)
                }
                handleFormSubmit={this.handleFormSubmit}
                pageType={this.state.pageType}
                title={this.state.title}
                description={this.state.description}
                content={this.state.content}
                keywords={this.state.keywords}
                h1Tag={this.state.h1Tag}
                handleRTEchange={content => this.handleRTEchange(content)}
                handleChange={(e, fieldName) => this.handleChange(e, fieldName)}
              />
            ) : null}
          </div>
        )}
        <NotificationContainer />
      </div>
    );
  }
}

export default withRouter(FlightsHomePage);
