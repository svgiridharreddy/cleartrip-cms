import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:3000/hotels/unique-content-data-collection";

class UniqueContentDataCollection extends Component {
  constructor() {
    super();
    this.state = {
      query: "",
      results: [],
      uniqueData: ""
    };
    this.getInfo = this.getInfo.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  getInfo = () => {
    axios.get(`${API_URL}?prefix=${this.state.query}`).then(response => {
      var cdnuniqueData = response.data.length !== 0 ? "present" : "notpresent";
      this.setState({
        uniqueData: cdnuniqueData,
        results: response.data
      });
      console.log(response.data);
    });
  };

  handleInputChange = () => {
    this.setState(
      {
        query: this.search.value
      },
      () => {
        if (this.state.query && this.state.query.length > 5) {
          this.getInfo();
        }
      }
    );
  };

  render() {
    let dataField;
    if (this.state.uniqueData === "present") {
      dataField = (
        <div>
          <table>
            <tbody>
              {this.state.results.map((item, i) => {
                return (
                  <tr key={i}>
                    <td>{item.domain_url}</td>
                    <td>{item.content_type}</td>
                    <td>{item.meta_title}</td>
                    <td>
                      <Button variant="success" size="lg" block>
                        <Link to={`hotels/show/uniquedata/${item.id}`}>
                          View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    } else if (this.state.uniqueData === "notpresent") {
      dataField = (
        <div>
          <p>
            Your searched data not present, you can add data by clicking Add
            button here
          </p>
          <button onClick={this.handleAddForm}>
            <Link to={`hotels/addUniquedata`}>Add</Link>
          </button>
        </div>
      );
    }
    return (
      <div>
        <input
          placeholder="Search for Domain Url..."
          ref={input => (this.search = input)}
          onChange={this.handleInputChange}
        />
        {dataField}
      </div>
    );
  }
}

export default UniqueContentDataCollection;
