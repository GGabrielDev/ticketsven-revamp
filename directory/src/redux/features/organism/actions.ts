import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../../helper/Axios"

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
    { rejectValue: ErrorType }
  >("organism/getByGroup", async (payload, { rejectWithValue }) => {
    try {
      return (
        await axios.get("/organism/organismGroup", {
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
    { rejectValue: ErrorType }
  >("organism/post", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.post("/organism", payload)).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  editOrganism: createAsyncThunk<
    OrganismType,
    OrganismType,
    { rejectValue: ErrorType }
  >("organism/put", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.put(`/organism/${payload.id}`, payload)).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  deleteOrganism: createAsyncThunk<
    OrganismType["id"],
    OrganismType,
    { rejectValue: ErrorType }
  >("organism/delete", async (payload, { rejectWithValue }) => {
    try {
      await axios.delete(`/organism/${payload.id}`)
      return payload.id
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
}
