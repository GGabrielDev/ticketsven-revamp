import { html } from "htm/preact";
import { useEffect, useState } from "preact/hooks";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectors as userSelectors } from "../../redux/features/user/userSlice";
import {
  selectors as supervisorSelectors,
  actions as supervisorActions,
} from "../../redux/features/supervisor/slice";

const { selectUser } = userSelectors;
const { selectDates } = supervisorSelectors;

const { getDates } = supervisorActions;

export default function Landing() {
  const user = useAppSelector(selectUser);
  const dates = useAppSelector(selectDates);
  const dispatch = useAppDispatch();

  const handleSelectedDate = (e: Event) => {
    e.preventDefault();
    const target = e.target as HTMLSelectElement;
    console.log(target.value);
  };

  useEffect(() => {
    dispatch(getDates());
  }, []);

  return html`
    <${Container}
      maxWidth="sm"
      sx=${{
        display: "flex",
        flexFlow: "column wrap",
        alignItems: "center",
        height: "100%",
        p: 2,
      }}
    >
      <${Box} sx=${{ mb: 2 }}>
        <${Typography} variant="h4" textAlign="center">
          Seleccione una fecha:
        <//>
          <${FormControl} fullWidth sx=${{ flexDirection: "row", gap: 1 }}>
          <${InputLabel} id="date">Rango de Fecha<//>
          <${Select}
            labelId="date"
            value=""
            label="Rango de Fecha"
            onChange=${handleSelectedDate}
            sx=${{ flex: 1 }}
          >
            ${dates?.map((date) => {
              const dateString = new Date(date[0]).toLocaleDateString("es-VE", {
                month: "long",
                year: "numeric",
              });
              return html`
                <${MenuItem} value=${date}>
                  ${dateString.charAt(0).toUpperCase() + dateString.slice(1)}
                <//>
              `;
            })}
          <//>
          <${Button} variant="outlined">Hoy<//>
          <${Button} variant="outlined">Ayer<//>
        <//>
      <//>
    </${Container}>
  `;
}
