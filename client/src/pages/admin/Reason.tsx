import { html } from "htm/preact";
import { useState } from "preact/hooks";
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
  Tooltip,
  Typography,
} from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Formik, FormikHelpers, FormikProps, Field } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { actions, selectors } from "../../redux/features/reason/reasonSlice";
import TablePaginationActions from "../../components/admin/TablePagination";

const { createReason, editReason, deleteReason } = actions;
const { selectReasons } = selectors;

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

interface ReasonData {
  id: number;
  name: string;
}

export default function Reason() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRow, setSelectedRow] = useState<ReasonType | null>(null);
  const [edit, setEdit] = useState(false);
  const initialValues: Partial<ReasonData> = {
    name: "",
  };
  const reasons = useAppSelector(selectReasons);
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object({
    name: Yup.string().required("Necesitas escribir un nombre de Razón"),
  });

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reasons.length) : 0;

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
    values: Partial<ReasonData>,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    dispatch(createReason(values)).then(() => {
      setSubmitting(false);
      resetForm();
    });
  };

  const handleEdit = (
    values: ReasonType,
    { setSubmitting, resetForm }: FormikHelpers<ReasonType>
  ) => {
    dispatch(editReason(values)).then(() => {
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
          <${Typography} component="h1" variant="h4"> Crar una nueva Razón <//>
          <${Formik}
            initialValues=${initialValues}
            validationSchema=${validationSchema}
            onSubmit=${handleSubmit}
          >
            ${(props: FormikProps<Partial<ReasonData>>) => html`
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
                  label="Razón"
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
                    : "Crear Razón"}
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
                      <//>
                      <${Box}
                        mt=${1}
                        display="flex"
                        justifyContent="space-between"
                      >
                        <${Tooltip} title="Editar Razón" placement="top-end">
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
                        <${Tooltip} title="Borrar Razón" placement="top-end">
                          <span>
                            <${Button}
                              variant="contained"
                              color="error"
                              onClick=${() =>
                                dispatch(deleteReason(selectedRow))}
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
                        Editar Razón
                      <//>
                      <${Formik}
                        initialValues=${selectedRow}
                        validationSchema=${validationSchema}
                        onSubmit=${handleEdit}
                      >
                        ${(props: FormikProps<ReasonType>) => html`
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
                              label="Razón"
                              id="name"
                              name="name"
                              value=${props.values.name}
                              onChange=${props.handleChange}
                              error=${props.touched.name &&
                              Boolean(props.errors.name)}
                              helperText=${props.touched.name &&
                              props.errors.name}
                            />
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
          <${TableContainer} sx=${{ maxHeight: 440 }}>
            <${Table} stickyHeader aria-label="sticky table">
              <${TableHead}>
                <${StyledTableRow}>
                  <${StyledTableCell} sx=${{ maxWidth: 20 }}>ID<//>
                  <${StyledTableCell}>Razón<//>
                <//>
              <//>
              <${TableBody}>
                ${reasons.length > 0
                  ? html`${(rowsPerPage > 0
                      ? reasons.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : reasons
                    ).map(
                      (row) => html`
                        <${StyledTableRow}
                          hover
                          key=${row.id}
                          onClick=${() => setSelectedRow(row)}
                        >
                          <${StyledTableCell}>${row.id}<//>
                          <${StyledTableCell}>${row.name}<//>
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
                      <//>
                    `}
              <//>
            <//>
          <//>
          <${TablePagination}
            rowsPerPageOptions=${[5, 10, 25, { label: "All", value: -1 }]}
            colSpan=${3}
            count=${reasons.length}
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
  `;
}
