import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Col, ButtonToolbar, Table } from "react-bootstrap";

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
    var temparray = subType.length > 0 ? Object.keys(tableFields[subType]) : "";
    tableTitlearray = tableTitlearray.concat(temparray);
    var actions = ["Edit", "Delete"];
    tableTitlearray = tableTitlearray.concat(actions);
    tableValuearray = Object.values(tableTitle);
    var tempValueArray =
      subType.length > 0 ? Object.values(tableFields[subType]) : "";
    tableValuearray = tableValuearray.concat(tempValueArray);
    var flight = [];
    let result;

    return (
      <div>
        {renderTables ? (
          <Table key={subType.length > 0 ? subType : ""} responsive>
            <thead>
              <tr>
                {tableTitlearray.map(title => (
                  <td key={title} align="center">
                    {title}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {categoryType === "uniq"
                ? response[pageType][subType].map((resp, idx) => (
                    <tr key={resp.id}>
                      {tableValuearray.map(a => (
                        <td key={a} align="center">
                          {resp[a]}
                        </td>
                      ))}

                      <td align="center">
                        <Button
                          as="input"
                          type="button"
                          value="Edit"
                          onClick={this.props.handleEdit}
                        />
                      </td>
                      <td>
                        <Button
                          as="input"
                          type="button"
                          value="Delete"
                          onClick={() => {
                            this.props.handleDelete(idx, resp.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))
                : response["common"].map((resp, idx) => (
                    <tr key={resp.id}>
                      {tableValuearray.map(a => (
                        <td key={a} align="center">
                          {resp[a]}
                        </td>
                      ))}

                      <td align="center">
                        <Button
                          as="input"
                          type="button"
                          value="Edit"
                          onClick={this.props.handleEdit}
                        />
                      </td>
                      <td>
                        <Button
                          as="input"
                          type="button"
                          value="Delete"
                          onClick={() => {
                            this.props.handleDelete(idx, resp.id);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
            </tbody>
          </Table>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default FlightsTable;
