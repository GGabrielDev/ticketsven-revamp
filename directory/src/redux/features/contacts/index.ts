import { createSlice } from "@reduxjs/toolkit"
import { asyncActions } from "./actions"

import type { RootState } from "../../store"

export type SliceType = {
  status: "Idle" | "Loading" | "Error"
  contacts: ContactType[]
  contact?: ContactType
  sort?: "Name/Asc" | "Name/Dsc"
  error?: ErrorType
}

const initialState: SliceType = {
  status: "Idle",
  contacts: [],
}

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    sortByName: state => {
      const arr = [...state.contacts]
      switch (state.sort) {
        case "Name/Asc":
          state.sort = "Name/Dsc"
          state.contacts = arr.sort((a, b) =>
            b.name > a.name ? 1 : a.name > b.name ? -1 : 0,
          )
          break
        case "Name/Dsc":
          state.sort = "Name/Asc"
          state.contacts = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
          )
          break
        default:
          state.sort = "Name/Asc"
          state.contacts = arr.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0,
          )
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(asyncActions.getAllContacts.pending, state => {
        state.status = "Loading"
      })
      .addCase(asyncActions.getAllContacts.fulfilled, (state, action) => {
        state.status = "Idle"
        state.error = undefined
        state.contacts = action.payload
      })
      .addCase(asyncActions.getAllContacts.rejected, (state, action) => {
        state.status = "Error"
        state.error = action.payload
      })
      .addCase(asyncActions.getContactsByName.pending, state => {
        state.status = "Loading"
      })
      .addCase(asyncActions.getContactsByName.fulfilled, (state, action) => {
        state.status = "Idle"
        state.error = undefined
        state.contacts = action.payload
      })
      .addCase(asyncActions.getContactsByName.rejected, (state, action) => {
        state.status = "Error"
        state.error = action.payload
      })
      .addCase(asyncActions.getContactsByPhoneNumber.pending, state => {
        state.status = "Loading"
      })
      .addCase(
        asyncActions.getContactsByPhoneNumber.fulfilled,
        (state, action) => {
          state.status = "Idle"
          state.error = undefined
          state.contacts = action.payload
        },
      )
      .addCase(
        asyncActions.getContactsByPhoneNumber.rejected,
        (state, action) => {
          state.status = "Error"
          state.error = action.payload
        },
      )
      .addCase(asyncActions.getContactById.pending, state => {
        state.status = "Loading"
      })
      .addCase(asyncActions.getContactById.fulfilled, (state, action) => {
        state.status = "Idle"
        state.error = undefined
        state.contact = action.payload
      })
      .addCase(asyncActions.getContactById.rejected, (state, action) => {
        state.status = "Error"
        state.error = action.payload
      })
      .addCase(asyncActions.createContact.pending, state => {
        state.status = "Loading"
      })
      .addCase(asyncActions.createContact.fulfilled, (state, action) => {
        state.status = "Idle"
        state.error = undefined
        state.contacts = [...state.contacts, action.payload]
      })
      .addCase(asyncActions.createContact.rejected, (state, action) => {
        state.status = "Error"
        state.error = action.payload
      })
      .addCase(asyncActions.editContact.pending, state => {
        state.status = "Loading"
      })
      .addCase(asyncActions.editContact.fulfilled, (state, action) => {
        state.status = "Idle"
        state.contacts = state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact,
        )
      })
      .addCase(asyncActions.editContact.rejected, (state, action) => {
        state.error = action.payload
        state.status = "Error"
      })
      .addCase(asyncActions.deleteContact.pending, state => {
        state.status = "Loading"
      })
      .addCase(asyncActions.deleteContact.fulfilled, (state, action) => {
        state.status = "Idle"
        state.error = undefined
        state.contacts = state.contacts.filter(
          contact => contact.id !== action.payload,
        )
      })
      .addCase(asyncActions.deleteContact.rejected, (state, action) => {
        state.status = "Error"
        state.error = action.payload
      })
  },
})

export const actions = {
  ...contactSlice.actions,
  ...asyncActions,
}
export const selectors = {
  selectContacts: (state: RootState) => state.contact.contacts,
  selectContact: (state: RootState) => state.contact.contact,
  selectStatus: (state: RootState) => state.contact.status,
  selectSort: (state: RootState) => state.contact.sort,
  selectError: (state: RootState) => state.contact.error,
}

export default contactSlice.reducer
