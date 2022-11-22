import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SliceType = {};

const initialState: SliceType = {};

const ccpSlice = createSlice({
  name: "ccp",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

const {} = ccpSlice.actions;

export const actions = {};
export const selectors = {};
export const helpers = {};

export default ccpSlice.reducer;
