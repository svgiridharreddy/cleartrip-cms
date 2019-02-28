const loginHelpers = {
  checkUser: function() {
    let user_data = sessionStorage.getItem("user_data");
    if (user_data) {
      return true;
    }
    return false;
  },
  logout: function() {
    sessionStorage.removeItem("user_data");
  }
};
export default loginHelpers;
export const host = function() {
  debugger;
  let host = window.location.hostname;
  if (host === "13.251.49.54") {
    return "http://13.251.49.54:82";
  } else {
    debugger;
    return "http://localhost:3000";
  }
  return host;
};
