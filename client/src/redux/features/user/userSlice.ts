import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export type SliceType = {};

const initialState: SliceType = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

const {} = userSlice.actions;

export const actions = {};
export const selectors = {};
export const helpers = {};

export default userSlice.reducer;
