import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { axiosConfig } from "../../../helpers/Axios";
import { RootState } from "../../store";

export const asyncActions = {
  postTicketOperator: createAsyncThunk<
    TicketType,
    Partial<TicketType>,
    { state: RootState; rejectValue: ErrorType }
  >("ticket/postOperator", async (payload, { rejectWithValue, getState }) => {
    try {
      return await axios.post(
        "/ticket",
        payload,
        axiosConfig(getState().user.token)
      );
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }),
};
