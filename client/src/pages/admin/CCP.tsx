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
  TableFooter,
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
import { selectors as parishSelectors } from "../../redux/features/parish/parishSlice";
import {
  actions as ccpActions,
  selectors as ccpSelectors,
} from "../../redux/features/ccp/ccpSlice";
import TablePaginationActions from "../../components/admin/TablePagination";

const { createCCP, editCCP, deleteCCP } = ccpActions;
const { selectCCPs } = ccpSelectors;
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
}));

interface FormData {
  id: number;
  name: string;
  parishId: number;
}

export default function CCP() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState<CCPType | null>(null);
  const [edit, setEdit] = useState(false);
  const initialValues: Partial<FormData> = {
    name: "",
    parishId: 0,
  };
  const parishes = useAppSelector(selectParishes);
  const ccps = useAppSelector(selectCCPs);
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required("Necesitas escribir un nombre de Parroquia."),
    parishId: Yup.number()
      .notOneOf([0], "Debe de seleccionar un parroquia.")
      .required("Debe de seleccionar un parroquia."),
  });

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - ccps.length) : 0;

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
    dispatch(createCCP(values)).then(() => {
      setSubmitting(false);
      resetForm();
    });
  };

  const handleEdit = (
    values: CCPType & FormData,
    { setSubmitting, resetForm }: FormikHelpers<CCPType & FormData>
  ) => {
    dispatch(editCCP(values)).then(() => {
      setSelectedRow(values);
      setSubmitting(false);
      setEdit(false);
      resetForm();
    });
  };

  return html`
    <${Grid} container spacing=${2} p=${2}>
      <${Grid}
        item
        xs=${12}
        md=${6}
        sx=${{
          display: "flex",
          gap: "12px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <${Paper} sx=${{ p: 3, width: "100%" }}>
          <${Typography} component="h1" variant="h4">
            Crar una nuevo Centro de Coordinación Policial
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
                  fullWidth
                  label="Centro de Coordinación Policial"
                  id="name"
                  name="name"
                  sx=${{ mb: 2 }}
                  value=${props.values.name}
                  onChange=${props.handleChange}
                  error=${props.touched.name && Boolean(props.errors.name)}
                  helperText=${props.touched.name && props.errors.name}
                />
                <${InputLabel} id="parishId">Parroquia<//>
                <${Field}
                  as=${Select}
                  fullWidth
                  id="parishId"
                  name="parishId"
                  disabled=${parishes.length === 0}
                  value=${props.values.parishId}
                  onChange=${props.handleChange}
                  error=${props.touched.parishId &&
                  Boolean(props.errors.parishId)}
                  helperText=${props.touched.parishId && props.errors.parishId}
                >
                  ${parishes.length > 0
                    ? html`
                        <${MenuItem} key=${0} value=${0}>
                          Selecciona un parroquia
                        <//>
                        ${parishes.map(
                          (parish) => html`
                            <${MenuItem} key=${parish.id} value=${parish.id}>
                              ${parish.name}
                            <//>
                          `
                        )}
                      `
                    : html`
                        <${MenuItem} value=${0} disabled>
                          No hay Parroquias en el sistema
                        <//>
                      `}
                <//>
                <${Button}
                  disabled=${props.isSubmitting || parishes.length === 0}
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx=${{ p: 1, mt: 3, mb: 2 }}
                >
                  ${props.isSubmitting
                    ? html`<${CircularProgress} size=${24} />`
                    : "Crear CCP"}
                <//>
              <//>
            `}
          <//>
        <//>
        ${selectedRow
          ? html`
              <${Paper} sx=${{ p: 3, width: "100%" }}>
                ${!edit
                  ? html`
                      <${Typography} variant="h5"
                        >Información de la fila seleccionada:<//
                      >
                      <${Box} mt=${1}>
                        <${Typography}>ID: ${selectedRow.id}<//>
                        <${Typography}>Nombre: ${selectedRow.name}<//>
                        <${Typography}>Parroquia: ${selectedRow.parish.name}<//>
                      <//>
                      <${Box}
                        mt=${1}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <${Tooltip} title="Editar CCP" placement="top-end">
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
                          title=${selectedRow.quadrants.length > 0
                            ? "No se puede borrar si tiene Cuadrantes asignados"
                            : "Borrar CCP"}
                          placement="top-end"
                        >
                          <span>
                            <${Button}
                              variant="contained"
                              color="error"
                              disabled=${selectedRow.quadrants.length > 0}
                              onClick=${() => dispatch(deleteCCP(selectedRow))}
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
                        Editar Centro de Coordinación Policial
                      <//>
                      <${Formik}
                        initialValues=${{
                          ...selectedRow,
                          parishId: selectedRow.parish.id,
                        }}
                        validationSchema=${validationSchema}
                        onSubmit=${handleEdit}
                      >
                        ${(props: FormikProps<CCPType & FormData>) => html`
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
                              label="Centro de Coordinación Policial;"
                              id="name"
                              name="name"
                              value=${props.values.name}
                              onChange=${props.handleChange}
                              error=${props.touched.name &&
                              Boolean(props.errors.name)}
                              helperText=${props.touched.name &&
                              props.errors.name}
                            />
                            <${InputLabel} id="municipalityId">Parroquia<//>
                            <${Field}
                              as=${Select}
                              margin="normal"
                              fullWidth
                              id="parishId"
                              name="parishId"
                              value=${props.values.parishId}
                              onChange=${props.handleChange}
                              error=${props.touched.parishId &&
                              Boolean(props.errors.parishId)}
                              helperText=${props.touched.parishId &&
                              props.errors.parishId}
                            >
                              <${MenuItem} value=${0}
                                >Selecciona un parroquia<//
                              >
                              ${parishes.map(
                                (parish) => html`
                    <${MenuItem} value=${parish.id}
                      >${parish.name}</${MenuItem}
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
        <${Paper} sx=${{ width: "100%", overflow: "hidden" }}>
          <${TableContainer}>
            <${Table} stickyHeader aria-label="sticky table">
              <${TableHead}>
                <${StyledTableRow}>
                  <${StyledTableCell}>ID<//>
                  <${StyledTableCell}>CCP<//>
                  <${StyledTableCell}>Parroquia<//>
                <//>
              <//>
              <${TableBody}>
                ${ccps.length > 0
                  ? html`${(rowsPerPage > 0
                      ? ccps.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : ccps
                    ).map(
                      (row) => html`
                        <${StyledTableRow}
                          hover
                          key=${row.id}
                          onClick=${() => setSelectedRow(row)}
                        >
                          <${StyledTableCell}>${row.id}<//>
                          <${StyledTableCell}>${row.name}<//>
                          <${StyledTableCell}>${row.parish.name}<//>
                        <//>
                      `
                    )}
                    ${emptyRows > 0 &&
                    html`
                      <${StyledTableRow} sx=${{ height: 53 * emptyRows }}>
                        <${StyledTableCell} colSpan=${6} />
                      <//>
                    `}`
                  : html`
                      <${StyledTableRow}>
                        <${StyledTableCell}>N/E<//>
                        <${StyledTableCell}>No hay entradas disponibles<//>
                        <${StyledTableCell}><//>
                      <//>
                    `}
              <//>
              <${TableFooter}>
                <${TableRow}>
                  <${TablePagination}
                    rowsPerPageOptions=${[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan=${3}
                    count=${ccps.length}
                    rowsPerPage=${rowsPerPage}
                    page=${page}
                    SelectProps=${{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange=${handleChangePage}
                    onRowsPerPageChange=${handleChangeRowsPerPage}
                    ActionsComponent=${TablePaginationActions}
                  />
                <//>
              <//>
            <//>
          <//>
        <//>
      <//>
    <//>
  `;
}
