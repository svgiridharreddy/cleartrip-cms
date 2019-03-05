import axios from "axios";
import Promise from "promise"
import "../../node_modules/react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";

const loginHelpers = {
  checkUser: function () {
    let user_data = sessionStorage.getItem("user_data");
    if (user_data) {
      return true
      // return new Promise(function (resolve) {
      //   axios.get(host() + "/user/checkSession", { params: JSON.parse(user_data) }).then(function (json) {
      //     resolve(json)
      //     return true;
      //   }).catch(e => {
      //     // loginHelpers.logout()
      //     NotificationManager.error(e.message, "Timeout error", 1800);
      //     return setTimeout(function () {
      //       window.location.replace("/")
      //     }, 2000)
      //   })
      // })
    }
  },
  logout: function () {
    debugger
    sessionStorage.removeItem("user_data");
  },
  check_usertype: function () {
    let user_data = sessionStorage.getItem("user_data");
    if (user_data) {
      let user = JSON.parse(user_data)
      if (user.user_type == "admin") {
        return true
      }
    } else {
      // loginHelpers.logout()
      // NotificationManager.error("Forbidden", "You are not eligible to access this page", 1800);
       setTimeout(function () {
        window.location.replace("/")
      }, 2000)
    }
  }
};
export default loginHelpers;
export const host = function () {
  let host = window.location.hostname;
  if (host === "13.251.49.54") {
    return "http://13.251.49.54:82";
  } else {
    return "http://localhost:3000";
  }
  return host;
};
