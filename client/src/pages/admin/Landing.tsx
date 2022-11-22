import { html } from "htm/preact";
import { Typography } from "@mui/material";

function Landing() {
  return html`
    <${Typography} variant="h1">Welcome Admin, to the Landing Page<//>
  `;
}

export default Landing;
