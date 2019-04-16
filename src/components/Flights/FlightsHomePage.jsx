import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import FlightsTable from "./FlightsTable";
import Select1 from "react-select";
import MetaFields from "./MetafieldsTest1";
import "./css/Flights.css";
import queryString from 'query-string'
import "../../../node_modules/react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import { host } from "../helper";
import loginHelpers from "../helper";
import Promise from "promise"
import { debug } from "util";

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
      faq_object: [],
      reviews_object: [],
      showComponent: false,
      source: "",
      destination: "",
      brandName: "",
      fromToCity: "",
      editClicked: false,
      host: host(),
      backBtnClicked: false,
      updatedInEditForm: false,
      loading: false,
      last_modified_list: [],
      content_tabs_data: []

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

  componentDidMount() {
    let _self = this
    let search_params = queryString.parse(this.props.location.search)
    if (search_params["id"] && search_params["table_name"]) {
      return new Promise(function (resolve) {
        let data = { id: search_params["id"], table_name: search_params["table_name"] }
        axios.get(host() + "/edit-from-approval", { params: data }).then(function (json) {
          let record = json.data.record
          let result = json.data.result
          _self.setState({
            result: json.data.result,
            pageType: record["page_type"],
            domain: record["domain"],
            subType: record["page_subtype"],
            language: record["language"],
            categoryType: result["common"].length > 0 ? "common" : "uniq",
            section: record["section"],
            renderTables: true
          })
          return resolve(json)
        }).catch(error => {
          NotificationManager.error("Record Not found", "Please try again", 3000)
        })
      })
    }
  }

  handleFormSubmit = e => {
    let _self = this
    if (e) {
      e.preventDefault();
    }
    if (_self.state.editClicked) {
      if (_self.state.updatedInEditForm) {
        console.log("changed")
      } else {
        this.backBtnFun()
        return false
      }
    }
    const flightValues = this.state;
    let user_data = JSON.parse(localStorage.getItem("user_data"));
    if (!user_data) {
      window.location.replace("/");
    }    
    if (flightValues["reviews_object"] && flightValues["reviews_object"].length > 0) {
      if (flightValues["reviews_object"][0]["avg_review_rating"] === "") {
        this.setState({
          reviews_object: []
        })
        flightValues["reviews_object"] = []
      }
      if (flightValues["reviews_object"][0] && flightValues["reviews_object"][0]["reviews_list"].length == 1) {
        if (flightValues["reviews_object"][0]["avg_review_rating"] === "") {
          this.setState({
            reviews_object: []
          })
          flightValues["reviews_object"] = []
        }
      } else if (flightValues["reviews_object"] && flightValues["reviews_object"][0] && flightValues["reviews_object"][0]["reviews_list"].length > 1) {
        flightValues["reviews_object"][0]["reviews_list"].map((r, i) => {
          if (r["rating"] != "" && r["review_text"] != "" && r["review_text"] != "") {
            return true
          } else {
            flightValues["reviews_object"][0]["reviews_list"].splice(i, 1)
          }
        })
      }
    }

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
        content: flightValues["content"] ? flightValues["content"].toString("html") : "",
        h1_title: flightValues["h1Tag"],
        faq_object: flightValues["faq_object"] && flightValues["faq_object"].length > 0 ? flightValues["faq_object"] : [],
        reviews_object: flightValues["reviews_object"] && flightValues["reviews_object"].length > 0 ? flightValues["reviews_object"] : [],
        last_modified_list: flightValues['last_modified_list'] && flightValues["last_modified_list"].length > 0 ? flightValues["last_modified_list"] : [],
        content_tabs_data: flightValues["content_tabs_data"] && flightValues["content_tabs_data"].length > 0 ? JSON.stringify(flightValues["content_tabs_data"]) : "",
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
      },
      user_data: user_data
    };
    axios({
      method: "post",
      url: this.state.host + "/flights",
      data: postData,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        // let search_params = queryString.parse(this.props.location.search)
        // if (search_params["id"] && search_params["table_name"]) {
        //   window.location.replace("/flights-approve")
        // }
        setTimeout(function () {
          if(window.location.search){
            window.history.replaceState({},'Title',"/flights")
          }
          NotificationManager.success(
            "Approval required",
            "Admin Need to approve ",
            2000
          );
        }, 10)
       
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
          options: [],
          updatedInEditForm: false,
          last_modified_list: [],
          content_tabs_data:[]
        });
        this.fetchDetails();
      })
      .catch(response => {
        this.setState({ isHomePage: false });
      });
  };
  handleMetaChanges = (e, fieldName) => {
    let _self = this
    let arr = []
    arr.push(fieldName)
    if (_self.state.last_modified_list.indexOf(fieldName) == -1) {
      _self.setState({
        last_modified_list: this.state.last_modified_list.concat(arr)
      })
    }
    this.setState({
      [fieldName]: e.target.value,
      updatedInEditForm: true
    });
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
  faqOnchange(e, fieldName) {
    let _self = this
    let arr = []
    arr.push(fieldName)
    if (_self.state.last_modified_list.indexOf(fieldName) == -1) {
      _self.setState({
        last_modified_list: _self.state.last_modified_list.concat(arr)
      })
    }
    _self.setState({
      [fieldName]: e,
      updatedInEditForm: this.state.editClicked ? true : false
    })
  }
  handleChange = (e, fieldName) => {
    if (this.state.editClicked) {
      if (fieldName === 'rte') {
        if (this.state.last_modified_list.indexOf("content") == -1) {
          let arr = []
          arr.push("content")
          this.setState({
            last_modified_list: this.state.last_modified_list.concat(arr)
          })
        }
      }
      this.setState({ updatedInEditForm: true })
    }
    if(this.state.domain === "IN" || e.target.value === "IN"){
        if(this.state.language === "ar"){
          this.setState({
            language:"en"
          })
        }
    }
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
          backBtnClicked: false,
          brandName: ""
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
          backBtnClicked: false
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
          backBtnClicked: false
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
          backBtnClicked: false
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
          backBtnClicked: false,
          cityNameSelected: "",
          cityName: "",
          airlineName: "",
          airlineNameSelected: "",
          depCityName: "",
          depCityNameSelected: "",
          arrCityName: "",
          arrCityNameSelected: "",
          source: "",
          destination: "",
          brandName: "",
          fromToCity: ""
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
    let _self = this
    if (_self.state.domain !== "" && _self.state.language !== "" && _self.state.pageType !== "" && _self.state.subType != "") {
      if (_self.state.subType === "index") {
        _self.setState({ loading: true })
      } else if (_self.state.categoryType !== "") {
        _self.setState({ loading: true })
      }
    } else {
      _self.setState({ loading: false })
      return false
    }
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
      backBtnClicked,
      faq_object,
      reviews_object
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
    if (backBtnClicked) {
      parameters["airline_name"] = "";
      parameters["dep_city_name"] = "";
      parameters["arr_city_name"] = "";
      parameters["city_name"] = "";
      this.setState({
        backBtnClicked: false
      });
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
            showComponent: false,
            loading: false
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
                showComponent: false,
                loading: false
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
                  : this.state.fromToCity,
                loading: false
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
              showAddButton: false,
              loading: false
            });
          } else {
            NotificationManager.info(
              "Please click add new to add new route",
              "No record found",
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
              keyword: "",
              faq_object: [],
              reviews_object: [],
              last_modified_list: [],
              content_tabs_data:[],
              loading: false
            });
          }
        })
        .catch(response => {
          this.setState({ renderTables: false, showAddButton: true, loading: false });
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
      h1Tag: "",
      faq_object: [],
      reviews_object: [],
      last_modified_list: [],
      content_tabs_data:[]
    });
  };

  backBtnFun = () => {
    let _self = this;
    let updated = false
    if (_self.state.editClicked && _self.state.updatedInEditForm) {
      updated = window.confirm("Do you want to save save your changes?")
    }
    if(window.location.search){
      window.history.replaceState({},'Cms',"/flights")
    }
    setTimeout(function () {
      _self.setState({
        showComponent: false,
        renderTables: true,
        editClicked: false,
        readOnlyValue: false,
        backBtnClicked: true,
        source: "",
        depCityName: "",
        cityNameSelected: "",
        cityName: "",
        airlineName: "",
        airlineNameSelected: "",
        depCityName: "",
        depCityNameSelected: "",
        arrCityName: "",
        arrCityNameSelected: "",
        updatedInEditForm: false
      });
    }, 100);
    if (updated) {
      _self.handleFormSubmit()
    } else {
      setTimeout(function () {
        _self.fetchDetails();
      }, 100);
    }
  };

  handleEdit = idx => {
    let _self = this
    let { result, pageType, subType, categoryType } = this.state;
    if (categoryType === "common" || subType === "index") {
      _self.setState({
        renderTables: false,
        showComponent: true,
        message: "",
        showAddButton: false,
        title: result["common"][idx]["title"],
        description: result["common"][idx]["description"],
        keywords: result["common"][idx]["keyword"],
        content: result["common"][idx]["content"],
        h1Tag: result["common"][idx]["heading"],
        faq_object: result["common"][idx]["faq_object"] ? result["common"][idx]["faq_object"] : [],
        last_modified_list: result["common"][idx]["last_modified_list"] ? result["common"][idx]["last_modified_list"] : [],
        content_tabs_data:[],
        readOnlyValue: true,
        editClicked: true
      });
    } else {
      _self.setState({
        title: "",
        description: "",
        content: "",
        keywords: "",
        source: "",
        destination: "",
        fromToCity: "",
        brandName: "",
        arrCityNameSelected: "",
        airlineName: "",
        faq_object: [],
        reviews_object: [],
        last_modified_list: [],
        content_tabs_data:[]
      })
      setTimeout(function () {
        debugger
        _self.setState({
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
          faq_object: result[pageType][subType][idx]["faq_object"] ? result[pageType][subType][idx]["faq_object"] : [],
          reviews_object: result[pageType][subType][idx]["reviews_object"] ? result[pageType][subType][idx]["reviews_object"] : [],
          last_modified_list: result[pageType][subType][idx]["last_modified_list"] ? result[pageType][subType][idx]["last_modified_list"] : [],
          content_tabs_data: result[pageType][subType][idx]["content_tabs_data"] ? JSON.parse(result[pageType][subType][idx]["content_tabs_data"]) : [],
          arrCityNameSelected:
            _self.state.arrCityNameSelected != ""
              ? _self.state.arrCityNameSelected
              : _self.state.source,
          editClicked: true,
          readOnlyValue: true
        });
      }, 100)
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
            this.setState({ options: response.data });
            //   , () =>
            //   this.fetchDetails()
            // );
          } else if (fieldName === "depCityName") {
            this.setState({ options_dep: response.data });
          } else if (fieldName === "arrCityName") {
            this.setState({ options_arr: response.data });
          } else if (fieldName === "cityName") {
            this.setState({ options: response.data });
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
      fromToCity,
      loading
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
        <div className={loading ? "loading" : ""}></div>
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
                  <option value="en">En</option>
                  <option value="ar" className={this.state.domain && this.state.domain == 'IN'
                    ? 'hidden' : ''}>Ar</option>
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
                    categoryType={this.state.categoryType}
                    handleFormSubmit={this.handleFormSubmit.bind(this)}
                    pageType={this.state.pageType}
                    subType={this.state.subType}
                    title={this.state.title}
                    description={this.state.description}
                    content={this.state.content}
                    keywords={this.state.keywords}
                    h1Tag={this.state.h1Tag}
                    faq_object={this.state.faq_object}
                    reviews_object={this.state.reviews_object}
                    content_tabs_data={this.state.content_tabs_data}
                    handleRTEchange={content => this.handleRTEchange(content)}
                    backBtnFun={this.backBtnFun.bind(this)}
                    faqOnchange={this.faqOnchange.bind(this)}
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