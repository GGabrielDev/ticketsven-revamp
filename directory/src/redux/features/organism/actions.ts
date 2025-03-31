import { createAsyncThunk } from "@reduxjs/toolkit"
import axios, { axiosConfig } from "../../../helper/Axios"

import type { RootState } from "../../store"

export const asyncActions = {
  getAllOrganisms: createAsyncThunk<
    OrganismType[],
    undefined,
    { rejectValue: ErrorType }
  >("organism/getAll", async (_, { rejectWithValue }) => {
    try {
      return (await axios.get("/organism")).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  getOrganismsByGroup: createAsyncThunk<
    OrganismType[],
    number,
    { state: RootState; rejectValue: ErrorType }
  >("organism/getByGroup", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.get("/organism/organismGroup", {
          ...axiosConfig(getState().user.token),
          params: {
            organismGroupId: payload,
          },
        })
      ).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  createOrganism: createAsyncThunk<
    OrganismType,
    Partial<OrganismType>,
    { state: RootState; rejectValue: ErrorType }
  >("organism/post", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.post(
          "/organism",
          payload,
          axiosConfig(getState().user.token),
        )
      ).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  editOrganism: createAsyncThunk<
    OrganismType,
    OrganismType,
    { state: RootState; rejectValue: ErrorType }
  >("organism/put", async (payload, { rejectWithValue, getState }) => {
    try {
      return (
        await axios.put(
          `/organism/${payload.id}`,
          payload,
          axiosConfig(getState().user.token),
        )
      ).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  deleteOrganism: createAsyncThunk<
    string,
    OrganismType,
    { state: RootState; rejectValue: ErrorType }
  >("organism/delete", async (payload, { rejectWithValue, getState }) => {
    try {
      await axios.delete(
        `/organism/${payload.id}`,
        axiosConfig(getState().user.token),
      )
      return payload.id
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
}
