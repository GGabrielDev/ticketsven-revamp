import React from "react"
import { CssBaseline } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { createRoot } from "react-dom/client"

import ThemeProvider from "./components/ThemeProvider"
import App from "./App"

import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </LocalizationProvider>
    </React.StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
