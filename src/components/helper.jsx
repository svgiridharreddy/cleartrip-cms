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
