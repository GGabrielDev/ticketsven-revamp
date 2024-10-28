import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../../helper/Axios"

export const asyncActions = {
  getAllOrganismGroups: createAsyncThunk<
    OrganismGroupType[],
    undefined,
    { rejectValue: ErrorType }
  >("organismGroup/get", async (_, { rejectWithValue }) => {
    try {
      return (await axios.get("/organismGroup")).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  createOrganismGroup: createAsyncThunk<
    OrganismGroupType,
    Partial<OrganismGroupType>,
    { rejectValue: ErrorType }
  >("organismGroup/post", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.post("/organismGroup", payload)).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  editOrganismGroup: createAsyncThunk<
    OrganismGroupType,
    OrganismGroupType,
    { rejectValue: ErrorType }
  >("organismGroup/put", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.put(`/organismGroup/${payload.id}`, payload)).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  deleteOrganismGroup: createAsyncThunk<
    OrganismGroupType["id"],
    OrganismGroupType,
    { rejectValue: ErrorType }
  >("organismGroup/delete", async (payload, { rejectWithValue }) => {
    try {
      await axios.delete(`/organismGroup/${payload.id}`)
      return payload.id
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
}
