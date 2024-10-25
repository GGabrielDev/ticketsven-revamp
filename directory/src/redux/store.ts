import { configureStore } from "@reduxjs/toolkit"
import contactReducer from "./features/contacts/contatcSlice"

export const store = configureStore({
  reducer: {
    contact: contactReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"]
