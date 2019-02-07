import React from "react";
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

function SimpleTable(props) {
  const { classes, response } = props;
  return (
    <div>
      {Object.keys(response).map((key, index) => ((
        // { response[key]!="" ?
        <Paper key={index} className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Domain</TableCell>
                <TableCell align="center">URL</TableCell>
                <TableCell align="center">Language</TableCell>
                {key == "bookingOverview" ? (
                  <TableCell align="center">Airline Name</TableCell>
                ) : null}
                {key == "scheduleRoute" ? (
                  <TableCell align="center">Source</TableCell>
                ) : null}
                {key == "scheduleRoute" ? (
                  <TableCell align="center">Destination</TableCell>
                ) : null}

                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {response[key].map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.domain}</TableCell>
                  <TableCell align="center">{row.url}</TableCell>
                  <TableCell align="center">{row.language}</TableCell>
                  {row.page_type == "flight-booking" ? (
                    <TableCell align="center">{row.airline_name}</TableCell>
                  ) : null}
                  {row.page_type == "flight-schedule" &&
                  row.page_subtype == "schedule-routes" ? (
                    <TableCell align="center">{row.source}</TableCell>
                  ) : null}
                  {row.page_type == "flight-schedule" &&
                  row.page_subtype == "schedule-routes" ? (
                    <TableCell align="center">{row.destination}</TableCell>
                  ) : null}

                  <TableCell align="center">
                    <Link to={{ pathname: "/flights", state: { flight: row } }}>
                      <EditIcon />
                    </Link>{" "}
                    <DeleteIcon
                      onClick={() => {
                        props.handleDelete(idx, key, row.id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper> /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/ /*: null }*/
        // : null }
      ) /*: null }*/))}
    </div>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTable);
