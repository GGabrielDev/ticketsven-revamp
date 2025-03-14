import { Box, Typography, Button } from "@mui/material"
import { useAppDispatch } from "../redux/hooks"
import { actions } from "../redux/features/user/userSlice"

export default function UnauthorizedRole() {
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(actions.logout())
    dispatch(actions.clearUserState())
  }

  return (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Acceso no autorizado
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Su rol actual no tiene una sección asignada en el sistema.
      </Typography>
      <Button variant="contained" color="error" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </Box>
  )
}
