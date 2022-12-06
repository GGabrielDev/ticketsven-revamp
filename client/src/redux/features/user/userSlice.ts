import { createSlice } from "@reduxjs/toolkit";
import { asyncActions } from "./userActions";
import { RootState } from "../../store";

export type UserType = {
  id: string;
  username: string;
  fullname: string;
  role: {
    id: number;
    name: "admin" | "supervisor" | "dispatcher" | "operator";
  };
};

export type ErrorType = {
  status: number;
  message: string;
};

export type SliceType = {
  status: "Idle" | "Loading" | "Login" | "Logout" | "Error";
  token?: string;
  user?: UserType;
  error?: ErrorType;
  theme: "light" | "dark";
};

export const initialState = {
  status: "Idle",
  token: sessionStorage.getItem("user/token"),
  theme:
    sessionStorage.getItem("user/theme") === null
      ? "light"
      : sessionStorage.getItem("user/theme"),
} as SliceType;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearToken: (state) => {
      // Set the token to an empty string in the store
      state.token = "";

      // Set the token to an empty string in session storage
      sessionStorage.setItem("token", "");
    },
		toggleColorTheme: (state) => {
			state.theme === 'light' ? 'dark' : 'light'
		}
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncActions.loginUser.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.loginUser.fulfilled, (state, action) => {
        sessionStorage.setItem("user/token", action.payload);
        state.token = action.payload;
        state.status = "Login";
      })
      .addCase(asyncActions.loginUser.rejected, (state, action) => {
        console.log(action);
        state.error = action.payload as ErrorType;
        state.status = "Error";
      })
      .addCase(asyncActions.getUser.pending, (state) => {
        state.status = "Loading";
      })
      .addCase(asyncActions.getUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "Login";
      })
      .addCase(asyncActions.getUser.rejected, (state, action) => {
        console.log(action);
        state.error = action.payload as ErrorType;
        state.status = "Error";
      });
  },
});

export const actions = {
  ...userSlice.actions,
  ...asyncActions,
};
export const selectors = {
  selectUser: (state: RootState) => state.user.user,
  selectStatus: (state: RootState) => state.user.status,
  selectError: (state: RootState) => state.user.error,
  selectToken: (state: RootState) => state.user.token,
  selectTheme: (state: RootState) => state.user.theme,
};
export const helpers = {};

export default userSlice.reducer;
