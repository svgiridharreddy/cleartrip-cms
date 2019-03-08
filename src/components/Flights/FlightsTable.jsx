import React, { Component } from "react";
import { Button, Table } from "react-bootstrap";
import "./css/Flights.css";
import { MDBBtn, MDBDataTable } from "mdbreact";
class FlightsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageType: this.props.pageType,
      subType: this.props.subType,
      domain: this.props.domain,
      language: this.props.language,
      section: this.props.section,
      arrCityName: this.props.arrCityName,
      depCityName: this.props.depCityName
    };
  }
  componentWillReceiveProps = nextProps => {
    this.setState({
      pageType: nextProps.pageType,
      subType: nextProps.subType,
      domain: nextProps.domain,
      language: nextProps.language,
      arrCityName: nextProps.arrCityName,
      depCityName: nextProps.depCityName
    });
  };

  render() {
    const data = {};
    const {
      response,
      pageType,
      subType,
      tableFields,
      tableTitle,
      categoryType,
      renderTables
    } = this.props;
    var tableTitlearray = [];
    var tableValuearray = [];
    tableTitlearray = Object.keys(tableTitle);
    var temparray =
      subType != "index" && subType != ""
        ? Object.keys(tableFields[subType])
        : ["h1Tag", "keywords"];
    tableTitlearray = tableTitlearray.concat(temparray);
    var actions = ["Edit", "Delete"];
    tableTitlearray = tableTitlearray.concat(actions);
    tableValuearray = Object.values(tableTitle);
    var tempValueArray =
      subType && subType != "index" ? Object.values(tableFields[subType]) : [];
    tableValuearray = tableValuearray.concat(tempValueArray);
    let columns = [];
    let rows = [];
    if (subType === "index") {
      columns = [
        {
          label: "Domain-Language-Section",
          field: "Domain-Language-Section",
          width: 150
        },
        { label: "Page Type", field: "Page Type", width: 150 },
        { label: "Sub Type", field: "Sub Type", width: 150 }
      ];
    } else {
      tableTitlearray.map(heading => {
        let pword =
          heading == "Section"
            ? "Domain-Language-Section"
            : heading != "Domain" &&
              heading != "Language" &&
              heading != "Delete" &&
              heading != "Edit"
              ? categoryType === "common" &&
                heading != "source" &&
                heading != "destination"
                ? heading
                : categoryType == "uniq"
                  ? heading
                  : ""
              : "";
        if (pword != "") {
          let obj = {
            label: pword,
            field: pword,
            width: 150
          };
          columns.push(obj);
        }
      });
    }
    let obj_data = [];
    if (subType == "index" || categoryType == "common") {
      obj_data = response["common"];
    } else if (categoryType == "uniq") {
      obj_data = response[pageType][subType];
    }
    obj_data.map((resp, idx) => {
      let obj = {};
      columns.map(col => {
        let tabObj = {};
        tabObj["field"] = typeof col === "object" ? col["field"] : col;
        if (tabObj["field"] === "Domain-Language-Section") {
          obj[tabObj["field"]] =
            resp["domain"] + "-" + resp["language"] + "-" + resp["section"];
        } else {
          if (
            tabObj["field"] === "Sub Page Type" ||
            tabObj["field"] === "Sub Type"
          ) {
            obj["page_subtype"] = resp["page_subtype"];
          } else if (tabObj["field"] == "From City") {
            obj["from_city"] = resp["city_name"];
          } else if (tabObj["field"] == "To City") {
            obj["to_city"] = resp["city_name"];
          } else if (tabObj["field"] == "AirlineName") {
            obj["AirlineName"] = resp["airline_name"];
          } else {
            obj[tabObj["field"].toLowerCase().replace(" ", "_")] =
              resp[tabObj["field"].toLowerCase().replace(" ", "_")];
          }
        }
      });
      obj["editbtn"] =
        <MDBBtn
          color="default"
          className="editBtn"
          rounded
          size="sm"
          onClick={() => this.props.handleEdit(idx)}
        >
          Edit
        </MDBBtn>
      let user_type = JSON.parse(localStorage.getItem("user_data"))
      if (user_type && user_type.user_type == "superadmin") {
        obj["deletebtn"] =
          <MDBBtn
            color="default"
            rounded
            size="sm"
            className="deleteBtn"
            onClick={() => {
              this.props.handleDelete(idx, resp.id);
            }}
          >
            Delete
        </MDBBtn>
      }
      rows.push(obj);
    });
    data["columns"] = columns;
    data["rows"] = rows;
    return (
      <div className="index-tables">
        {renderTables ? (
          <MDBDataTable
            btn
            striped
            bordered
            autoWidth
            data={data}
          />
        ) : (
            ""
          )}
      </div>
    );
  }
}

export default FlightsTable;
