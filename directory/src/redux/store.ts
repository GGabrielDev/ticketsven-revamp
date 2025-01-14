import { configureStore } from "@reduxjs/toolkit"
import contactReducer from "./features/contacts"
import organismReducer from "./features/organism"
import organismGroupReducer from "./features/organismGroup"
import userReducer from "./features/user"

export const store = configureStore({
  reducer: {
    contact: contactReducer,
    organism: organismReducer,
    organismGroup: organismGroupReducer,
    user: userReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"]
