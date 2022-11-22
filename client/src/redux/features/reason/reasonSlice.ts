import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SliceType = {};

const initialState: SliceType = {};

const reasonSlice = createSlice({
  name: "reason",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

const {} = reasonSlice.actions;

export const actions = {};
export const selectors = {};
export const helpers = {};

export default reasonSlice.reducer;
