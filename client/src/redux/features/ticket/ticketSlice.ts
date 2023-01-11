import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { asyncActions } from "./ticketActions";

export type SliceType = {
  status: "Idle" | "Loading" | "Success" | "Error";
  error?: ErrorType;
};

export const initialState = {
  status: "Idle",
} as SliceType;

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {
    clearStatus: (state) => {
      state.status = "Idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncActions.postTicketOperator.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.postTicketOperator.fulfilled, (state) => {
        state.status = "Success";
        state.error = undefined;
      })
      .addCase(asyncActions.postTicketOperator.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      });
  },
});

export const actions = {
  ...ticketSlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectError: (state: RootState) => state.ticket.error,
  selectStatus: (state: RootState) => state.ticket.status,
};

export default ticketSlice.reducer;
