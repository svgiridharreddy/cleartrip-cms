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

function SimpleTable(props) {
  getInitialState = () => {};

  const { classes, response } = props;
  return (
    <div>
      <h2>Templatized</h2>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">description</TableCell>
              <TableCell align="center">Content </TableCell>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.flightBooking.map(row => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.content}</TableCell>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>

                <TableCell align="center">
                  <EditIcon /> <DeleteIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <h2>Unique Flight Booking</h2>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">description</TableCell>
              <TableCell align="center">Content </TableCell>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.flightBooking.map(row => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.content}</TableCell>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">
                  <EditIcon />{" "}
                  <DeleteIcon onClick={props.handleDelete(row.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <h2>Unique Flight Schedule</h2>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">description</TableCell>
              <TableCell align="center">Content </TableCell>
              <TableCell align="center">Action</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.flightSchedule.map(row => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.content}</TableCell>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">
                  <EditIcon /> <DeleteIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <h2>Unique Flight Tickets</h2>
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">description</TableCell>
              <TableCell align="center">Content </TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {response.flightBooking.map(row => (
              <TableRow key={row.id}>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.content}</TableCell>
                <TableCell align="center">
                  <EditIcon /> <DeleteIcon />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTable);
