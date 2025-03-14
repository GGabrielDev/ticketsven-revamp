import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import { CssBaseline } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Provider } from "react-redux"

import ThemeProvider from "./components/ThemeProvider"
import { store } from "./redux/store"
import AppRouter from "./router"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>VEN 9-1-1</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div style={{ minHeight: "100vh" }}>
          <Provider store={store}>
            <ThemeProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <CssBaseline />
                <AppRouter />
              </LocalizationProvider>
            </ThemeProvider>
          </Provider>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return <Outlet />
}
