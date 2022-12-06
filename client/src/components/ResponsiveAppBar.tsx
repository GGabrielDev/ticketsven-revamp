import { useState } from "preact/hooks";
import { html } from "htm/preact";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon, Person } from "@mui/icons-material";
import Logo from "../assets/logo.png";

const pages = [
  { name: "Municipios", link: "/municipality" },
  { name: "Parroquias", link: "/parish" },
  { name: "CCPs", link: "/ccp" },
  { name: "Cuadrantes", link: "/quadrant" },
  { name: "Razones", link: "/reasons" },
  { name: "Usuarios", link: "/users" },
];
const settings = ["Profile", "Dashboard", "Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | EventTarget>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | EventTarget>(null);

  const handleOpenNavMenu = (event: MouseEvent) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return html`
    <${AppBar} position="static" sx=${{ p: 1, display: "flex" }}>
      <${Container} maxWidth="xl">
        <${Toolbar} disableGutters>
          <${Box}
            component="img"
            href="/"
            sx=${{
              height: 64,
              display: { xs: "none", md: "flex" },
              mr: 1,
            }}
            alt="Your logo."
            src=${Logo}
          />
          <${Box} sx=${{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <${IconButton}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick=${handleOpenNavMenu}
              color="inherit"
            >
              <${MenuIcon} />
            <//>
            <${Menu}
              id="menu-appbar"
              anchorEl=${anchorElNav}
              anchorOrigin=${{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin=${{
                vertical: "top",
                horizontal: "left",
              }}
              open=${Boolean(anchorElNav)}
              onClose=${handleCloseNavMenu}
              sx=${{
                display: { xs: "block", md: "none" },
              }}
            >
              ${pages.map(
                (page) => html`
                  <${MenuItem} key=${page.name} onClick=${handleCloseNavMenu}>
                    <${Typography} textAlign="center">${page.name}<//>
                  <//>
                `
              )}
            <//>
          <//>
          <${Box}
            sx=${{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              mr: 1,
            }}
          >
            <${Box}
              component="img"
              href="/"
              sx=${{
                height: 64,
              }}
              alt="Your logo."
              src=${Logo}
            />
          <//>
          <${Box} sx=${{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            ${pages.map(
              (page) => html`
                <${Button}
                  key=${page.name}
                  onClick=${handleCloseNavMenu}
                  sx=${{ my: 2, color: "white", display: "block" }}
                >
                  ${page.name}
                <//>
              `
            )}
          <//>

          <${Box} sx=${{ flexGrow: 0 }}>
            <${Tooltip} title="Open settings">
              <${IconButton}
                onClick=${handleOpenUserMenu}
                sx=${{ p: 0, color: "inherit" }}
              >
                <${Person} />
              <//>
            <//>
            <${Menu}
              sx=${{ mt: "45px" }}
              id="menu-appbar"
              anchorEl=${anchorElUser}
              anchorOrigin=${{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin=${{
                vertical: "top",
                horizontal: "right",
              }}
              open=${Boolean(anchorElUser)}
              onClose=${handleCloseUserMenu}
            >
              ${settings.map(
                (setting) => html`
                  <${MenuItem} key=${setting} onClick=${handleCloseUserMenu}>
                    <${Typography} textAlign="center">${setting}<//>
                  <//>
                `
              )}
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}
export default ResponsiveAppBar;
