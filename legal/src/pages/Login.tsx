import * as React from "react"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import FormLabel from "@mui/material/FormLabel"
import FormControl from "@mui/material/FormControl"
import TextField from "@mui/material/TextField"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import MuiCard from "@mui/material/Card"
import { styled } from "@mui/material/styles"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { actions, selectors } from "../redux/features/user/userSlice"

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}))

export default function Login() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectors.selectStatus)
  const error = useAppSelector(selectors.selectError)
  const [usernameError, setUsernameError] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const username = formData.get("username")?.toString() || ""
    const password = formData.get("password")?.toString() || ""

    // Simple validation
    const isValid = [username, password].every(field => field.trim().length > 0)

    setUsernameError(!username.trim())
    setPasswordError(!password.trim())

    if (isValid) {
      dispatch(actions.loginUser({ username, password }))
    }
  }

  return (
    <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Iniciar Sesión
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="username">Nombre de usuario</FormLabel>
            <TextField
              error={usernameError}
              helperText={usernameError && "Este campo es obligatorio"}
              id="username"
              name="username"
              placeholder="Usuario"
              autoComplete="username"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Contraseña</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordError && "Este campo es obligatorio"}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>

          {error && (
            <Typography color="error" variant="body2">
              {error.message}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={status === "Loading"}
          >
            {status === "Loading" ? "Cargando..." : "Acceder"}
          </Button>
        </Box>
      </Card>
    </SignInContainer>
  )
}
