import { useEffect } from "preact/hooks";
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
import CCP from "./pages/admin/CCP";
import Quadrant from "./pages/admin/Quadrant";
import Reason from "./pages/admin/Reason";
import User from "./pages/admin/User";

const { selectUser } = selectors;

function Router() {
  const user = useAppSelector(selectUser);

  useEffect(() => {}, [user]);

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
                    <${Route} path="ccp" element=${html`<${CCP} />`} />
                    <${Route}
                      path="quadrant"
                      element=${html`<${Quadrant} />`}
                    />
                    <${Route} path="reasons" element=${html`<${Reason} />`} />
                    <${Route} path="users" element=${html`<${User} />`} />
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
