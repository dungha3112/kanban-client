import { getApi, postApi, putAPI } from "./axiosClient";

const userApi = {
  updateInfo: (data, token) => putAPI(`user/update-info`, data, token),
  updatePassword: (data, token) => putAPI(`user/update-password`, data, token),
};

export default userApi;
