import { html } from "htm/preact";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import Router from "./router";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export function App() {
  return html`
    <${ThemeProvider} theme=${theme}>
      <${CssBaseline} />
			<${Router} />
    </div>
  `;
}
