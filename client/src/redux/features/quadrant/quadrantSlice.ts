import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SliceType = {};

const initialState: SliceType = {};

const quadrantSlice = createSlice({
  name: "quadrant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

const {} = quadrantSlice.actions;

export const actions = {};
export const selectors = {};
export const helpers = {};

export default quadrantSlice.reducer;
