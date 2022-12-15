import { html } from "htm/preact";
import { useEffect, useState } from "preact/hooks";
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
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Formik, FormikHelpers, FormikProps, Field } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  actions,
  selectors,
} from "../../redux/features/municipality/municipalitySlice";
import TablePaginationActions from "../../components/admin/TablePagination";

const { createMunicipality, getAllMunicipalities } = actions;
const { selectMunicipalities } = selectors;

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
  name: string;
}

export default function Municipality() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const initialValues: Partial<MunicipalityData> = {
    name: "",
  };
  const municipalities = useAppSelector(selectMunicipalities);
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required("Necesitas escribir un nombre de Municipio"),
  });

  const handleChangePage = (event: Event, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: Event) => {
    setRowsPerPage(
      parseInt(
        (event.target as HTMLInputElement | HTMLTextAreaElement).value,
        10
      )
    );
    setPage(0);
  };

  const handleSubmit = (
    values: Partial<MunicipalityData>,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    dispatch(createMunicipality(values)).then(() => {
      setSubmitting(false);
      resetForm();
    });
  };

  useEffect(() => {
    dispatch(getAllMunicipalities());
  }, []);

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
                id="name"
                name="name"
                value=${props.values.name}
                onChange=${props.handleChange}
                error=${props.touched.name && Boolean(props.errors.name)}
                helperText=${props.touched.name && props.errors.name}
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
                  : "Crear Municipio"}
              <//>
            <//>
          `}
        <//>
      <//>
      <${Grid} item xs=${12} md=${6}>
        <${TableContainer} component=${Paper} sx=${{ maxHeight: 440 }}>
          <${Table} stickyHeader>
            <${TableHead}>
              <${StyledTableRow}>
                <${StyledTableCell} sx=${{ maxWidth: 20 }}>ID<//>
                <${StyledTableCell}>Municipio<//>
              <//>
            <//>
            <${TableBody}>
              ${municipalities.length > 0
                ? municipalities.map(
                    (row) => html`
                      <${StyledTableRow} hover key=${row.id}>
                        <${StyledTableCell}>${row.id}<//>
                        <${StyledTableCell}>${row.name}<//>
                      <//>
                    `
                  )
                : html`
                    <${StyledTableRow}>
                      <${StyledTableCell}>N/E<//>
                      <${StyledTableCell}>No hay entradas disponibles<//>
                    <//>
                  `}
            <//>
            <${StyledTableRow}>
              <${TablePagination}
                rowsPerPageOptions=${[10, 25, 100, { label: "All", value: -1 }]}
                colSpan=${3}
                count=${municipalities.length}
                rowsPerPage=${rowsPerPage}
                page=${page}
                onPageChange=${handleChangePage}
                onRowsPerPageChange=${handleChangeRowsPerPage}
                ActionsComponent=${TablePaginationActions}
              />
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}
