import { BrowserRouter, Route, Routes } from "react-router-dom";
import { html } from "htm/preact";
import AuthController from "./pages/AuthController";
import Layout from "./components/Layout";
import Landing from "./pages/admin/Landing";
import Login from "./pages/Login";

function Router() {
  return html`
    <${BrowserRouter}>
      <${Routes}>
        <${Route} path="/" element=${html`<${AuthController} />`}>
          <${Route} index element=${html`<${Login} />`} />
					<${Route} path="redirect" element=${html`<p>Redirect</p>`}>
          <${Route} path="admin" element=${html`<${Layout} />`}>
            <${Route} index element=${html`<${Landing} />`} />
          <//>
        <//>
      <//>
    <//>
  `;
}

export default Router;
