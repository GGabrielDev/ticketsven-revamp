import { BrowserRouter, Route, Routes } from "react-router-dom";
import { html } from "htm/preact";
import { useAppSelector } from "./redux/hooks";
import { selectors } from "./redux/features/user/userSlice";
import AuthController from "./pages/AuthController";
import Layout from "./components/admin/Layout";
import Landing from "./pages/admin/Landing";
import Login from "./pages/Login";
import Municipality from "./pages/admin/Municipality";
import Parish from "./pages/admin/Parish";

const { selectUser } = selectors;

function Router() {
  const user = useAppSelector(selectUser);

  return html`
    <${BrowserRouter}>
      <${AuthController}>
        <${Routes}>
          <${Route} path="/">
            <${Route} index element=${html`<${Login} />`} />
            ${user && user.role.name === "admin"
              ? html`
                  <${Route} path="dashboard" element=${html`<${Layout} />`}>
                    <${Route} index element=${html`<${Landing} />`} />
                    <${Route}
                      path="municipality"
                      element=${html`<${Municipality} />`}
                    />
                    <${Route} path="parish" element=${html`<${Parish} />`} />
                  <//>
                `
              : null}
          <//>
        <//>
      <//>
    <//>
  `;
}

export default Router;
