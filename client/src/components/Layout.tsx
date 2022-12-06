import { html } from "htm/preact";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectors } from "../redux/features/user/userSlice";
import AdminAppBar from "./ResponsiveAppBar";

const { selectUser } = selectors;

function Layout() {
  const user = useAppSelector(selectUser);

  return html`
    ${() => {
      if (user)
        switch (user.role.name) {
          case "admin":
            return html`<${AdminAppBar} />`;
        }
    }}
    <${Box} sx=${{ width: 1 }}>
      <${Outlet} />
    <//>
  `;
}

export default Layout;
