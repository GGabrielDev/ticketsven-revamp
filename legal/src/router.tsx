import { Route, Routes, Navigate, Outlet } from "react-router"
import { lazy, Suspense, useState } from "react"
import LoadingFallback from "./components/utilities/LoadingFallback"
import RoleSelector from "./components/RoleSelector"
import { useAppSelector } from "./redux/hooks"
import { selectors } from "./redux/features/user/userSlice"
import AuthController from "./controllers/AuthController"

const { selectUser } = selectors

// Lazy-loaded components
const Login = lazy(() => import("./pages/Login"))
const LegalDashboard = lazy(() => import("./pages/LegalDashboard"))
const UnauthorizedRole = lazy(() => import("./pages/UnauthorizedRole"))

export default function AppRouter() {
  const [initialLoad, setInitialLoad] = useState(true)

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<LoginOnlyRoute />} />
        <Route
          path="/*"
          element={
            <AuthController
              initialLoad={initialLoad}
              setInitialLoad={setInitialLoad}
            />
          }
        >
          <Route index element={<ProtectedContent />} />
          <Route path="legal/*" element={<LegalDashboard />} />
          <Route path="unauthorized" element={<UnauthorizedRole />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

// Simplified ProtectedContent component:
function ProtectedContent() {
  const user = useAppSelector(selectUser)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

function ProtectedRoutes() {
  const user = useAppSelector(selectUser)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <Routes>
      {/* Add /* to the parent route */}
      <Route path="/*" element={<RoleBasedLayout />}>
        <Route index element={<RoleContent />} />
        <Route path="legal/*" element={<LegalDashboard />} />
        <Route path="unauthorized" element={<UnauthorizedRole />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function RoleBasedLayout() {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  )
}

function RoleContent() {
  const user = useAppSelector(selectUser)

  // Type-safe null check
  if (!user) return <Navigate to="/login" replace />

  // Handle optional roles array
  const roles = user.roles || []

  if (roles.length > 1) {
    return <RoleSelector roles={roles} />
  }

  switch (roles[0]?.name) {
    case "legal":
      return <Navigate to="legal" replace />
    default:
      return <Navigate to="unauthorized" replace />
  }
}

function LoginOnlyRoute() {
  const user = useAppSelector(selectUser)
  return user ? <Navigate to="/" replace /> : <Login />
}
