import React, { PureComponent } from "react";
import { Button, Form, Col, ButtonToolbar } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import axios from "axios";
import FlightsTable from "./FlightsTable";
import Select1 from "react-select";
import "./css/Flights.css";
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
const sections = ["Select section", "domestic", "international"];
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
        "common": { routes: [], from:[], to:[], overview:[], routes:[], pnr:[], webcheckin:[] }
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
      showAddButton: false,
      airlineNameSelected: "",
      airlineName: ""
    };
  }

  handleChange = (e, fieldName) => {
    if (fieldName==="section") {
      this.setState({ [fieldName]: e.target.value }, () =>
        this.handleGetInfo()
      );
      debugger
    }
    else{
     this.setState({ [fieldName]: e.target.value });
    }
  };

  componentWillReceiveProps(nextProps) {
    debugger
    this.setState({
      pageType: nextProps.pageType,
      domain: nextProps.domain,
      language: nextProps.language,
      subType: nextProps.subType,
      result: nextProps.result
    });
  }

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
 
    // var url = "http://13.251.49.54:82/fetch_details";
    debugger;
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
    if (pageType.length > 0 && subType.length > 0) {
      axios
        .get(url, { params: { args: parameters } })
        .then(response => {
          //handle success
          this.setState({ renderTables: false, showAddButton: false });
          if (
            typeof response.data.result[pageType][subType] !== "undefined" &&
            response.data.result[pageType][subType].length > 0)
             {
             result[pageType][subType] = response.data.result[pageType][subType];
              this.setState({ result: result, renderTables: true, showAddButton: false });
           
          }

          else if (
            typeof response.data.result["common"] !== "undefined" &&
            response.data.result["common"].length > 0)
          {
            result["common"] = response.data.result["common"]

          }

           else {
            debugger
            this.setState({
              showAddButton: true,
              renderTables: false,
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
          this.setState({ renderTables: false, showAddButton: true });
        });
    }
  };
  handleDelete = (index, id) => {
    var url = "http://13.251.49.54:82/delete_data";
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
    let path = "/flights";
    this.props.history.push(path);
  };

  handleGetInfo = () => {
    debugger
    if (this.state.pageType === "flight-schedule" && this.state.categoryType == "Unique") {
      if (
        this.state.subType === "routes" &&
        this.state.depCityName != "" &&
        this.state.arrCityName != "" 
      ) {
        this.fetchDetails();
      } else if (
        (this.state.subType === "from" || this.state.subType === "to" && this.state.categoryType == "Unique") &&
        (this.state.cityName != "" || this.state.cityName != "undefined" && this.state.categoryType == "Unique")
      ) {
        this.fetchDetails();
      }
    } else if (this.state.pageType === "flight-booking" && this.state.categoryType == "Unique") {
      if (
        this.state.subType === "routes" &&
        this.state.depCityName != "" &&
        this.state.arrCityName != "" &&  this.state.categoryType == "Unique"
      ) {
        this.fetchDetails();
      } else if (
        (this.state.subType === "overview" ||
          this.state.subType === "pnr-status" ||
          this.state.subType === "web-checkin") &&
        (this.state.airlineName != "" || this.state.airlineName != "undefined" && this.state.categoryType == "Unique")
      ) {
        this.fetchDetails();
      }
      else if ((this.state.subType==="from" || this.state.subType==="to") && (this.state.cityName!="" || this.state.cityName!="undefined" && this.state.categoryType == "Unique")){
          this.fetchDetails();
      }
    }
    else if (this.state.categoryType==="common") {
      debugger
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
            this.setState({ options: response.data });
          } else if (fieldName === "depCityName") {
            this.setState({ options_dep: response.data });
          } else if (fieldName === "arrCityName") {
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
    if (fieldName === "airlineName") {
      this.setState({ airlineNameSelected: p, airlineName: p.value }, () =>
// <<<<<<< HEAD
//       this.setState({ selectedOption: p, airlineName: p.value },()=>this.handleGetInfo());
//     } else if (fieldName === "depCityName") {
//       this.setState({ depCityNameSelected: p, depCityName: p.value },()=>this.handleGetInfo());
//       debugger
//     } else if (fieldName === "arrCityName") {
//       this.setState({ arrCityNameSelected: p, arrCityName: p.value,domain: this.state.domain,language: this.state.lanugage,pageType: this.state.pageType,subType: this.state.subType },()=>this.handleGetInfo());
//       debugger
//     } else if (fieldName === "cityName") {
//       this.setState({ cityNameSelected: p, cityName: p.value },()=>this.handleGetInfo());
// =======
        this.handleGetInfo()
      );
    } else if (fieldName === "depCityName") {
      this.setState({ depCityNameSelected: p, depCityName: p.value }, () =>
        this.handleGetInfo()
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
        () => this.handleGetInfo()
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
        () => this.handleGetInfo()
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
      options_dep
    } = this.state;
    let category;
    let checkfields;
    let subTypes = [];
    let tableFields = {};
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
          subType === "pnr-status" ||
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
        <div>
          <ul className="list-inline">
            <li>
              <label>Country</label>
              <select
                onChange={e => this.handleChange(e, "domain")}
                name="domain"
                value={this.state.domain}
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
                name="language"
                value={this.state.language}
              >
                {this.returnOptions(languages)}
              </select>
            </li>
            <li>
              <label>Page Type</label>
              <select
                onChange={e => this.handleChange(e, "pageType")}
                name="pageType"
                value={this.state.pageType}
              >
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
                <option key="select sub pagetype" value="Select sub pagetype">
                  select sub pagetype
                </option>
                {this.returnOptions(subTypes)}
              </select>
            </li>
            

            {category}
            {categoryType==="common" ?
            <li>
              <label>Section</label>
              <select
                name="section"
                value={this.state.section}
                onChange={e => this.handleChange(e, "section")}
              >
                {this.returnOptions(sections)}
              </select>
            </li>
            :null }

            {checkfields}

            {categoryType === "uniq" && subType === "routes" ? (
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
            ) : null}
          </ul>
        </div>
        <div className={this.state.showAddButton ? "" : "hidden"}>
          <button type="button" onClick={this.handleAdd}>
            Add New{" "}
          </button>
        </div>
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

export default withRouter(FlightsHomePage);
