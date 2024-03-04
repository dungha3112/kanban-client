import authApi from "../api/authApi";

const authUtils = {
  isAuthenticated: async () => {
    const token = () => localStorage.getItem("logged");
    // const token = localStorage.getItem("logged");
    if (token !== "success") {
      return false;
    }
    return true;
  },
};

export default authUtils;
