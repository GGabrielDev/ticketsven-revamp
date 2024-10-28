import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../../helper/Axios"

export const asyncActions = {
  getAllContacts: createAsyncThunk<
    ContactType[],
    undefined,
    { rejectValue: ErrorType }
  >("contact/getAll", async (_, { rejectWithValue }) => {
    try {
      return (await axios.get("/contact")).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  getContactsByName: createAsyncThunk<
    ContactType[],
    string,
    { rejectValue: ErrorType }
  >("contact/getByName", async (payload, { rejectWithValue }) => {
    try {
      return (
        await axios.get("/contact", {
          data: {
            name: payload,
          },
        })
      ).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  getContactsByPhoneNumber: createAsyncThunk<
    ContactType[],
    string,
    { rejectValue: ErrorType }
  >("contact/getByPhoneNumber", async (payload, { rejectWithValue }) => {
    try {
      return (
        await axios.get("/contact", {
          data: {
            phone_number: payload,
          },
        })
      ).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  getContactById: createAsyncThunk<
    ContactType,
    number,
    { rejectValue: ErrorType }
  >("contact/getById", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.get(`/contact/${payload}`)).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  createContact: createAsyncThunk<
    ContactType,
    Partial<ContactType>,
    { rejectValue: ErrorType }
  >("contact/post", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.post("/contact", payload)).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  editContact: createAsyncThunk<
    ContactType,
    ContactType,
    { rejectValue: ErrorType }
  >("contact/put", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.put(`/contact/${payload.id}`, payload)).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  deleteContact: createAsyncThunk<
    string,
    ContactType,
    { rejectValue: ErrorType }
  >("contact/delete", async (payload, { rejectWithValue }) => {
    try {
      await axios.delete(`/contact/${payload.id}`)
      return payload.id
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
}
