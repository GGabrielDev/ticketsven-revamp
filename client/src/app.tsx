import { html } from "htm/preact";
import { CssBaseline } from "@mui/material";
import ResponsiveAppBar from "./components/ResponsiveAppBar";

export function App() {
  return html`
    <div>
      <${CssBaseline} />
      <${ResponsiveAppBar} />
    </div>
  `;
}
