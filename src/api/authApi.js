import { getApi, postApi, putAPI } from "./axiosClient";

const authApi = {
  login: (data) => postApi("auth/login", data, {}),
  register: (data) => postApi("auth/register", data, null),
  activeEmail: (data) => postApi("auth/active-email", data, null),

  refreshToken: () => getApi("auth/refresh_token", null),

  forgotPassword: (data) => postApi(`auth/forgot-password`, data, null),
  resetPassword: (data) => postApi(`auth/reset-password`, data, {}),

  logout: (token) => postApi("auth/logout", {}, token),

  updateInfo: (data) => putAPI(`user/update-info`, data, data.token),
  updatePassword: (data) =>
    putAPI(`user/update-password`, { password: data.password }, data.token),
};

export default authApi;
