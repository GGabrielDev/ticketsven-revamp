import { Typography, Box } from "@mui/material"
import { useAppSelector } from "../redux/hooks"
import { selectors } from "../redux/features/user/userSlice"

const { selectUser } = selectors

export default function LegalDashboard() {
  const user = useAppSelector(selectUser)

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel Legal
      </Typography>
      <Typography variant="body1">
        Bienvenido/a {user?.fullname || "Usuario Legal"}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Esta es la sección para el personal legal del sistema VEN911.
      </Typography>
    </Box>
  )
}
