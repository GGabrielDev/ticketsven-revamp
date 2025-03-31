import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormHelperText,
  CircularProgress,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useFormik } from "formik"
import * as yup from "yup"

import type { FormikHelpers } from "formik"

import { actions as userActions } from "../../redux/features/user"
import { useAppDispatch } from "../../redux/hooks"

type FormData = Record<"username" | "password", string>

const { loginUser } = userActions

const validationSchema = yup.object({
  username: yup
    .string()
    .min(4, "El nombre de usuario debe de tener al menos 4 caracteres")
    .matches(/^\S*$/, "El nombre de usuario no puede contener espacios")
    .required("El campo es requerido"),
  password: yup
    .string()
    .min(4, "La contraseña debe de tener al menos 4 caracteres")
    .matches(/^\S*$/, "La contraseña no puede contener espacios")
    .required("El campo es requerido"),
})

const FormUser = () => {
  const [viewPassword, setViewPassword] = useState(false)
  const dispatch = useAppDispatch()

  const handleClickViewPassword = () => setViewPassword(view => !view)

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }
  const formik = useFormik<FormData>({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: (
      values,
      { setSubmitting, resetForm }: FormikHelpers<FormData>,
    ) => {
      dispatch(loginUser(values)).then(() => {
        setSubmitting(false)
        resetForm()
      })
    },
  })

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: "sm", margin: "20px auto", padding: "20px" }}
    >
      <Typography variant="h6" component="h2" align="center">
        Ingrese para editar el Directorio
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <OutlinedInput
          fullWidth
          id="username"
          name="username"
          label="Nombre de Usuario"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
        />
        {formik.touched.username && (
          <FormHelperText error={true}>{formik.errors.username}</FormHelperText>
        )}
        <OutlinedInput
          fullWidth
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          label="Contraseña"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickViewPassword}
                onMouseDown={handleMouseDownPassword}
                onMouseUp={handleMouseUpPassword}
                edge="end"
              >
                {viewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {formik.touched.password && (
          <FormHelperText error={true}>{formik.errors.password}</FormHelperText>
        )}
        <Button
          disabled={formik.isSubmitting}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          {formik.isSubmitting ? (
            <CircularProgress size={24} />
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </Box>
    </Paper>
  )
}

export default FormUser
