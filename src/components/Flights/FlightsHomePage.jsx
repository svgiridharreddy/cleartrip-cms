import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import FlightsTable from "./FlightsTable";
import Select1 from "react-select";
import MetaFields from "./MetaFields";
import "./css/Flights.css";
import "../../../node_modules/react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import { host } from "../helper";
import loginHelpers from "../helper";

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
          "web-checkin": []
        },
        "flight-schedule": {
          routes: [],
          from: [],
          to: [],
          pnr: [],
          "web-checkin": []
        },
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
      showComponent: false,
      source: "",
      destination: "",
      brandName: "",
      fromToCity: "",
      editClicked: false,
      host: host(),
      backBtnClicked:false
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleMetaChanges = this.handleMetaChanges.bind(this);
    this.handleRTEchange = this.handleRTEchange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchDetails = this.fetchDetails.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleAutoSearch = this.handleAutoSearch.bind(this);
    this.handleSelectedInput = this.handleSelectedInput.bind(this);
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
        section: flightValues["section"],
        title: flightValues["title"],
        description: flightValues["description"],
        keywords: flightValues["keywords"],
        content: flightValues["content"].toString("html"),
        h1_title: flightValues["h1Tag"],
        airline_name:
          flightValues["airlineName"] && flightValues["airlineName"] != ""
            ? flightValues["airlineName"]
            : this.state.brandName,
        city_name:
          flightValues["cityNameSelected"] &&
          flightValues["cityNameSelected"]["value"]
            ? flightValues["cityNameSelected"]["value"]
            : this.state.fromToCity,
        dep_city_name:
          flightValues["depCityNameSelected"] &&
          flightValues["depCityNameSelected"]["value"]
            ? flightValues["depCityNameSelected"]["value"]
            : this.state.source,
        arr_city_name:
          flightValues["arrCityNameSelected"] &&
          flightValues["arrCityNameSelected"]["value"]
            ? flightValues["arrCityNameSelected"]["value"]
            : this.state.destination,
        readOnlyValue: true
      }
    };
    axios({
      method: "post",
      url: this.state.host + "/flights",
      data: postData,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        NotificationManager.success("Approval required", "Admin Need to approve ", 2000);
        this.setState({
          editClicked: false,
          depCityName: "",
          depCityNameSelected: "",
          arrCityName: "",
          arrCityNameSelected: "",
          airlineNameSelected: "",
          cityNameSelected: "",
          cityName: "",
          airlineName: "",
          readOnlyValue: false,
          options: [],
          options_dep: [],
          options_arr: [],
          source: "",
          destination: "",
          brandName: "",
          fromToCity: "",
          options: []
        });

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
        {
          [fieldName]: e.target.value,
          cityNameSelected: "",
          cityName: "",
          airlineName: "",
          airlineNameSelected: "",
          depCityName: "",
          depCityNameSelected: "",
          arrCityName: "",
          arrCityNameSelected: "",
          renderTables: false,
          backBtnClicked:false
        },
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
          showAddButton: true,
          renderTables: false,
          backBtnClicked:false
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
          categoryType: "",
          showAddButton: true,
          renderTables: false,
          backBtnClicked:false
        },

        this.state.section != "" && this.state.categoryType != ""
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
          showAddButton: true,
          backBtnClicked:false
        },
        () => this.fetchDetails()
      );
    } else if (fieldName === "categoryType") {
      this.setState(
        {
          [fieldName]: e.target.value,
          message: "",
          showAddButton: true,
          renderTables: false,
          backBtnClicked:false
        },
        () => this.fetchDetails()
      );
    } else if ([fieldName] == "rte") {
      this.handleRTEchange(e);
    } else {
      this.setState({ [fieldName]: e.target.value, categoryType: "" }, () =>
        this.fetchDetails()
      );
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
      options_dep,
      source,
      destination,
      brandName,
      fromToCity,
      backBtnClicked
    } = this.state;
    var url = this.state.host + "/fetch_details";

    var parameters = {
      page_type: pageType,
      domain: domain,
      sub_type: subType,
      language: language,
      section: section,
      category: categoryType,
      dep_city_name: depCityName ? depCityName : source,
      arr_city_name: arrCityName ? arrCityName : destination,
      city_name:
        cityNameSelected && cityNameSelected.value
          ? cityNameSelected.value
          : fromToCity,
      airline_name: airlineName ? airlineName : brandName
    };
    if(backBtnClicked){
      parameters["airline_name"] =""
      parameters["dep_city_name"] =""
      parameters["arr_city_name"]=""
      parameters["city_name"]=""
      this.setState({
        backBtnClicked: false
      })
    }
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
            if (this.state.editClicked) {
              this.setState({
                result: result,
                renderTables: true,
                showAddButton: false,
                showComponent: false
              });
            } else {
              this.setState({
                result: result,
                renderTables: true,
                showAddButton: false,
                showComponent: false,
                depCityNameSelected: this.state.depCityNameSelected
                  ? this.state.depCityNameSelected
                  : this.state.source,
                arrCityNameSelected: this.state.arrCityNameSelected
                  ? this.state.arrCityNameSelected
                  : this.state.destination,
                depCityName: this.state.depCityName
                  ? depCityName
                  : this.state.source,
                arrCityName: this.state.arrCityName
                  ? this.state.arrCityName
                  : this.state.destination,
                airlineName: this.state.airlineName
                  ? this.state.airlineName
                  : this.state.brandName,
                airlineNameSelected: this.state.airlineNameSelected
                  ? this.state.airlineNameSelected
                  : this.state.brandName,
                cityNameSelected: this.state.cityNameSelected
                  ? this.state.cityNameSelected
                  : this.state.fromToCity
                // brandName: this.state.airlineNameSelected ? this.state.airlineNameSelected: ""
              });
            }
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
              2000
            );
            this.setState({
              showAddButton: false,
              showComponent: false,
              renderTables: false,
              title: "",
              description: "",
              content: "",
              h1Tag: "",
              keyword: ""
            });
          }
        })
        .catch(response => {
          this.setState({ renderTables: false, showAddButton: true });
        });
    }
  };

  handleDelete = (index, id) => {
    let _self = this;
    var result = window.confirm("Want to delete?");
    if (result) {
      var url = this.state.host + "/delete_data";
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
          const { pageType, subType, categoryType } = this.state;
          const values =
            categoryType === "uniq"
              ? result[pageType][subType]
              : result["common"];
          if (index !== -1) {
            values.splice(index, 1);
            result[pageType][subType] = values;
            this.setState({ result });
          }
          NotificationManager.warning(response.data.message, "", 2000);
        })
        .catch(error => {
          console.log(error);
          NotificationManager.error(error, "Something went wrong", 2000);
        });
    }
  };
  handleAdd = () => {
    this.setState({
      showComponent: true,
      message: "",
      showAddButton: false,
      title: "",
      description: "",
      keywords: "",
      content: "",
      h1Tag: ""
    });
  };

  backBtnFun = () =>{
    debugger
    let _self =this
    setTimeout(function(){
    _self.setState({
      showComponent:false,
      renderTables: true,
      editClicked:false,
      readOnlyValue:false,
      backBtnClicked:true,
      source:"",
      depCityName:"",
      cityNameSelected: "",
      cityName: "",
      airlineName: "",
      airlineNameSelected: "",
      depCityName: "",
      depCityNameSelected: "",
      arrCityName: "",
      arrCityNameSelected: ""
    })
  },150)
    setTimeout(function(){
      _self.fetchDetails()
    },300)
  }

  handleEdit = idx => {
    let { result, pageType, subType, categoryType } = this.state;
    if (categoryType === "common" || subType === "index") {
      this.setState({
        renderTables: false,
        showComponent: true,
        message: "",
        showAddButton: false,
        title: result["common"][idx]["title"],
        description: result["common"][idx]["description"],
        keywords: result["common"][idx]["keyword"],
        content: result["common"][idx]["content"],
        h1Tag: result["common"][idx]["heading"],
        readOnlyValue: true
      });
    } else {
      this.setState({
        renderTables: false,
        showComponent: true,
        message: "",
        showAddButton: false,
        title: result[pageType][subType][idx]["title"],
        description: result[pageType][subType][idx]["description"],
        content: result[pageType][subType][idx]["content"],
        h1Tag: result[pageType][subType][idx]["heading"],
        keywords: result[pageType][subType][idx]["keyword"],
        source: result[pageType][subType][idx]["source"],
        destination: result[pageType][subType][idx]["destination"],
        fromToCity: result[pageType][subType][idx]["city_name"],
        brandName: result[pageType][subType][idx]["airline_name"],
        arrCityNameSelected:
          this.state.arrCityNameSelected != ""
            ? this.state.arrCityNameSelected
            : this.state.source,
        editClicked: true,
        readOnlyValue: true
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
    if (target_value !== "" && target_value.length >= 3) {
      let url = "";
      if (fieldName === "airlineName") {
        url = this.state.host + "/airline_autocomplete";
      } else {
        url = this.state.host + "/city_autocomplete";
      }
      axios
        .get(url, { params: { query_term: target_value } })
        .then(response => {
          if (fieldName === "airlineName") {
            this.setState({ options: response.data })
            //   , () =>
            //   this.fetchDetails()
            // );
          } else if (fieldName === "depCityName") {
            this.setState({ options_dep: response.data });
          } else if (fieldName === "arrCityName") {
            this.setState({ options_arr: response.data });
          } else if (fieldName === "cityName") {
            this.setState({ options: response.data })
            //   , () =>
            //   this.fetchDetails()
            // );
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
      this.setState(
        {
          airlineNameSelected: p,
          airlineName: p.value,
          domain: this.state.domain,
          language: this.state.language,
          pageType: this.state.pageType,
          subType: this.state.subType,
          categoryType: this.state.categoryType,
          source: p.value
        },
        () => this.fetchDetails()
      );
    } else if (fieldName === "depCityName") {
      this.setState({ depCityNameSelected: p, depCityName: p.value });
    } else if (fieldName === "arrCityName") {
      this.setState(
        {
          domain: this.state.domain,
          language: this.state.language,
          pageType: this.state.pageType,
          subType: this.state.subType,
          categoryType: this.state.categoryType,
          arrCityNameSelected: p,
          arrCityName: p.value,
          description: p.value
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
    loginHelpers.checkUser();
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
      renderTables,
      editClicked,
      source,
      destination,
      brandName,
      fromToCity
    } = this.state;
    let category;
    let checkfields;
    let subTypes = [];
    let tableFields = {};
    let checkResult;
    let tableTitle = {
      Domain: "domain",
      Language: "language",
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
          source: "source",
          destination: "destination"
        },
        pnr: { AirlineName: "airline_name" },
        "web-checkin": { AirlineName: "airline_name" }
      };
    } else if (pageType === "flight-schedule") {
      subTypes = ["routes", "from", "to", "index"];
      tableFields = {
        from: { "From City": "city_name" },
        to: { "To City": "city_name" },
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
            disabled={this.state.readOnlyValue}
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
        checkfields = !editClicked ? (
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
        ) : (
          <li>
            <label>Airline Name</label>
            <input type="text" value={this.state.brandName} disabled />
          </li>
        );
      }
    } else if (pageType === "flight-schedule") {
      if (categoryType === "uniq" && (subType === "from" || subType === "to")) {
        checkfields = !editClicked ? (
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
        ) : (
          <li>
            <label>City Name</label>
            <input type="text" value={this.state.fromToCity} disabled />
          </li>
        );
      }
    }

    return (
      <div>
        <div className="top-wrapper">
          <div className="filter-fileds">
            <ul className="list-inline">
              <li>
                <label>Country</label>
                <select
                  onChange={e => this.handleChange(e, "domain")}
                  name="domain"
                  disabled={this.state.readOnlyValue}
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
                  disabled={this.state.readOnlyValue}
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
                  disabled={this.state.readOnlyValue}
                >
                  <option value="" disabled={true} selected>
                    Page type
                  </option>
                  {this.returnOptions(pageTypes)}
                </select>
              </li>
              {domain != "" && language != "" && pageType != "" ? (
                <li className={this.state.subType.length >= 0 ? "" : "hidden"}>
                  <label>Page Subtype</label>
                  <select
                    onChange={e => this.handleChange(e, "subType")}
                    name="subType"
                    value={this.state.subType}
                    disabled={this.state.readOnlyValue}
                  >
                    <option value="" disabled={true} selected>
                      page sub_type
                    </option>
                    {this.returnOptions(subTypes)}
                  </select>
                </li>
              ) : (
                ""
              )}

              {domain != "" &&
              language != "" &&
              pageType != "" &&
              subType != "" ? (
                <li>
                  <label>Section</label>
                  <select
                    name="section"
                    value={this.state.section}
                    onChange={e => this.handleChange(e, "section")}
                    disabled={this.state.readOnlyValue}
                  >
                    {" "}
                    <option value="" disabled={true} selected>
                      section
                    </option>
                    {this.returnOptions(sections)}
                  </select>
                </li>
              ) : (
                ""
              )}

              {category}

              {checkfields}

              {categoryType === "uniq" &&
              subType === "routes" &&
              (pageType === "flight-booking" ||
                pageType === "flight-schedule" ||
                pageType === "flight-tickets") ? (
                <div>
                  <ul className={editClicked ? "hidden" : ""}>
                    <li>
                      <label>Dep City Name</label>
                      <Select1
                        // isDisabled = {readOnlyValue}
                        value={depCityNameSelected}
                        onChange={p =>
                          this.handleSelectedInput(p, "depCityName")
                        }
                        options={options_dep}
                        name="depCityName"
                        required
                        placeholder="Search Departure City"
                        // onInputChange={this.handleAirlineSearch}
                        onInputChange={e =>
                          this.handleAutoSearch(e, "depCityName")
                        }
                      />
                    </li>
                    <li>
                      <label>Arr City Name</label>
                      <Select1
                        // isDisabled = {readOnlyValue}
                        value={arrCityNameSelected}
                        onChange={p =>
                          this.handleSelectedInput(p, "arrCityName")
                        }
                        options={options_arr}
                        name="arrCityName"
                        placeholder="Search Arrival City"
                        required
                        // onInputChange={this.handleAirlineSearch}
                        onInputChange={e =>
                          this.handleAutoSearch(e, "arrCityName")
                        }
                      />
                    </li>
                  </ul>
                  <ul className={editClicked ? "" : "hidden"}>
                    <li>
                      <label>Dep City Name</label>
                      <input type="text" value={this.state.source} disabled />
                    </li>
                    <li>
                      <label>Arr City Name</label>
                      <input
                        type="text"
                        value={this.state.destination}
                        disabled
                      />
                    </li>
                  </ul>
                </div>
              ) : null}
            </ul>
            <div className="clearfix" />
          </div>
        </div>
        <div className="data-edit-section">
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
                  className="add-btn"
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
                  handleFormSubmit={this.handleFormSubmit.bind(this)}
                  pageType={this.state.pageType}
                  title={this.state.title}
                  description={this.state.description}
                  content={this.state.content}
                  keywords={this.state.keywords}
                  h1Tag={this.state.h1Tag}
                  handleRTEchange={content => this.handleRTEchange(content)}
                  backBtnFun= {this.backBtnFun.bind(this)}
                  handleChange={(e, fieldName) =>
                    this.handleChange(e, fieldName)
                  }
                />
              ) : null}
            </div>
          )}
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

export default withRouter(FlightsHomePage);
