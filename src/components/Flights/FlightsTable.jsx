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
      obj["editbtn"] = (
        <MDBBtn
          color="default"
          className="editBtn"
          rounded
          size="sm"
          onClick={() => this.props.handleEdit(idx)}
        >
          Edit
        </MDBBtn>
      );
      obj["deletebtn"] = (
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
      );
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
            orderable={false}
            data={data}
          />
        ) : (
          ""
        )}
        {/* {renderTables && subType != "index" ? (
          <Table
            key={subType != "" ? subType : ""}
            responsive
            className="table main-table"
            width="100%"
          >
            <thead>
              <tr>
                {tableTitlearray.map(title =>
                  title == "Section" ? (
                    <td key={title} align="center">
                      Domain-Language-Section
                    </td>
                  ) : title != "Domain" &&
                    title != "Language" &&
                    title != "Delete" &&
                    title != "Edit" ? (
                        categoryType === "common" &&
                          title != "source" &&
                          title != "destination" ? (
                            <td key={title} align="center">
                              {title}
                            </td>
                          ) : categoryType == "uniq" ? (
                            <td key={title} align="center">
                              {title}
                            </td>
                          ) : (
                              ""
                            )
                      ) : (
                        ""
                      )
                )}
              </tr>
            </thead>
            <tbody>
              {categoryType === "uniq"
                ? response[pageType][subType].map((resp, idx) => (
                  <tr key={resp.id}>
                    {tableValuearray.map(a =>
                      a == "section" ? (
                        <td key={a} align="center">
                          {resp["domain"] +
                            "-" +
                            resp["language"] +
                            "-" +
                            resp["section"]}
                        </td>
                      ) : a != "domain" && a != "language" ? (
                        <td key={a} align="center">
                          {resp[a]}
                        </td>
                      ) : (
                            ""
                          )
                    )}
                    <td align="center">
                      <ul className="list-inline">
                        <li>
                          <span
                            className="edit-btn"
                            onClick={() => this.props.handleEdit(idx)}
                          >
                            Edit
                            </span>
                        </li>
                        <li>
                          <span
                            className="delete-btn"
                            onClick={() => {
                              this.props.handleDelete(idx, resp.id);
                            }}
                          >
                            Delete
                            </span>
                        </li>
                      </ul>
                    </td>
                  </tr>
                ))
                : response["common"].map((resp, idx) => (
                  <tr key={resp.id}>
                    {tableValuearray.map(a =>
                      a == "section" ? (
                        <td key={a} align="center">
                          {resp["domain"] +
                            "-" +
                            resp["language"] +
                            "-" +
                            resp["section"]}
                        </td>
                      ) : a != "domain" &&
                        a != "language" &&
                        a != "source" &&
                        a != "destination" ? (
                            <td key={a} align="center">
                              {resp[a]}
                            </td>
                          ) : (
                            ""
                          )
                    )}
                    <td align="center">
                      <ul class="list-inline">
                        <li>
                          <span
                            className="edit-btn"
                            onClick={() => this.props.handleEdit(idx)}
                          >
                            Edit
                            </span>
                        </li>
                        <li>
                          <span
                            className="delete-btn"
                            onClick={() => {
                              this.props.handleDelete(idx, resp.id);
                            }}
                          >
                            Delete
                            </span>
                        </li>
                      </ul>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        ) : (
            <Table className="table main-table" width="100%">
              <thead>
                <tr>
                  <td>Domain-Language-Section</td>
                  <td>Page Type</td>
                  <td>Sub Type</td>
                </tr>
              </thead>
              <tbody>
                {response["common"].map((resp, idx) => (
                  <tr>
                    <td>
                      {resp.domain + "-" + resp.language + "-" + resp.section}
                    </td>
                    <td>{resp.page_type}</td>
                    <td>{resp.page_subtype}</td>
                    <td>
                      <ul class="list-inline">
                        <li>
                          <span
                            className="edit-btn"
                            onClick={() => this.props.handleEdit(idx)}
                          >
                            Edit
                        </span>
                        </li>
                        <li>
                          <span
                            className="delete-btn"
                            onClick={() => {
                              this.props.handleDelete(idx, resp.id);
                            }}
                          >
                            Delete
                        </span>
                        </li>
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )} */}
      </div>
    );
  }
}

export default FlightsTable;
