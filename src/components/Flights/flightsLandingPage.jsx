import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import SimpleTable from "./simpleTable";
import { Redirect } from "react-router-dom";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import green from "@material-ui/core/colors/green";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
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
const simpletableFields = "";
class FlightsLandingPage extends Component {
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

  handleChangeField = (e, fieldName) => {
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
      page_type: this.state.pageType,
      domain: this.state.domain,
      sub_type: this.state.subType,
      language: this.state.language
    };
    if (pageType.indexOf(pageType) !== -1 && subType.indexOf(subType) !== -1) {
      axios
        .get(url, { params: { args: parameters } })
        .then(response => {
          //handle success
          if (
            typeof response.data.result[pageType][subType] !== "undefined" &&
            response.data.result[pageType][subType].length > 0
          ) {
            result[pageType][subType] = response.data.result[pageType][subType];
            this.setState({ result, renderTables: true });
          } else {
            this.setState({
              message: (
                <div>
                  <h4>
                    "No resutls found with your search. Click Add button to
                    create one "
                  </h4>
                </div>
              )
            });
          }
        })
        .catch(response => {
          // this.setState({ renderTables: false });
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

  render() {
    const { result, pageType, subType, domain, language } = this.state;
    let subTypes = [];

    if (pageType === "flight-booking") {
      subTypes = ["overview", "airline-routes", "pnr", "web-checkin", "index"];
    } else if (pageType === "flight-schedule") {
      subTypes = ["routes", "from", "to", "index"];
    } else if (pageType === "flight-ticketss") {
      subTypes = ["routes", "index"];
    }

    const { classes } = this.props;
    return (
      <div>
        <h1>LandingPage</h1>
        <form className={classes.container} noValidate autoComplete="off">
          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="domains-Label-placeholder">
              Domains
            </InputLabel>
            <Select
              value={this.state.domain}
              onChange={e => this.handleChangeField(e, "domain")}
              input={<Input name="domain" id="domain-label-placeholder" />}
              displayEmpty
              name="domain"
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
            <InputLabel shrink htmlFor="language-Label-placeholder">
              Language
            </InputLabel>
            <Select
              value={this.state.language}
              onChange={e => this.handleChangeField(e, "language")}
              input={<Input name="language" id="language-label-placeholder" />}
              displayEmpty
              name="language"
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>Select Options</em>
              </MenuItem>
              {languages.map(option => (
                <MenuItem key={option} value={option}>
                  {" "}
                  {option}
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
              value={this.state.pageType}
              onChange={e => this.handleChangeField(e, "pageType")}
              input={<Input name="pageType" id="pageType-label-placeholder" />}
              displayEmpty
              name="pageType"
              className={classes.selectEmpty}
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

          <FormControl className={classes.formControl}>
            <InputLabel shrink htmlFor="pageType-Label-placeholder">
              Page Subtype
            </InputLabel>
            <Select
              value={this.state.subType}
              onChange={e => this.handleChangeField(e, "subType")}
              input={<Input name="pageType" id="pageType-label-placeholder" />}
              displayEmpty
              name="subType"
              className={classes.selectEmpty}
            >
              <MenuItem value="">
                <em>Select Options</em>
              </MenuItem>
              {subTypes.map(option => (
                <MenuItem key={option} value={option}>
                  {" "}
                  {option}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select Page Type</FormHelperText>
          </FormControl>

          {/* <FlightBooking
          currentSubtype={this.state.currentSubtype}
          handleCurrentSubtype={this.state.handleCurrentSubtype}
        /> */}
          <Button
            variant={"contained"}
            color="primary"
            className={classes.margin}
            onClick={this.handleGetInfo}
          >
            Get Info
          </Button>
        </form>

        <Button
          variant={"contained"}
          className={classes.margin}
          color="primary"
          onClick={this.handleAdd}
        >
          Add
        </Button>

        {this.state.renderTables ? (
          <SimpleTable
            domain={domain}
            language={language}
            response={result}
            pageType={pageType}
            subType={subType}
            handleDelete={this.handleDelete.bind(this)}
          />
        ) : (
          this.state.message
        )}
      </div>
    );
  }
}
FlightsLandingPage.propTypes = {
  classes: PropTypes.object
};
export default withStyles(styles)(FlightsLandingPage);
