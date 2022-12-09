import { html } from "htm/preact";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import ThemeProvider from "./components/ThemeProvider";
import Router from "./router";

export function App() {
  return html`
    <${Provider} store=${store}>
      <${ThemeProvider}>
        <${CssBaseline} />
        <${Router} />
      <//>
    <//>
  `;
}
