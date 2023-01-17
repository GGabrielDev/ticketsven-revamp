import { html } from "htm/preact";
import { ChangeEvent } from "react";
import { useEffect, useState } from "preact/hooks";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { CallEndRounded, CallMadeRounded } from "@mui/icons-material";
import { Formik, FormikHelpers, FormikProps, Field } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  actions as ccpActions,
  selectors as ccpSelectors,
} from "../../redux/features/ccp/ccpSlice";
import {
  actions as quadrantActions,
  selectors as quadrantSelectors,
} from "../../redux/features/quadrant/quadrantSlice";
import {
  actions as ticketActions,
  selectors as ticketSelectors,
} from "../../redux/features/ticket/ticketSlice";
import { selectors as userSelectors } from "../../redux/features/user/userSlice";

const { getCCPsByParish } = ccpActions;
const { getQuadrantsByCCP } = quadrantActions;
const { clearStatus, postTicketOperator, getTicket } = ticketActions;

const { selectCCPs } = ccpSelectors;
const { selectQuadrants } = quadrantSelectors;
const { selectStatus, selectError, selectTicket } = ticketSelectors;
const { selectUser } = userSelectors;

type DisplayProps = Record<"key" | "value", string>;

type FormData = {
  ccpId: number;
  quadrantId: number;
};

const validationSchema = yup.object().shape({
  ccpId: yup
    .number()
    .required("Selecciona un elemento")
    .notOneOf([-1], "Selecciona un elemento"),
  quadrantId: yup
    .number()
    .required("Selecciona un elemento")
    .notOneOf([-1], "Selecciona un elemento"),
});

const singleDisplay = (first: DisplayProps) => html`
  <${Box}
    sx=${{
      display: "flex",
      flexFlow: "row wrap",
      width: 1,
      mb: 2,
      justifyContent: "center",
    }}
  >
    <${Box}>
      <${Typography} variant="h6" align="center">${first.key}<//>
      <${Typography} variant="body1" align="center"> ${first.value} <//>
    <//>
  <//>
`;

const doubleDisplay = (first: DisplayProps, second: DisplayProps) => html`
  <${Box}
    sx=${{
      display: "flex",
      flexFlow: "row wrap",
      width: 1,
      mb: 2,
      justifyContent: "space-evenly",
    }}
  >
    <${Box}>
      <${Typography} variant="h6" align="center">${first.key}<//>
      <${Typography} variant="body1" align="center"> ${first.value} <//>
    <//>
    <${Box}>
      <${Typography} variant="h6" align="center">${second.key}<//>
      <${Typography} variant="body1" align="center"> ${second.value} <//>
    <//>
  <//>
`;

