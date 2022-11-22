import { html } from "htm/preact";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import ResponsiveAppBar from "./ResponsiveAppBar";

function Layout() {
  return html`
    <${ResponsiveAppBar} />
    <${Box}
      sx=${{
        width: 1,
        p: 2,
      }}
      ><${Outlet}
    /><//>
  `;
}

export default Layout;
