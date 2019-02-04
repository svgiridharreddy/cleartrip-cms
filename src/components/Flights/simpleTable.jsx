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

function SimpleTable(props) {
  const { classes, response } = props;

  return (
    <div>
      {Object.keys(response).map((key, index) => (
        <Paper key={index} className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Domain</TableCell>
                <TableCell align="center">URL</TableCell>
                <TableCell align="center">Language</TableCell>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">KeyWords</TableCell>
                <TableCell align="center">OG Title</TableCell>
                <TableCell align="center">OG description</TableCell>
                <TableCell align="center">Content </TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {response[key].map((row, idx) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.domain}</TableCell>
                  <TableCell align="center">{row.url}</TableCell>
                  <TableCell align="center">{row.language}</TableCell>
                  <TableCell align="center">{row.title}</TableCell>
                  <TableCell align="center">{row.description}</TableCell>
                  <TableCell align="center">{row.keywords}</TableCell>
                  <TableCell align="center">{row.og_title}</TableCell>
                  <TableCell align="center">{row.og_description}</TableCell>
                  <TableCell align="center">{row.content}</TableCell>
                  <TableCell align="center">
                    <EditIcon
                      onClick={() => {
                        props.handleEdit(idx, key, row.id);
                      }}
                    />{" "}
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
        </Paper>
      ))}
    </div>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleTable);
