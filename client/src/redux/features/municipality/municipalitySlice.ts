import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SliceType = {};

const initialState: SliceType = {};

const municipalitySlice = createSlice({
  name: "municipality",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

const {} = municipalitySlice.actions;

export const actions = {};
export const selectors = {};
export const helpers = {};

export default municipalitySlice.reducer;
