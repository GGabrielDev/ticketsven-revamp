import { useEffect } from "react"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@mui/material"
import { useFormik } from "formik"
import * as yup from "yup"

import type { FormikHelpers } from "formik"

import {
  actions as organismActions,
  selectors as organismSelectors,
} from "../../redux/features/organism"
import { actions as contactActions } from "../../redux/features/contacts"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"

interface FormData {
  name: string
  phone_number: string
  organismId: number
}

const { getAllOrganisms } = organismActions
const { selectOrganisms } = organismSelectors
const { createContact } = contactActions

const validationSchema = yup.object({
  name: yup.string().required("Necesitas escribir un nombre de Contacto"),
  phone_number: yup
    .string()
    .matches(
      /^(04\d{9}|02\d{9})$/,
      "Número de teléfono no válido. Ejemplo: 04123456789 o 02123456789",
    )
    .required("El número de teléfono es obligatorio."),
  organismId: yup
    .number()
    .notOneOf([0], "Debe de seleccionar un Organismo.")
    .required("Debe de seleccionar un Organismo."),
})

const FormContact = () => {
  const organisms = useAppSelector(selectOrganisms)
  const dispatch = useAppDispatch()

  const formik = useFormik<FormData>({
    initialValues: {
      name: "",
      phone_number: "",
      organismId: 0,
    },
    validationSchema,
    onSubmit: (
      values,
      { setSubmitting, resetForm }: FormikHelpers<FormData>,
    ) => {
      console.log(values)
      dispatch(createContact(values)).then(() => {
        setSubmitting(false)
        resetForm()
      })
    },
  })

  useEffect(() => {
    dispatch(getAllOrganisms())
  }, [dispatch])

  return (
    <Paper
      elevation={3}
      sx={{ maxWidth: "sm", margin: "20px auto", padding: "20px" }}
    >
      <Typography variant="h6" component="h2" align="center">
        Declarar Organismo
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="name"
          name="name"
          label="Nombre del Contacto"
          variant="outlined"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
        />
        <TextField
          fullWidth
          id="phone_number"
          name="phone_number"
          label="Numero de Telefono"
          variant="outlined"
          value={formik.values.phone_number}
          onChange={formik.handleChange}
          error={
            formik.touched.phone_number && Boolean(formik.errors.phone_number)
          }
          helperText={formik.touched.phone_number && formik.errors.phone_number}
          margin="normal"
        />
        <TextField
          select
          fullWidth
          id="organismId"
          name="organismId"
          disabled={organisms.length === 0}
          value={formik.values.organismId}
          onChange={formik.handleChange}
          error={formik.touched.organismId && Boolean(formik.errors.organismId)}
          helperText={formik.touched.organismId && formik.errors.organismId}
          margin="normal"
        >
          <MenuItem value={0} disabled>
            {organisms.length > 0
              ? "Selecciona un grupo"
              : "No hay grupos en el sistema"}
          </MenuItem>
          {organisms.map(group => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          disabled={organisms.length === 0}
          variant="contained"
          color="primary"
          fullWidth
        >
          Crear
        </Button>
      </Box>
    </Paper>
  )
}

export default FormContact
