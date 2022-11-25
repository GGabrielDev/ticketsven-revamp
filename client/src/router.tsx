import { BrowserRouter, Route, Routes } from "react-router-dom";
import { html } from "htm/preact";
import Layout from "./components/Layout";
import Landing from "./pages/admin/Landing";
import Login from "./pages/Login";

function Router() {
  return html`
    <${BrowserRouter}>
      <${Routes}>
        <${Route} path="" element=${html`<${Layout} />`}>
          <${Route} index element=${html`<${Login} />`} />
          <${Route} path="admin">
            <${Route} index element=${html`<${Landing} />`} />
          <//>
        <//>
      <//>
    <//>
  `;
}

export default Router;
