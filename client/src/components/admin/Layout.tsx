import { html } from "htm/preact";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminAppBar from "./AppBar";

function Layout() {
  return html`
    <${AdminAppBar} />
    <${Box} sx=${{ m: 1 }}>
      <${Outlet} />
    <//>
  `;
}

export default Layout;
