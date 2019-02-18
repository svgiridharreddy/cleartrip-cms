import React, { PureComponent } from "react";
import { Button, Form, Col, ButtonToolbar } from "react-bootstrap";
import axios from "axios";
import "./Banner.css";
import FlightsTable from "./FlightsTable";
import Select1 from "react-select";
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
      cityNameSelected:"",
      depCityNameSelected:"",
      arrCityNameSelected:"",
      airlineName:"",
      depCityName:"",
      arrCityName:"",
      options:[],
      options_dep:[],
      options_arr:[]
    };
  }

  handleChange = (e, fieldName) => {
    this.setState({ [fieldName]: e.target.value });
  };

  componentWillReceiveProps(nextProps) {
    debugger
    this.setState({
      pageType: nextProps.pageType,
      domain: nextProps.domain,
      language: nextProps.language,
      subType: nextProps.subType
    });
  }

  componentWillMount = () => {
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
    debugger
    var parameters = {
      page_type: pageType,
      domain: domain,
      sub_type: subType,
      language: language,
      section: section,
      category: categoryType,
      dep_city_name: depCityNameSelected,
      arr_city_name: arrCityNameSelected,
      airline_name: cityNameSelected
    };

    if (pageType.length > 0 && subType.length > 0) {
      axios
        .get(url, { params: { args: parameters } })
        .then(response => {
          //handle success
          this.setState({ renderTables: false });

          debugger;
          if (
            typeof response.data.result[pageType][subType] !== "undefined" &&
            response.data.result[pageType][subType].length > 0 || categoryType=="common"
          ) {
          if (categoryType=="common") {
            result["common"][subType] = response.data.result["common"][subType];
            this.setState({ result: result, renderTables: true });
          }
            else
            {
              result[pageType][subType] = response.data.result[pageType][subType];
              this.setState({ result: result, renderTables: true });

            }
          } else {
            debugger
            this.setState({
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
      if (this.state.pageType==="flight-schedule" ){
      if (this.state.subType==="routes" && this.state.depCityNameSelected!="" && this.state.arrCityNameSelected!="") {
        debugger
          this.componentWillMount();
      }

    }
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
      this.setState({ selectedOption: p, airlineName: p.value },()=>this.handleGetInfo());
    } else if (fieldName === "depCityName") {
      this.setState({ depCityNameSelected: p, depCityName: p.value },()=>this.handleGetInfo());
      debugger
    } else if (fieldName === "arrCityName") {
      this.setState({ arrCityNameSelected: p, arrCityName: p.value,domain: this.state.domain,language: this.state.lanugage,pageType: this.state.pageType,subType: this.state.subType },()=>this.handleGetInfo());
      debugger
    } else if (fieldName === "cityName") {
      this.setState({ cityNameSelected: p, cityName: p.value },()=>this.handleGetInfo());
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
    if (subType === "routes" || subType === "overview" || subType === "from" || subType === "to" || subType === "pnr" || subType === "web-checkin") {
      category = (
        <Form.Group controlId="exampleForm.ControlSelect1">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={this.state.categoryType}
            onChange={e => this.handleChange(e, "categoryType")}
            name="categoryType"
            required
          >
            <option>Select Category</option>
            <option value="uniq">Unique</option>
            <option value="common">Common</option>
          </Form.Control>
        </Form.Group>
      );
    }
    // else if (subType === "overview" || subType === "overview" || subType === "overview" || subType === "overview" || subType === "overview") {
    //   category = (
    //     <Form.Group controlId="exampleForm.ControlSelect1">
    //       <Form.Label>Category</Form.Label>
    //       <Form.Control
    //         as="select"
    //         value={this.state.categoryType}
    //         onChange={e => this.handleChange(e, "categoryType")}
    //         name="categoryType"
    //         required
    //       >
    //         <option>Select Category</option>
    //         <option value="uniq">Unique</option>
    //         <option value="common">Common</option>
    //       </Form.Control>
    //     </Form.Group>
    //   );

    // }
    

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
            <Form.Group as={Col}>
              <Form.Label>Select section</Form.Label>
              <Form.Control
                as="select"
                onChange={e => this.handleChange(e, "section")}
                name="section"
                value={this.state.section}
              >
                {this.returnOptions(sections)}
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
            {category}
          </Form.Row>

          {categoryType === "uniq" &&
        (subType === "from" ||
          subType === "to") ? (
          <div>
          <Form.Label>City Name</Form.Label>
          <Select1
            // isDisabled = {readOnlyValue}
            value={cityNameSelected}
            onChange={p => this.handleSelectedInput(p, "cityName")}
            options={options}
            name="cityName"
            required
            placeholder="Search City"
            // onInputChange={this.handleAirlineSearch}
            onInputChange={e => this.handleAutoSearch(e, "cityName")}
          />
          </div>
        ) : null}
        {categoryType === "uniq" && subType === "routes" ? (
          <div>
           <Form.Label>Dep City Name</Form.Label>
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
            <Form.Label>Arr City Name</Form.Label>
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
          </div>
        ) : null}
          <ButtonToolbar>
           
            <Button variant="success" onClick={this.handleAdd}>
              Add New
            </Button>
          </ButtonToolbar>
        </Form>

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
