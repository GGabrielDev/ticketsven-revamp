import { html } from "htm/preact";
import { useState } from "preact/hooks";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Formik, FormikHelpers, FormikProps, Field } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectors as municipalitySelectors } from "../../redux/features/municipality/municipalitySlice";
import {
  actions as parishActions,
  selectors as parishSelectors,
} from "../../redux/features/parish/parishSlice";
import TablePaginationActions from "../../components/admin/TablePagination";

const { createParish, editParish, deleteParish } = parishActions;
const { selectMunicipalities } = municipalitySelectors;
const { selectParishes } = parishSelectors;

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

interface FormData {
  id: number;
  name: string;
  municipalityId: number;
}

export default function Parish() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState<ParishType | null>(null);
  const [edit, setEdit] = useState(false);
  const initialValues: Partial<FormData> = {
    name: "",
    municipalityId: 0,
  };
  const municipalities = useAppSelector(selectMunicipalities);
  const parishes = useAppSelector(selectParishes);
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required("Necesitas escribir un nombre de Parroquia."),
    municipalityId: Yup.number()
      .notOneOf([0], "Debe de seleccionar un municipio.")
      .required("Debe de seleccionar un municipio."),
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
    values: Partial<FormData>,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    dispatch(createParish(values)).then(() => {
      setSubmitting(false);
      resetForm();
    });
  };

  const handleEdit = (
    values: ParishType & FormData,
    { setSubmitting, resetForm }: FormikHelpers<ParishType & FormData>
  ) => {
    dispatch(editParish(values)).then(() => {
      setSelectedRow(values);
      setSubmitting(false);
      setEdit(false);
      resetForm();
    });
  };

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
        <${Typography} component="h1" variant="h4">
          Crar una nueva parroquia
        <//>
        <${Formik}
          initialValues=${initialValues}
          validationSchema=${validationSchema}
          onSubmit=${handleSubmit}
        >
          ${(props: FormikProps<Partial<FormData>>) => html`
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
                label="Parroquia"
                id="name"
                name="name"
                value=${props.values.name}
                onChange=${props.handleChange}
                error=${props.touched.name && Boolean(props.errors.name)}
                helperText=${props.touched.name && props.errors.name}
              />
              <${InputLabel} id="municipalityId">Municipio<//>
              <${Field}
                as=${Select}
                margin="normal"
                fullWidth
                id="municipalityId"
                name="municipalityId"
                value=${props.values.municipalityId}
                onChange=${props.handleChange}
                error=${props.touched.municipalityId &&
                Boolean(props.errors.municipalityId)}
                helperText=${props.touched.municipalityId &&
                props.errors.municipalityId}
              >
                <${MenuItem} value=${0}>Selecciona un municipio<//>
                ${municipalities.map(
                  (municipality) => html`
                    <${MenuItem} value=${municipality.id}
                      >${municipality.name}</${MenuItem}
                    >
                  `
                )}
              <//>
              <${Button}
                disabled=${props.isSubmitting}
                type="submit"
                fullWidth
                variant="contained"
                sx=${{ p: 1, mt: 3, mb: 2 }}
              >
                ${props.isSubmitting
                  ? html`<${CircularProgress} size=${24} />`
                  : "Crear Parroquia"}
              <//>
            <//>
          `}
        <//>
        ${selectedRow
          ? html`
              <${Paper} sx=${{ p: 4, m: 2 }}>
                ${!edit
                  ? html`
                      <${Typography} variant="h5"
                        >Información de la fila seleccionada:<//
                      >
                      <${Box} mt=${1}>
                        <${Typography}>ID: ${selectedRow.id}<//>
                        <${Typography}>Nombre: ${selectedRow.name}<//>
                        <${Typography}
                          >Municipio: ${selectedRow.municipality.name}<//
                        >
                      <//>
                      <${Box}
                        mt=${1}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <${Tooltip}
                          title="Editar Parroquia"
                          placement="top-end"
                        >
                          <span>
                            <${Button}
                              variant="contained"
                              color="primary"
                              onClick=${() => setEdit(true)}
                            >
                              <${EditIcon} />
                              Editar
                            <//>
                          </span>
                        <//>
                        <${Tooltip}
                          title=${selectedRow.ccps.length > 0
                            ? "No se puede borrar si tiene CCPs asignados"
                            : "Borrar Parroquia"}
                          placement="top-end"
                        >
                          <span>
                            <${Button}
                              variant="contained"
                              color="error"
                              disabled=${selectedRow.ccps.length > 0}
                              onClick=${() =>
                                dispatch(deleteParish(selectedRow))}
                            >
                              <${DeleteIcon} />
                              Borrar
                            <//>
                          </span>
                        <//>
                      <//>
                    `
                  : html`
                      <${Typography} component="h1" variant="h4">
                        Editar Parroquia
                      <//>
                      <${Formik}
                        initialValues=${{
                          ...selectedRow,
                          municipalityId: selectedRow.municipality.id,
                        }}
                        validationSchema=${validationSchema}
                        onSubmit=${handleEdit}
                      >
                        ${(props: FormikProps<ParishType & FormData>) => html`
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
                              label="Parroquia"
                              id="name"
                              name="name"
                              value=${props.values.name}
                              onChange=${props.handleChange}
                              error=${props.touched.name &&
                              Boolean(props.errors.name)}
                              helperText=${props.touched.name &&
                              props.errors.name}
                            />
                            <${InputLabel} id="municipalityId">Municipio<//>
                            <${Field}
                              as=${Select}
                              margin="normal"
                              fullWidth
                              id="municipalityId"
                              name="municipalityId"
                              value=${props.values.municipalityId}
                              onChange=${props.handleChange}
                              error=${props.touched.municipalityId &&
                              Boolean(props.errors.municipalityId)}
                              helperText=${props.touched.municipalityId &&
                              props.errors.municipalityId}
                            >
                              <${MenuItem} value=${0}
                                >Selecciona un municipio<//
                              >
                              ${municipalities.map(
                                (municipality) => html`
                    <${MenuItem} value=${municipality.id}
                      >${municipality.name}</${MenuItem}
                    >
                  `
                              )}
                            <//>
                            <${Box}
                              sx=${{
                                mt: 3,
                                mb: 2,
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <${Button}
                                variant="contained"
                                color="error"
                                sx=${{ p: 1 }}
                                onClick=${() => setEdit(false)}
                              >
                                Cancelar
                              <//>
                              <${Button}
                                disabled=${props.isSubmitting}
                                type="submit"
                                variant="contained"
                                sx=${{ p: 1 }}
                              >
                                ${props.isSubmitting
                                  ? html`<${CircularProgress} size=${24} />`
                                  : "Confirmar"}
                              <//>
                            <//>
                          <//>
                        `}
                      <//>
                    `}
              <//>
            `
          : ""}
      <//>
      <${Grid} item xs=${12} md=${6}>
        <${TableContainer} component=${Paper} sx=${{ maxHeight: 440 }}>
          <${Table} stickyHeader>
            <${TableHead}>
              <${StyledTableRow}>
                <${StyledTableCell} sx=${{ maxWidth: 20 }}>ID<//>
                <${StyledTableCell}>Parroquia<//>
                <${StyledTableCell}>Municipio<//>
              <//>
            <//>
            <${TableBody}>
              ${parishes.length > 0
                ? parishes.map(
                    (row) => html`
                      <${StyledTableRow}
                        hover
                        key=${row.id}
                        onClick=${() => setSelectedRow(row)}
                      >
                        <${StyledTableCell}>${row.id}<//>
                        <${StyledTableCell}>${row.name}<//>
                        <${StyledTableCell}>${row.municipality.name}<//>
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
