import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { html } from "htm/preact";
import { Formik, FormikProps, Field } from "formik";
import * as Yup from "yup";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

interface MunicipalityData {
  id: number;
  municipality: string;
}

const municipalityData: MunicipalityData[] = [
  { id: 1, municipality: "New York" },
  { id: 2, municipality: "Los Angeles" },
  { id: 3, municipality: "Chicago" },
  { id: 4, municipality: "Houston" },
];

export default function Municipality() {
  const initialValues: Partial<MunicipalityData> = {
    municipality: "",
  };

  const validationSchema = Yup.object({
    municipality: Yup.string().required(
      "Necesitas escribir un nombre de Municipio"
    ),
  });

  const handleSubmit = (values: Partial<MunicipalityData>) => {};

  return html`
    <${Grid} container spacing=${1}>
      <${Grid}
        item
        xs=${12}
        md=${6}
        sx=${{
          gap: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <${Typography} component="h1" variant="h4"> Crar un nuevo Municipio <//>
        <${Formik}
          initialValues=${initialValues}
          validationSchema=${validationSchema}
          onSubmit=${handleSubmit}
        >
          ${(props: FormikProps<Partial<MunicipalityData>>) => html`
            <${Box}
              component="form"
              noValidate
              sx=${{ mt: 2, mb: 2 }}
              onReset=${props.handleReset}
              onSubmit=${props.handleSubmit}
            >
              <${Field}
                as=${TextField}
                margin="normal"
                fullWidth
                label="Municipio"
                id="municipality"
                name="municipality"
                value=${props.values.municipality}
                onChange=${props.handleChange}
                error=${props.touched.municipality &&
                Boolean(props.errors.municipality)}
                helperText=${props.touched.municipality &&
                props.errors.municipality}
              />
              <${Button}
                disabled=${props.isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                sx=${{ p: 1, mt: 3, mb: 2 }}
              >
                ${props.isSubmitting
                  ? html`<${CircularProgress} size=${24} />`
                  : "Submit"}
              <//>
            <//>
          `}
        <//>
      <//>
      <${Grid} item xs=${12} md=${6}>
        <${TableContainer} component=${Paper}>
          <${Table}>
            <${TableHead}>
              <${StyledTableRow}>
                <${StyledTableCell}>ID<//>
                <${StyledTableCell}>Municipio<//>
              <//>
            <//>
            <${TableBody}>
              ${municipalityData.map(
                (row) => html`
                  <${StyledTableRow} key=${row.id}>
                    <${StyledTableCell}>${row.id}<//>
                    <${StyledTableCell}>${row.municipality}<//>
                  <//>
                `
              )}
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}
