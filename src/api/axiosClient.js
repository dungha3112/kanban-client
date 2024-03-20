import axios from "axios";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : process.env.REACT_APP_DEV_API_URL;

// ------------------------------------------------
// ------------------------------------------------
// ------------------------------------------------

export const axiosClients = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export const postApi = async (url, data, token) => {
  const res = await axiosClients.post(`${url}`, data, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getApi = async (url, token) => {
  const res = await axiosClients.get(`${url}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const patchAPI = async (url, data, token) => {
  const res = await axiosClients.patch(`${url}`, data, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const putAPI = async (url, data, token) => {
  const res = await axiosClients.put(`${url}`, data, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteAPI = async (url, token) => {
  const res = await axiosClients.delete(`${url}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
