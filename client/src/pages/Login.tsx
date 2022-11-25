import { useState } from "preact/hooks";
import { html } from "htm/preact";
import {
  Box,
  Button,
  Grid,
  Paper,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import Logo from "../assets/logo.png";
import { theme as Theme } from "../app";

type FormState = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
  });

  const handleChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement)
      setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    console.log(form);
  };

  return html`
    <${Grid} container component="main" sx=${{ height: "100vh" }}>
      <${Grid}
        item
        xs=${false}
        sm=${4}
        md=${7}
        sx=${
          {
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          } as SxProps<typeof Theme>
        }
      />
      <${Grid}
        item
        xs=${12}
        sm=${8}
        md=${5}
        component=${Paper}
        elevation=${6}
        square
      >
        <${Box}
          sx=${{
            my: 8,
            mx: 4,
            gap: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
            <${Box}
              component="img"
              href="/"
              sx=${{
                height: 92,
              }}
              alt="Your logo."
              src=${Logo}
            />
          <${Typography} component="h1" variant="h5">
            Inicie sesión en el sistema
          <//>
          <${Box}
            component="form"
            noValidate
            onSubmit=${handleSubmit}
            sx=${{ mt: 1 }}
          >
            <${TextField}
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nombre de Usuario"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <${TextField}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <${Button}
              type="submit"
              fullWidth
              variant="contained"
              sx=${{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            <//>
          <//>
        <//>
      <//>
    </${Grid}>
  `;
}
