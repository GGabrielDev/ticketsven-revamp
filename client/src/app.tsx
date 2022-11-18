import { html } from "htm/preact";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";

export function App() {
  return html`
    <div>
      <${CssBaseline} />
      <${Button} variant="outlined">Hello World<//>
    </div>
  `;
}
