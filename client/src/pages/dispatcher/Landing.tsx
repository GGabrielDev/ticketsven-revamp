import { html } from "htm/preact";
import { Box, Container, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { useAppSelector } from "../../redux/hooks";
import { selectors } from "../../redux/features/user/userSlice";

const { selectUser } = selectors;

export default function Landing() {
  const user = useAppSelector(selectUser);

  return html`
    <${Container}
      maxWidth="sm"
      sx=${{
        display: "flex",
        flexFlow: "column wrap",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 84.5px)",
      }}
    >
      <${Box} sx=${{ mb: 2 }}>
        <${Typography} variant="h4" textAlign="center">
          Bienvenido, Despachador:
        <//>
        <${Typography} variant="h4" textAlign="center" color="secondary">
          ${user?.fullname}
        <//>
      <//>
      <${Box} sx=${{ mb: 2 }}>
        <${Typography} variand="h6" textAlign="center" color=${blue[500]}>
          Seleccione una de las solicitudes de la lista para comenzar
        <//>
      <//>
    <//>
  `;
}
