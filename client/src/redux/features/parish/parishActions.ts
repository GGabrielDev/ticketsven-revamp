import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../helpers/Axios";
import { RootState } from "../../store";

export const asyncActions = {
  getAllParishes: createAsyncThunk<
    ParishType[],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("parish/getAll", async (_, { rejectWithValue }) => {
    try {
      return (await axios.get("/parish")).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getParishesByName: createAsyncThunk<
    ParishType[],
    string,
    { state: RootState; rejectValue: ErrorType }
  >("parish/getByName", async (payload, { rejectWithValue }) => {
    try {
      return (
        await axios.get("/parish", {
          data: {
            name: payload,
          },
        })
      ).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  getParishById: createAsyncThunk<
    ParishType,
    number,
    { state: RootState; rejectValue: ErrorType }
  >("parish/getById", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.get(`/parish/${payload}`)).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  createParish: createAsyncThunk<
    ParishType,
    Partial<ParishType>,
    { state: RootState; rejectValue: ErrorType }
  >("parish/post", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.post("/parish", payload)).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  editParish: createAsyncThunk<
    ParishType,
    ParishType,
    { state: RootState; rejectValue: ErrorType }
  >("parish/put", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.put(`/parish/${payload.id}`, payload)).data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
  deleteParish: createAsyncThunk<
    number,
    ParishType,
    { state: RootState; rejectValue: ErrorType }
  >("parish/delete", async (payload, { rejectWithValue }) => {
    try {
      await axios.delete(`/parish/${payload.id}`);
      return payload.id;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
};
