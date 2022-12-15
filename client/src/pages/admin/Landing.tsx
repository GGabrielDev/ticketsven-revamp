import { useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { Typography } from "@mui/material";
import { useAppDispatch } from "../../redux/hooks";
import { actions as municipalityActions } from "../../redux/features/municipality/municipalitySlice";
import { actions as parishActions } from "../../redux/features/parish/parishSlice";

const { getAllMunicipalities } = municipalityActions;
const { getAllParishes } = parishActions;

function Landing() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllMunicipalities());
    dispatch(getAllParishes());
  }, []);

  return html`
    <${Typography} variant="h1">Welcome Admin, to the Landing Page<//>
  `;
}

export default Landing;
