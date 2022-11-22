import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SliceType = {};

const initialState: SliceType = {};

const parishSlice = createSlice({
  name: "parish",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

const {} = parishSlice.actions;

export const actions = {};
export const selectors = {};
export const helpers = {};

export default parishSlice.reducer;
