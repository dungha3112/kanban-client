import { createAction, createSlice } from "@reduxjs/toolkit";

const initialState = { value: [] };

export const resetStateBoard = createAction("Reset_state_boards");

export const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoards: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetStateBoard, (state) => {
      state.value = [];
    });
  },
});

export const { setBoards } = boardSlice.actions;

export default boardSlice.reducer;
