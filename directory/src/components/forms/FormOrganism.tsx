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

import { actions as organismActions } from "../../redux/features/organism"
import {
  selectors as organismGroupSelectors,
  actions as organismGroupActions,
} from "../../redux/features/organismGroup"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"

interface FormData {
  name: string
  organismGroupId: number
}

const { selectOrganismGroups } = organismGroupSelectors
const { getAllOrganismGroups } = organismGroupActions
const { createOrganism } = organismActions

const validationSchema = yup.object({
  name: yup.string().required("Necesitas escribir un nombre de Organismo."),
  organismGroupId: yup
    .number()
    .notOneOf([0], "Debe de seleccionar un Grupo de Organismo.")
    .required("Debe de seleccionar un Grupo de Organismo."),
})

const FormOrganism = () => {
  const organismGroups = useAppSelector(selectOrganismGroups)
  const dispatch = useAppDispatch()

  const formik = useFormik<FormData>({
    initialValues: {
      name: "",
      organismGroupId: 0,
    },
    validationSchema,
    onSubmit: (
      values,
      { setSubmitting, resetForm }: FormikHelpers<FormData>,
    ) => {
      dispatch(createOrganism(values)).then(() => {
        setSubmitting(false)
        resetForm()
      })
    },
  })

  useEffect(() => {
    dispatch(getAllOrganismGroups())
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
          label="Nombre del Organismo"
          variant="outlined"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          margin="normal"
        />
        <TextField
          select
          fullWidth
          id="organismGroupId"
          name="organismGroupId"
          disabled={organismGroups.length === 0}
          value={formik.values.organismGroupId}
          onChange={formik.handleChange}
          error={
            formik.touched.organismGroupId &&
            Boolean(formik.errors.organismGroupId)
          }
          helperText={
            formik.touched.organismGroupId && formik.errors.organismGroupId
          }
          margin="normal"
        >
          <MenuItem value={0} disabled>
            {organismGroups.length > 0
              ? "Selecciona un grupo"
              : "No hay grupos en el sistema"}
          </MenuItem>
          {organismGroups.map(group => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          type="submit"
          disabled={organismGroups.length === 0}
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

export default FormOrganism
