import { useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { useNavigate, Outlet } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { selectors, actions } from "../redux/features/user/userSlice";

const { getUser, clearToken } = actions;
const { selectUser, selectStatus } = selectors;

export default function AuthController() {
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    switch (status) {
      case "Idle":
        if (!user) dispatch(getUser());
        break;
      case "Error":
        dispatch(clearToken());
        navigate("/");
        break;
      case "Login":
        navigate("/redirect");
    }
  }, [user, status]);

  return status === "Loading"
    ? html` <${Box}
        sx=${{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <${CircularProgress} size=${64} />
      <//>`
    : html`<${Outlet} />`;
}
