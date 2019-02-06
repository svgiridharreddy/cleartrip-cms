import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import axios from "axios";
import { Redirect } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FlightBookingFields from "./flightBooking";
import FlightScheduleFields from "./flightSchedule";
import green from "@material-ui/core/colors/green";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});
const theme = createMuiTheme({
  palette: {
    primary: green
  },
  typography: {
    useNextVariants: true
  }
});
const pageTypes = ["flight-booking", "flight-schedule", "flight-tickets"];
const languages = ["English", "Arabic"];
const domains = {
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
      depCityName: "",
      arrCityName: "",
      cityName:"",
      readOnly:false,
      isHomePage: false,
      flight: {}
    };
  }

  handleChangeField = (e, fieldName) => {
    if (fieldName==="categoryType")
    {
    this.setState({ [fieldName]: e.target.value,
      title: "",
      description: "",
      keywords: "",
      content: "",
      h1Tag: "",
      airlineName: "",
      depCityName: "",
      arrCityName: "",
      cityName: ""
    });
  }
  else if (fieldName==="currentPageType")
    {
    this.setState({ [fieldName]: e.target.value,
      title: "",
      description: "",
      currentSubType: "",
      categoryType: "",
      keywords: "",
      content: "",
      h1Tag: "",
      airlineName: "",
      depCityName: "",
      arrCityName: "",
      cityName: ""
    });
  }
  else if (fieldName==="currentSubType")
    {
    this.setState({ [fieldName]: e.target.value,
      title: "",
      description: "",
      categoryType: "",
      keywords: "",
      content: "",
      h1Tag: "",
      airlineName: "",
      depCityName: "",
      arrCityName: "",
      cityName: ""
    });
  }
  else if ( fieldName==="currentDomain" && e.target.value==="IN")
  {
   this.setState({ [fieldName]: e.target.value, currentLanguage: "IN" });
  }

  else
  {
    this.setState({ [fieldName]: e.target.value });
  }
  };
  handleFormSubmit = e => {
    e.preventDefault();
    const flightValues = this.state;
    let postData = {
      flights_data: {
        domain: flightValues["currentDomain"],
        language: flightValues["currentLanguage"],
        page_type: flightValues["currentPageType"],
        page_subtype: flightValues["currentSubtype"],
        category: flightValues["categoryType"],
        title: flightValues["title"],
        description: flightValues["description"],
        keywords: flightValues["keywords"],
        content: flightValues["content"],
        h1_title: flightValues["h1Tag"],
        airline_name: flightValues["airlineName"],
        dep_city_name: flightValues["depCityName"],
        arr_city_name: flightValues["arrCityName"]
      }
    };
    console.log(postData)

    var self = this;
    axios({
      method: "post",
      url: "http://localhost:3000/flights",
      data: postData,
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(function(response) {
        //handle success
        console.log(response);
        self.setState({ isHomePage: true });
      })
      .catch(function(response) {
        self.setState({ isHomePage: false });
      });
    // fetch("http://localhost:3000/flights", {
    //   method: "POST",
    //   body: postData,
    //   headers: {
    //     "Content-Type": "application/json"
    //   }
    // })
    //   .then(response => {
    //     return response.json();
    //   })
    //   .then(fruit => {
    //     this.addNewFruit(fruit);
    //   });
  };
  onRecieveProps = () => {
    debugger
    var { flight } = this.props.location.state;
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
      readOnlyValue: true

    });
  };
  componentWillMount() {
    if (this.props.location.state !== undefined) {
      this.onRecieveProps();
    }
  }

  render() {
    const { classes } = this.props;

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
      depCityName,
      arrCityName,
      cityName,
      readOnlyValue
    } = this.state;
    let fields;
    if (this.state.isHomePage) {
      return <Redirect to="/flights/home" />;
    }
    if (currentPageType === "flight-booking") {
      fields = (
        <FlightBookingFields
          currentSubType={currentSubType}
          categoryType={categoryType}
          classes={classes}
          name="flight-booking"
          handleChangeField={(e, fieldName) =>
            this.handleChangeField(e, fieldName)
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

        />
      );
    } 
    else if (currentPageType === "flight-schedule") {
      fields = (
        <FlightScheduleFields
          currentSubType={currentSubType}
          categoryType={categoryType}
          classes={classes}
          name="flight-booking"
          handleChangeField={(e, fieldName) =>
            this.handleChangeField(e, fieldName)
          }
          title={title}
          description={description}
          keywords={keywords}
          content={content}
          h1Tag={h1Tag}
          cityName={cityName}
          depCityName={depCityName}
          arrCityName={arrCityName}
          readOnlyValue={readOnlyValue}
        />
      );
    }
    return (
      <div>
        <h1>Cleartrip Flights</h1>
        <form className={classes.container} autoComplete="off" onSubmit={this.handleFormSubmit.bind(this)} >
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="domains-Label-placeholder">
              Domains
            </InputLabel>
            <Select
              required
              value={currentDomain}
              onChange={e => this.handleChangeField(e, "currentDomain")}
              input={<Input name="domain" id="domain-label-placeholder" />}
              displayEmpty
              name="currentDomain"
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>Select Options</em>
              </MenuItem>
              {Object.keys(domains).map(option => (
                <MenuItem key={option} value={option}>
                  {domains[option]}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText />
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="language-Label-placeholder" required>
              Language
            </InputLabel>
            <Select
              required
              value={ currentLanguage }
              onChange={e => this.handleChangeField(e, "currentLanguage")}
              input={<Input name="language" id="language-label-placeholder" />}
              displayEmpty
              name="currentLanguage"
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>Select Options</em>
              </MenuItem>
              {this.state.currentDomain!="IN" ?
                <MenuItem key="ar" value="ar">Arabic
                </MenuItem>
                :null }
                 <MenuItem key="en" value="en">English
                </MenuItem>
            
              ))}
            </Select>
            <FormHelperText>Select Language</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="pageType-Label-placeholder">
              Page Type
            </InputLabel>
            <Select
              required
              value={currentPageType}
              onChange={e => this.handleChangeField(e, "currentPageType")}
              input={<Input name="pageType" id="pageType-label-placeholder" />}
              displayEmpty
              name="currentPageType"
              className={classes.selectEmpty}
              readOnly={readOnlyValue}
            >
              <MenuItem value="">
                <em>Select Options</em>
              </MenuItem>
              {pageTypes.map(option => (
                <MenuItem key={option} value={option}>
                  {" "}
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select Page Type</FormHelperText>
          </FormControl>
          {fields}
          {/* <FlightBooking
          currentSubtype={this.state.currentSubtype}
          handleCurrentSubtype={this.state.handleCurrentSubtype}
        /> */}
          <MuiThemeProvider theme={theme}>
            <Button
              variant={"contained"}
              color="primary"
              className={classes.margin}
              type="submit"
            >
              Submit
            </Button>
          </MuiThemeProvider>
        </form>
      </div>
    );
  }
}

Flights.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Flights);
