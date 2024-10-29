import { Box, Paper, Typography, TextField, Button } from "@mui/material"
import { useFormik } from "formik"
import * as yup from "yup"

import { useAppDispatch } from "../../redux/hooks"
import { actions as organismGroupActions } from "../../redux/features/organismGroup"

import type { FormikHelpers } from "formik"

const { createOrganismGroup } = organismGroupActions

const validationSchema = yup.object({
  name: yup
    .string()
    .required("Necesitas escribir un nombre del Grupo de Organismo."),
})

interface FormData {
  name: string
}

const FormOrganismGroup = () => {
  const dispatch = useAppDispatch()

  const formik = useFormik<FormData>({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (
      values,
      { setSubmitting, resetForm }: FormikHelpers<FormData>,
    ) => {
      dispatch(createOrganismGroup(values)).then(() => {
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
        Declarar Grupo de Organismos
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Nombre del Grupo de Organismos"
          variant="outlined"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Crear
        </Button>
      </Box>
    </Paper>
  )
}

export default FormOrganismGroup
