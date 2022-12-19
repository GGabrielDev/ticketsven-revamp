import { html } from "htm/preact";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  SxProps,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Formik, FormikHelpers, FormikProps, Field } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { actions, selectors } from "../redux/features/user/userSlice";
import Logo from "../assets/logo.png";

type FormData = {
  username: string;
  password: string;
};

const { loginUser } = actions;
const { selectError } = selectors;

export default function LoginPage() {
  // Define the initial values for the form
  const initialValues: FormData = {
    username: "",
    password: "",
  };
  const error = useAppSelector(selectError);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // Define the validation schema for the form using Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(4, "El nombre de usuario debe de tener al menos 4 caracteres")
      .matches(/^\S*$/, "El nombre de usuario no puede contener espacios")
      .required("El campo es requerido"),
    password: Yup.string()
      .min(4, "La contraseña debe de tener al menos 4 caracteres")
      .matches(/^\S*$/, "La contraseña no puede contener espacios")
      .required("El campo es requerido"),
  });

  // Define the submit handler for the form
  const handleSubmit = (
    values: FormData,
    { setSubmitting }: FormikHelpers<FormData>
  ) => {
    dispatch(loginUser(values)).then(() => setSubmitting(false));
  };

  // Define the render method for the form component
  return html`
    <${Grid} container component="main" sx=${{ height: "100vh" }}>
      <${Grid}
        item
        xs=${false}
        sm=${4}
        md=${7}
        sx=${{
          backgroundImage: "url(https://source.unsplash.com/random)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[50]
              : theme.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        } as SxProps<typeof theme>}
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
        ${error !== undefined
          ? error.message === "Autorización del Token fallida."
            ? ""
            : html`<${Alert} severity="error">${error.message}<//>`
          : ""}
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
          <${Formik}
            initialValues=${initialValues}
            validationSchema=${validationSchema}
            onSubmit=${handleSubmit}
          >
            ${(props: FormikProps<FormData>) => html`
              <${Box}
                component="form"
                noValidate
                sx=${{ mt: 1 }}
                onReset=${props.handleReset}
                onSubmit=${props.handleSubmit}
              >
                <${Field}
                  as=${TextField}
                  margin="normal"
                  fullWidth
                  label="Nombre de Usuario"
                  id="username"
                  name="username"
                  autoComplete="username"
                  value=${props.values.username}
                  onChange=${props.handleChange}
                  error=${props.touched.username &&
                  Boolean(props.errors.username)}
                  helperText=${props.touched.username && props.errors.username}
                />
                <${Field}
                  as=${TextField}
                  margin="normal"
                  fullWidth
                  label="Contraseña"
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value=${props.values.password}
                  onChange=${props.handleChange}
                  error=${props.touched.password &&
                  Boolean(props.errors.password)}
                  helperText=${props.touched.password && props.errors.password}
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
      <//>
    <//>
  `;
}
