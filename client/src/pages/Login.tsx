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
import {
  Controller,
  ControllerRenderProps,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import Logo from "../assets/logo.png";
import { theme as Theme } from "../app";

type FormData = {
  username: string;
  password: string;
};

/*
 */

export default function LoginPage() {
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormData>();
  const { username, password } = watch();

  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

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
            onSubmit=${handleSubmit(onSubmit)}
            sx=${{ mt: 1 }}
          >
						<${Controller} 
							name="username" 
							control=${control}	
							rules=${{
                required: "Se necesita nombre de usuario",
              }}
							render=${({
                field,
              }: {
                field: ControllerRenderProps<FormData, "username">;
              }) => html`
                <${TextField}
                  error=${Boolean(errors.username)}
                  helperText=${errors.username?.message
                    ? errors.username.message
                    : ""}
                  margin="normal"
                  fullWidth
                  label="Nombre de Usuario"
                  autoComplete="username"
                  autoFocus
                  ...${field}
                />
              `}
						/>
						<${Controller} 
							name="password" 
							control=${control}	
							rules=${{
                required: "Se requiere una contraseña",
              }}
							render=${({
                field,
              }: {
                field: ControllerRenderProps<FormData, "password">;
              }) => html`
                <${TextField}
                  error=${Boolean(errors.password)}
                  helperText=${errors.password?.message
                    ? errors.password.message
                    : ""}
                  margin="normal"
                  fullWidth
                  label="Contraseña"
                  type="password"
                  autoComplete="current-password"
                  ...${field}
                />
              `}
						/>
            <${Button}
							disabled=${!Boolean(username && password)}
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
