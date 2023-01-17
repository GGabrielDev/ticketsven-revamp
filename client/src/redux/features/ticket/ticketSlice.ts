import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";
import { asyncActions } from "./ticketActions";

export type SliceType = {
  status: "Idle" | "Loading" | "Success" | "Error";
  ticket?: TicketType;
  tickets: MiniTicket[];
  error?: ErrorType;
};

export const initialState: SliceType = {
  error: undefined,
  status: "Idle",
  ticket: undefined,
  tickets: [],
};

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
      })
      .addCase(asyncActions.putTicketUpdateDispatcher.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.putTicketUpdateDispatcher.fulfilled, (state) => {
        state.status = "Success";
        state.error = undefined;
      })
      .addCase(
        asyncActions.putTicketUpdateDispatcher.rejected,
        (state, action) => {
          state.status = "Error";
          state.error = action.payload;
        }
      )
      .addCase(asyncActions.getTicketsDispatcher.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getTicketsDispatcher.fulfilled, (state, action) => {
        state.status = "Success";
        state.error = undefined;
        state.tickets = action.payload;
      })
      .addCase(asyncActions.getTicketsDispatcher.rejected, (state, action) => {
        state.status = "Error";
        state.error = action.payload;
      })
      .addCase(asyncActions.getTicket.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getTicket.fulfilled, (state, action) => {
        state.status = "Success";
        state.error = undefined;
        state.ticket = action.payload;
      })
      .addCase(asyncActions.getTicket.rejected, (state, action) => {
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
  selectTicket: (state: RootState) => state.ticket.ticket,
  selectTickets: (state: RootState) => state.ticket.tickets,
};

export default ticketSlice.reducer;
