import { deleteAPI, postApi, putAPI } from "./axiosClient";

const sectionApi = {
  create: async (boardId, token) => {
    return await postApi(`boards/${boardId}/sections`, {}, token);
  },
  update: async (boardId, sectionId, data, token) => {
    return await putAPI(`boards/${boardId}/sections/${sectionId}`, data, token);
  },
  delete: async (boardId, sectionId, token) => {
    return await deleteAPI(`boards/${boardId}/sections/${sectionId}`, token);
  },
};

export default sectionApi;
