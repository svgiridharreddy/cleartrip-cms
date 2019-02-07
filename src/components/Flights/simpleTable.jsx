import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },

  icon: {
    margin: theme.spacing.unit,
    fontSize: 32
  }
});
let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9)
];

class SimpleTable extends Component {
  state = {
    pageType: this.props.pageType,
    subType: this.props.subType,
    domain: this.props.domain,
    language: this.props.language
  };
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps = nextProps => {
    debugger;
    this.setState({
      pageType: nextProps.pageType,
      subType: nextProps.subType,
      domain: nextProps.domain,
      language: nextProps.language
    });
  };

  render() {
    const {
      classes,
      response,
      pageType,
      subType,
      tableFields,
      tableTitle
    } = this.props;
    debugger;
    var tableTitlearray = [];
    var tableValuearray = [];

    tableTitlearray = Object.keys(tableTitle);
    var temparray = Object.keys(tableFields[subType]);
    tableTitlearray = tableTitlearray.concat(temparray);
    var actions = ["Edit", "Delete"];
    tableTitlearray = tableTitlearray.concat(actions);
    tableValuearray = Object.values(tableTitle);
    var tempValueArray = Object.values(tableFields[subType]);
    tableValuearray = tableValuearray.concat(tempValueArray);
    var flight = [];
    return (
      <div>
        <Paper key={subType} className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {tableTitlearray.map(title => (
                  <TableCell key={title} align="center">
                    {title}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {response[pageType][subType].map((resp, idx) => (
                <TableRow key={resp.id}>
                  {tableValuearray.map(a => (
                    <TableCell key={a} align="center">
                      {resp[a]}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Link
                      to={{
                        pathname: "/flights",
                        state: { flight: resp }
                      }}
                    >
                      <EditIcon />
                      {""}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    <DeleteIcon
                      onClick={() => {
                        this.props.handleDelete(idx, resp.id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        {/* <Paper key={subType} className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Domain</TableCell>
                <TableCell align="center">Langugage</TableCell>
                <SimpleFields />
                <TableCell align="center">URL</TableCell>
                <TableCell align="center">Page Type</TableCell>
                <TableCell align="center">Sub Page Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {response[pageType][subType].map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell component="th" align="center" scope="row">
                    {row.domain}
                  </TableCell>
                  <TableCell align="center">{row.language}</TableCell>
                  {subType === "routes" ? (
                    <div>
                      <TableCell align="center">{row.airline_name}</TableCell>
                      <TableCell align="center">{row.source}</TableCell>
                      <TableCell align="center">{row.destination}</TableCell>
                    </div>
                  ) : (
                    <TableCell align="center">{row.airline_name}</TableCell>
                  )}
                  <TableCell align="center">{row.url}</TableCell>
                  <TableCell align="center">{row.page_type}</TableCell>
                  <TableCell align="center">{row.page_subtype}</TableCell>
                  <TableCell align="center">
                    <Link to={{ pathname: "/flights", state: { flight: row } }}>
                      <EditIcon />
                      {""}
                    </Link>
                  </TableCell>
                  <TableCell align="center">
                    {" "}
                    <DeleteIcon
                      onClick={() => {
                        this.props.handleDelete(idx, row.id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper> */}
      </div>
    );
  }
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTable);
