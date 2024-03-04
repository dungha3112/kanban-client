import { deleteAPI, getApi, postApi, putAPI } from "./axiosClient";

const boardApi = {
  create: async (token) => {
    return await postApi(`boards`, {}, token);
  },
  getAll: async (token) => {
    return await getApi(`boards`, token);
  },
  updatePosition: async (data, token) => {
    return await putAPI(`boards`, data, token);
  },
  getBoardById: async (id, token) => {
    return await getApi(`boards/${id}`, token);
  },
  updateBoardById: async (id, data, token) => {
    return await putAPI(`boards/${id}`, data, token);
  },
  deleteBoardById: async (id, token) => {
    return await deleteAPI(`boards/${id}`, token);
  },
  getFavourites: async (token) => {
    return await getApi(`boards/favourites`, token);
  },
  updateFavouritePosition: async (data, token) => {
    return await putAPI(`boards/favourites`, data, token);
  },
};

export default boardApi;
