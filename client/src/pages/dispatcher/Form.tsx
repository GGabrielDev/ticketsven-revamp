import { html } from "htm/preact";
import { ChangeEvent } from "react";
import { useEffect, useState } from "preact/hooks";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Fab,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker, DateTimePickerProps } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";
import { SaveAlt, CheckCircle, Error } from "@mui/icons-material";
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
const { putTicketUpdateDispatcher, getTicket, clearStatusUpdate } =
  ticketActions;

const { selectCCPs } = ccpSelectors;
const { selectQuadrants } = quadrantSelectors;
const { selectStatus, selectStatusUpdate, selectError, selectTicket } =
  ticketSelectors;
const { selectUser } = userSelectors;

type DisplayProps = Record<"key" | "value", string>;

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

const SaveButton = styled(Fab)({
  position: "fixed",
  zIndex: 1,
  bottom: 32,
  right: 32,
  margin: "0 auto",
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
      <${Typography} variant="body1" align="center">${first.value}<//>
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
      <${Typography} variant="body1" align="center">${first.value}<//>
    <//>
    <${Box}>
      <${Typography} variant="h6" align="center">${second.key}<//>
      <${Typography} variant="body1" align="center">${second.value}<//>
    <//>
  <//>
`;

export default function Form() {
  const dispatch = useAppDispatch();
  const ccps = useAppSelector(selectCCPs);
  const error = useAppSelector(selectError);
  const quadrants = useAppSelector(selectQuadrants);
  const status = useAppSelector(selectStatus);
  const statusUpdate = useAppSelector(selectStatusUpdate);
  const ticket = useAppSelector(selectTicket);
  const user = useAppSelector(selectUser);

  const navigate = useNavigate();
  const { ticketId } = useParams();

  const initialValues: DispatchTicket = {
    ccpId: -1,
    quadrantId: -1,
    dispatch_time: dayjs(),
    reaction_time: dayjs(),
    arrival_time: dayjs(),
    response_time: dayjs(),
    finish_time: dayjs(),
    attention_time: dayjs(),
    dispatch_details: "",
    reinforcement_units: "",
    follow_up: "",
  };

  const callQuadrants = (e: ChangeEvent<any>) => {
    const ccpId = parseInt(e.target.value);
    if (ccpId !== -1 && ccpId !== 0) dispatch(getQuadrantsByCCP(ccpId));
  };

  const handleSubmit = (
    values: Partial<DispatchTicket>,
    { setSubmitting, resetForm }: FormikHelpers<FormData>
  ) => {
    // dispatch(postTicketOperator({id: ticket.id, ...values})).then(() => {
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

  useEffect(() => {
    if (statusUpdate !== "Idle")
      new Promise((r) => setTimeout(r, 2000)).then(() => {
        dispatch(clearStatusUpdate());
      });
  }, [statusUpdate]);

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
          ${(props: FormikProps<DispatchTicket>) => {
            const { isValid, isSubmitting, values, setFieldValue } = props;
            useEffect(() => {
              if (ticket) {
                if (ticket.dispatch_time)
                  setFieldValue(
                    "dispatch_time",
                    new Date(ticket.dispatch_time)
                  );
                if (ticket.reaction_time)
                  setFieldValue(
                    "reaction_time",
                    new Date(ticket.reaction_time)
                  );
                if (ticket.arrival_time)
                  setFieldValue("arrival_time", new Date(ticket.arrival_time));
                if (ticket.response_time)
                  setFieldValue(
                    "response_time",
                    new Date(ticket.response_time)
                  );
                if (ticket.finish_time)
                  setFieldValue("finish_time", new Date(ticket.finish_time));
                if (ticket.attention_time)
                  setFieldValue(
                    "attention_time",
                    new Date(ticket.attention_time)
                  );
                if (ticket.dispatch_details)
                  setFieldValue("dispatch_details", ticket.dispatch_details);
                if (ticket.reinforcement_units)
                  setFieldValue(
                    "reinforcement_units",
                    ticket.reinforcement_units
                  );
                if (ticket.follow_up)
                  setFieldValue("follow_up", ticket.follow_up);
              }

              if (ticket.ccp && ticket.ccp.id) {
                setFieldValue("ccpId", ticket.ccp.id);
                dispatch(getQuadrantsByCCP(ticket.ccp.id)).then(() => {
                  if (ticket.quadrant && ticket.quadrant.id)
                    setFieldValue("quadrantId", ticket.quadrant.id);
                });
              }
            }, [ticket, ccps]);

            const hardUpdate = (e: Event) => {
              e.preventDefault();
              dispatch(putTicketUpdateDispatcher({ id: ticket.id, ...values }));
            };

            return html`
              <${SaveButton} size="large" onClick=${hardUpdate}>
                ${statusUpdate === "Idle"
                  ? html`<${SaveAlt} />`
                  : statusUpdate === "Loading"
                  ? html`<${CircularProgress} />`
                  : statusUpdate === "Success"
                  ? html`<${CheckCircle} />`
                  : statusUpdate === "Error"
                  ? html`<${Error} />`
                  : null}
              <//>
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
                  <${TextField}
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
                  <${TextField}
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
                            Seleccione un cuadrante
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
                <${Box}
                  sx=${{
                    display: "flex",
                    flexFlow: "row wrap",
                    width: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <${DateTimePicker}
                    onChange=${(value: DateTimePickerProps<Dayjs, unknown>) =>
                      props.setFieldValue("dispatch_time", value, true)}
                    value=${props.values.dispatch_time}
                    renderInput=${(
                      params: DateTimePickerProps<Date, unknown>
                    ) => html`
                      <${TextField}
                        ...${params}
                        margin="normal"
                        label="Hora de despacho"
                        id="dispatch_time"
                        name="dispatch_time"
                        variant="outlined"
                        sx=${{ width: { xs: 1, md: 0.49 } }}
                        value=${props.values.dispatch_time}
                        onChange=${props.handleChange}
                        error=${props.touched.dispatch_time &&
                        Boolean(props.errors.dispatch_time)}
                        helperText=${props.touched.dispatch_time &&
                        props.errors.dispatch_time}
                      />
                    `}
                  />
                  <${DateTimePicker}
                    onChange=${(value: DateTimePickerProps<Dayjs, unknown>) =>
                      props.setFieldValue("reaction_time", value, true)}
                    value=${props.values.reaction_time}
                    renderInput=${(
                      params: DateTimePickerProps<Dayjs, unknown>
                    ) => html`
                      <${TextField}
                        ...${params}
                        margin="normal"
                        label="Hora de reacción"
                        id="reaction_time"
                        name="reaction_time"
                        variant="outlined"
                        sx=${{ width: { xs: 1, md: 0.49 } }}
                        value=${props.values.reaction_time}
                        onChange=${props.handleChange}
                        error=${props.touched.reaction_time &&
                        Boolean(props.errors.reaction_time)}
                        helperText=${props.touched.reaction_time &&
                        props.errors.reaction_time}
                      />
                    `}
                  />
                <//>
                <${Box}
                  sx=${{
                    display: "flex",
                    flexFlow: "row wrap",
                    width: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <${DateTimePicker}
                    onChange=${(value: DateTimePickerProps<Dayjs, unknown>) =>
                      props.setFieldValue("arrival_time", value, true)}
                    value=${props.values.arrival_time}
                    renderInput=${(
                      params: DateTimePickerProps<Dayjs, unknown>
                    ) => html`
                      <${TextField}
                        ...${params}
                        margin="normal"
                        label="Hora de llegada"
                        id="arrival_time"
                        name="arrival_time"
                        variant="outlined"
                        sx=${{ width: { xs: 1, md: 0.49 } }}
                        value=${props.values.arrival_time}
                        onChange=${props.handleChange}
                        error=${props.touched.arrival_time &&
                        Boolean(props.errors.arrival_time)}
                        helperText=${props.touched.arrival_time &&
                        props.errors.arrival_time}
                      />
                    `}
                  />
                  <${DateTimePicker}
                    onChange=${(value: DateTimePickerProps<Dayjs, unknown>) =>
                      props.setFieldValue("response_time", value, true)}
                    value=${props.values.response_time}
                    renderInput=${(
                      params: DateTimePickerProps<Dayjs, unknown>
                    ) => html`
                      <${TextField}
                        ...${params}
                        margin="normal"
                        label="Hora de respuesta"
                        id="response_time"
                        name="response_time"
                        variant="outlined"
                        sx=${{ width: { xs: 1, md: 0.49 } }}
                        value=${props.values.response_time}
                        onChange=${props.handleChange}
                        error=${props.touched.response_time &&
                        Boolean(props.errors.response_time)}
                        helperText=${props.touched.response_time &&
                        props.errors.response_time}
                      />
                    `}
                  />
                <//>
                <${Box}
                  sx=${{
                    display: "flex",
                    flexFlow: "row wrap",
                    width: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <${DateTimePicker}
                    onChange=${(value: DateTimePickerProps<Dayjs, unknown>) =>
                      props.setFieldValue("finish_time", value, true)}
                    value=${props.values.finish_time}
                    renderInput=${(
                      params: DateTimePickerProps<Dayjs, unknown>
                    ) => html`
                      <${TextField}
                        ...${params}
                        margin="normal"
                        label="Hora de finalización"
                        id="finish_time"
                        name="finish_time"
                        variant="outlined"
                        sx=${{ width: { xs: 1, md: 0.49 } }}
                        value=${props.values.finish_time}
                        onChange=${props.handleChange}
                        error=${props.touched.finish_time &&
                        Boolean(props.errors.finish_time)}
                        helperText=${props.touched.finish_time &&
                        props.errors.finish_time}
                      />
                    `}
                  />
                  <${DateTimePicker}
                    onChange=${(value: DateTimePickerProps<Dayjs, unknown>) =>
                      props.setFieldValue("response_time", value, true)}
                    value=${props.values.attention_time}
                    renderInput=${(
                      params: DateTimePickerProps<Dayjs, unknown>
                    ) => html`
                      <${TextField}
                        ...${params}
                        margin="normal"
                        label="Hora de atencion"
                        id="attention_time"
                        name="attention_time"
                        variant="outlined"
                        sx=${{ width: { xs: 1, md: 0.49 } }}
                        value=${props.values.attention_time}
                        onChange=${props.handleChange}
                        error=${props.touched.attention_time &&
                        Boolean(props.errors.attention_time)}
                        helperText=${props.touched.attention_time &&
                        props.errors.attention_time}
                      />
                    `}
                  />
                <//>
              <//>
            `;
          }}
        <//>
      <//>
    `
  );
}