export default function Form() {
  const dispatch = useAppDispatch();
  const ccps = useAppSelector(selectCCPs);
  const error = useAppSelector(selectError);
  const quadrants = useAppSelector(selectQuadrants);
  const status = useAppSelector(selectStatus);
  const ticket = useAppSelector(selectTicket);
  const user = useAppSelector(selectUser);

  const navigate = useNavigate();
  const { ticketId } = useParams();

  const initialValues: FormData = {
    ccpId: -1,
    quadrantId: -1,
  };

  const callQuadrants = (e: ChangeEvent<any>) => {
    const ccpId = parseInt(e.target.value);
    if (ccpId !== -1 && ccpId !== 0) dispatch(getQuadrantsByCCP(ccpId));
  };

  const handleSubmit = (
    values: Partial<FormData>,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    // dispatch(postTicketOperator(values)).then(() => {
    //   setSubmitting(false);
    //   resetForm();
    //   navigate("/dashboard");
    // });
  };

  useEffect(() => {
    if (ticketId) dispatch(getTicket(ticketId));
  }, [ticketId]);

  useEffect(() => {
    if (ticket) {
      dispatch(getCCPsByParish(ticket.parish.id));
    }
  }, [ticket]);

  return (
    ticket &&
    html`
      <${Container}
        sx=${{
          display: "flex",
          flexFlow: "column nowrap",
          alignItems: "center",
          p: 3,
          width: 1,
        }}
      >
        ${status === "Error" &&
        html`<${Alert} severity="error">${error?.message}<//>`}
        <${Typography}
          variant="h3"
          textAlign="center"
          color="primary.dark"
          sx=${{ fontWeight: "bold" }}
        >
          Solicitud Entrante - Despacho
        <//>
        <${Typography}
          variant="h6"
          textAlign="center"
          color="grey.500"
          gutterBottom
          sx=${{ fontWeight: "bold" }}
        >
          Operador:${" "}
          ${ticket?.users.find((userTicket) => userTicket.roleId === 4)
            ?.fullname}
        <//>
        <${Typography}
          variant="h6"
          textAlign="center"
          color="grey.500"
          gutterBottom
          sx=${{ fontWeight: "bold" }}
        >
          Despachador/es:${" "}
          ${ticket?.users.find((userTicket) => userTicket.id === user?.id)
            ? ticket?.users
                .filter((userTicket) => userTicket.roleId === 3)
                .map((userTicket) => userTicket.fullname)
                .join(", ")
            : [
                user?.fullname,
                ...(ticket?.users
                  .filter((userTicket) => userTicket.roleId === 3)
                  .map((userTicket) => userTicket.fullname) || []),
              ].join(", ")}
        <//>
        <${Divider} variant="middle" sx=${{ width: { xs: 1, md: 0.8 } }}>
          Datos de la llamada
        <//>
        <${Box}
          noValidate
          maxWidth="md"
          sx=${{
            display: "flex",
            flexFlow: "column wrap",
            mb: 2,
            width: 1,
          }}
        >
          ${doubleDisplay(
            {
              key: "Fecha de la solicitud",
              value: new Date(ticket?.createdAt as string).toLocaleDateString(
                "es-ES",
                { day: "numeric", month: "long", year: "numeric" }
              ),
            },
            {
              key: "Hora de llamada",
              value: `${new Date(
                ticket?.call_started as string
              ).toLocaleTimeString()} - ${new Date(
                ticket?.call_ended as string
              ).toLocaleTimeString()}`,
            }
          )}
          ${doubleDisplay(
            {
              key: "N° de teléfono entrante",
              value: ticket.phone_number
                ? ticket.phone_number.toString()
                : "Sin determinar",
            },
            { key: "Razón de llamada", value: ticket.reason.name }
          )}
          ${singleDisplay({
            key: "Dirección de la solicitud",
            value: ticket.address,
          })}
          ${singleDisplay({
            key: "Punto de referencia",
            value: ticket.reference_point,
          })}
          ${doubleDisplay(
            { key: "Municipio", value: ticket.municipality.name },
            { key: "Parroquia", value: ticket.parish.name }
          )}
          ${singleDisplay({
            key: "Detalles de la solicitud",
            value: ticket.details,
          })}
        <//>
        <${Divider} variant="middle" sx=${{ width: { xs: 1, md: 0.8 } }}>
          Datos del despacho
        <//>
        <${Formik}
          initialValues=${initialValues}
          onSubmit=${handleSubmit}
          validationSchema=${validationSchema}
        >
          ${(props: FormikProps<Partial<FormData>>) => {
            const { touched, setFieldValue } = props;
            // useEffect(() => {
            //   if (ticket) {
            //     setFieldValue("details", ticket.details);
            //   }
            // }, [ticket]);

            return html`
              <${Box}
                component="form"
                noValidate
                maxWidth="md"
                sx=${{
                  display: "flex",
                  flexFlow: "column wrap",
                  mb: 2,
                  width: 1,
                }}
                onReset=${props.handleReset}
                onSubmit=${props.handleSubmit}
              >
                <${Box}
                  sx=${{
                    display: "flex",
                    flexFlow: "row wrap",
                    width: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <${Field}
                    as=${TextField}
                    select
                    margin="normal"
                    label="Centro de Coordinación Polical"
                    id="ccpId"
                    name="ccpId"
                    variant="outlined"
                    disabled=${ccps.length === 0}
                    sx=${{ width: { xs: 1, md: 0.49 } }}
                    value=${props.values.ccpId}
                    onChange=${(e: ChangeEvent<any>) => {
                      props.handleChange(e);
                      callQuadrants(e);
                    }}
                    error=${props.touched.ccpId && Boolean(props.errors.ccpId)}
                    helperText=${props.touched.ccpId && props.errors.ccpId}
                  >
                    ${ccps.length > 0
                      ? html`
                          <${MenuItem} key=${-1} value=${-1}>
                            Selecciona un CCP
                          <//>
                          ${ccps.map(
                            (ccp) => html`
                              <${MenuItem} key=${ccp.id} value=${ccp.id}>
                                ${ccp.name}
                              <//>
                            `
                          )}
                        `
                      : html`
                          <${MenuItem} value=${-1} disabled>
                            No hay CCPs en el sistema
                          <//>
                        `}
                  <//>
                  <${Field}
                    as=${TextField}
                    select
                    margin="normal"
                    label="Cuadrante"
                    id="quadrantId"
                    name="quadrantId"
                    variant="outlined"
                    disabled=${quadrants.length === 0}
                    sx=${{ width: { xs: 1, md: 0.49 } }}
                    value=${props.values.quadrantId}
                    onChange=${props.handleChange}
                    error=${props.touched.quadrantId &&
                    Boolean(props.errors.quadrantId)}
                    helperText=${props.touched.quadrantId &&
                    props.errors.quadrantId}
                  >
                    ${quadrants.length > 0
                      ? html`
                          <${MenuItem} key=${-1} value=${-1}>
                            Selecciona un quadrante
                          <//>
                          ${quadrants.map(
                            (quadrant) => html`
                              <${MenuItem}
                                key=${quadrant.id}
                                value=${quadrant.id}
                              >
                                ${quadrant.name}
                              <//>
                            `
                          )}
                        `
                      : html`
                          <${MenuItem} value=${-1} disabled> Escoja un CCP <//>
                        `}
                  <//>
                <//>
              <//>
            `;
          }}
        <//>
      <//>
    `
  );
}
