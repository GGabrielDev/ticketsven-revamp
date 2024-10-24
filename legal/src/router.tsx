import { BrowserRouter, Route, Routes } from "react-router-dom"

import AuthController from "./controllers/AuthController"

import { useAppSelector } from "./redux/hooks"
import { selectors } from "./redux/features/user/userSlice"

const { selectUser } = selectors

function Router() {
  const user = useAppSelector(selectUser)

  return (
    <BrowserRouter>
      <AuthController>
        <Routes>
          <Route path="/"></Route>
        </Routes>
      </AuthController>
    </BrowserRouter>
  )
}

export default Router
