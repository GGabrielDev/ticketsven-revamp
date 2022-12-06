import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../helpers/Axios";
import { ErrorType, UserType } from "./userSlice";
import { RootState } from "../../store";

export const asyncActions = {
  loginUser: createAsyncThunk<
    string,
    Record<"username" | "password", string>,
    { state: RootState }
  >("user/login", async (payload, { rejectWithValue }) => {
    try {
      return (await axios.post("/auth/login", payload)).data.token as string;
    } catch (error: any) {
      return rejectWithValue(error.response.data as ErrorType);
    }
  }),
  getUser: createAsyncThunk<UserType, undefined, { state: RootState }>(
    "user/getUser",
    async (_, { getState, rejectWithValue }) => {
      try {
        const token = getState().user.token; // Get the token from the state
        return (
          await axios.get("/user/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        ).data;
      } catch (error: any) {
        return rejectWithValue(error.response.data as ErrorType);
      }
    }
  ),
};
