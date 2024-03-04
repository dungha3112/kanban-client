import { deleteAPI, postApi, putAPI } from "./axiosClient";

const taskApi = {
  create: async (boardId, data, token) => {
    return await postApi(`boards/${boardId}/tasks`, data, token);
  },
  updatePosition: async (boardId, data, token) => {
    return await putAPI(`boards/${boardId}/tasks/update-position`, data, token);
  },
  deleteTaskById: async (boardId, taskId, token) => {
    return await deleteAPI(`boards/${boardId}/tasks/${taskId}`, token);
  },
  updateTaskById: async (boardId, taskId, data, token) => {
    return await putAPI(`boards/${boardId}/tasks/${taskId}`, data, token);
  },
};

export default taskApi;
