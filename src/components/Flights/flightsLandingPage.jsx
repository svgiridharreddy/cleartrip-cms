import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import SimpleTable from "./simpleTable";
import { Redirect } from "react-router-dom";

class FlightsLandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: {
        bookingOverview: [],
        airlineRoutes: []
      },
      renderTables: false
    };
  }

  componentWillMount() {
    let { result } = this.state;

    axios({
      method: "get",
      url: "http://localhost:3000/fetch_details",
      config: { headers: { "Content-Type": "multipart/form-data" } }
    })
      .then(response => {
        //handle success
        result.bookingOverview = response.data.FlightBookingOverview;
        result.airlineRoutes = response.data.FlightBookingRoute;
        this.setState({ result, renderTables: true });
      })
      .catch(response => {
        this.setState({ renderTables: false });
      });
  }

  handleEdit = (index, key, row, type) => {};

  handleDelete = (index, key, id) => {
    var url = "http://localhost:3000/delete_data";
    axios
      .delete(url, {
        data: { id: id, type: key }
      })
      .then(response => {
        const result = { ...this.state.result };
        const values = result[key];
        if (index !== -1) {
          values.splice(index, 1);
          result[key] = values;
          this.setState({ result });
        }
      })
      .catch(error => console.log(error));
  };
  handleAdd = () => {
    window.location.href = "/flights";
  };

  render() {
    return (
      <div>
        <h1>LandingPage</h1>
        <Button variant={"contained"} onClick={this.handleAdd}>
          Add
        </Button>
        {this.state.renderTables ? (
          <SimpleTable
            response={this.state.result}
            handleDelete={this.handleDelete.bind(this)}
            handleEdit={this.handleEdit.bind(this)}
          />
        ) : null}
      </div>
    );
  }
}

export default FlightsLandingPage;
