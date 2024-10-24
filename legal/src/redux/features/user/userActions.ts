import { createAsyncThunk } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import axios, { axiosConfig } from "../../../helper/Axios"

import type { RootState } from "../../store"

export const asyncActions = {
  loginUser: createAsyncThunk<
    string,
    Record<"username" | "password", string>,
    { state: RootState; rejectValue: ErrorType }
  >("user/login", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.post("/auth/login", payload)).data.token as string
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  logout: createAsyncThunk("user/logout", async () => {
    // Set the token to an empty string in local storage
    localStorage.setItem("user/token", "")

    // Use useNavigate to navigate to the desired route after logout
    const navigate = useNavigate()
    navigate("/") // Replace '/' with the desired route after logout
  }),
  getUser: createAsyncThunk<
    UserType,
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("user/get", async (_, { getState, rejectWithValue }) => {
    try {
      return (await axios.get("/user", axiosConfig(getState().user.token))).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  getAllUsers: createAsyncThunk<
    UserType[],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("user/getAll", async (_, { getState, rejectWithValue }) => {
    try {
      return (await axios.get("/user/all", axiosConfig(getState().user.token)))
        .data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  getRoles: createAsyncThunk<
    RoleType[],
    undefined,
    { state: RootState; rejectValue: ErrorType }
  >("user/getRoles", async (_, { getState, rejectWithValue }) => {
    try {
      return (await axios.get("/role", axiosConfig(getState().user.token))).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  createUser: createAsyncThunk<
    UserType,
    Partial<UserType> & { roleId: number },
    { state: RootState; rejectValue: ErrorType }
  >("user/post", async (payload, { getState, rejectWithValue }) => {
    try {
      return (
        await axios.post("/user", payload, axiosConfig(getState().user.token))
      ).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  editUser: createAsyncThunk<
    UserType,
    Partial<UserType> & { roleId: number },
    { state: RootState; rejectValue: ErrorType }
  >("user/put", async (payload, { getState, rejectWithValue }) => {
    try {
      return (
        await axios.put(
          `/user/${payload.id}`,
          payload,
          axiosConfig(getState().user.token),
        )
      ).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
  deleteUser: createAsyncThunk<
    string,
    UserType,
    { state: RootState; rejectValue: ErrorType }
  >("user/delete", async (payload, { getState, rejectWithValue }) => {
    try {
      return (
        await axios.delete(
          `/user/${payload.id}`,
          axiosConfig(getState().user.token),
        )
      ).data
    } catch (error: any) {
      return rejectWithValue(error.response.data)
    }
  }),
}
