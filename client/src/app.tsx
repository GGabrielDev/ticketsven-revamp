import { html } from "htm/preact";
import { CssBaseline, Button } from "@mui/material";

export function App() {
  return html`
    <div>
      <${CssBaseline} />
      <${Button} variant="outlined">Hello World<//>
    </div>
  `;
}
