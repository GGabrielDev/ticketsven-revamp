import { VNode } from "preact";
import { useEffect } from "preact/hooks";
import { html } from "htm/preact";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { selectors, actions } from "../redux/features/user/userSlice";

const { getUser, clearToken } = actions;
const { selectUser, selectStatus } = selectors;

type AuthControllerProps = {
  children: VNode | VNode[];
};

export default function AuthController(props: AuthControllerProps) {
  const user = useAppSelector(selectUser);
  const status = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    switch (status) {
      case "Error":
        dispatch(clearToken());
        navigate("/");
        break;
      case "Login":
        navigate("/dashboard");
    }
  }, [user, status]);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  return status === "Loading"
    ? html` <${Box}
        sx=${{
          width: "100%",
          height: "100%",
					p: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <${CircularProgress} size=${64} />
      <//>`
    : props.children;
}
