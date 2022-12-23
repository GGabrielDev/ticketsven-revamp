import { useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminAppBar from "./AppBar";
import { useAppDispatch } from "../../redux/hooks";
import { actions as municipalityActions } from "../../redux/features/municipality/municipalitySlice";
import { actions as parishActions } from "../../redux/features/parish/parishSlice";
import { actions as ccpActions } from "../../redux/features/ccp/ccpSlice";
import { actions as quadrantActions } from "../../redux/features/quadrant/quadrantSlice";
import { actions as reasonActions } from "../../redux/features/reason/reasonSlice";
import { actions as userActions } from "../../redux/features/user/userSlice";

const { getAllMunicipalities } = municipalityActions;
const { getAllParishes } = parishActions;
const { getAllCCPs } = ccpActions;
const { getAllQuadrants } = quadrantActions;
const { getAllReasons } = reasonActions;
const { getAllUsers, getRoles } = userActions;

function Layout() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllMunicipalities());
    dispatch(getAllParishes());
    dispatch(getAllCCPs());
    dispatch(getAllQuadrants());
    dispatch(getAllReasons());
    dispatch(getAllUsers());
    dispatch(getRoles());
  }, []);

  return html`
    <${AdminAppBar} />
    <${Box} sx=${{ m: 1 }}>
      <${Outlet} />
    <//>
  `;
}

export default Layout;
