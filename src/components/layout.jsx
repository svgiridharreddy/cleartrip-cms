import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@material-ui/core";
import loginHelpers from "./helper";
import Login from "./Login";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

import "../../node_modules/react-notifications/lib/notifications.css";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3
  }
});

class Layout extends React.Component {
  state = {
    mobileOpen: false,
    loginStatus: false,
    is_admin: false
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };

  logout() {
    let _self = this;
    loginHelpers.logout();
    _self.setState({
      loginStatus: false
    });
    NotificationManager.info("logged out successfully", "logout", 1500);
    setTimeout(function() {
      window.location = "/";
    }, 1000);
  }

  componentDidMount() {
    if (loginHelpers.checkUser()) {
      let is_admin = false;
      if (loginHelpers.check_usertype()) {
        is_admin = true;
      }
      this.setState({
        loginStatus: true,
        is_admin: is_admin
      });
    }
  }
  changeState() {
    this.setState({
      loginStatus: true
    });
  }

  render() {
    let { loginStatus, is_admin } = this.state;
    const { classes, children } = this.props;
    const { mobileOpen } = this.state;

    const drawer = (
      <div>
        <div className={classes.toolbar}>
          {loginStatus ? (
            <ul>
              <li>
                <NavLink to="/flights" activeClassName="current sidebarLinks">
                  Flights
                </NavLink>
              </li>
              <li>
                <NavLink to="/hotels" activeClassName="current sidebarLinks">
                  Hotels
                </NavLink>
              </li>
              <li>
                {is_admin ? (
                  <NavLink
                    to="/flights-approve"
                    activeClassName="current sidebarLinks"
                  >
                    Approve Flights
                  </NavLink>
                ) : (
                  ""
                )}
              </li>
              <li>
                {is_admin ? (
                  <NavLink
                    to="/hotels-approve"
                    activeClassName="current sidebarLinks"
                  >
                    Approve Hotels
                  </NavLink>
                ) : (
                  ""
                )}
              </li>
              <li>
                <a
                  href="http://54.255.195.145/seo-banner-api/manager/"
                  target="blank"
                  className="sidebarLinks"
                >
                  Banner
                </a>
              </li>
              <li>
                <a
                  href="http://52.77.239.110/"
                  target="blank"
                  className="sidebarLinks"
                >
                  Interlinking
                </a>
              </li>
            </ul>
          ) : (
            ""
          )}
        </div>
      </div>
    );

    return (
      <div>
        <div>
          <header>
            <div className="cleartripLogo " />

            {loginStatus ? (
              <div className="nav-right" onClick={this.logout.bind(this)}>
                <span className="nav-user">Super Admin</span>
                Log Out
              </div>
            ) : (
              <div className="nav-right">
                <Login changeState={this.changeState.bind(this)} />
              </div>
            )}
          </header>
        </div>
        <div className="content-wrapper">
          <div className="sidebar">{drawer}</div>
          <div className="main-content">{children}</div>
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  // Injected by the documentation to work in an iframe.
  // You won't need it on your project.
  container: PropTypes.object,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Layout);
