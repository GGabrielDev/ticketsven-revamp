import { useEffect } from "react"
import { useNavigate, Outlet } from "react-router"
import LoadingBox from "../components/utilities/LoadingBox"
import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { selectors, actions } from "../redux/features/user/userSlice"

const { getUser, clearToken } = actions
const { selectUser, selectStatus, selectToken } = selectors

export default function AuthController({
  initialLoad,
  setInitialLoad,
}: {
  initialLoad: boolean
  setInitialLoad: (value: boolean) => void
}) {
  const user = useAppSelector(selectUser)
  const token = useAppSelector(selectToken)
  const status = useAppSelector(selectStatus)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false)
      return
    }

    const authCheck = async () => {
      if (token) {
        if (!user) {
          await dispatch(getUser())
        }
        navigate("/", { replace: true })
      } else {
        navigate("/login", { replace: true })
      }
    }

    authCheck()
  }, [token, user, dispatch, navigate, initialLoad, setInitialLoad])

  useEffect(() => {
    if (status === "Error") {
      dispatch(clearToken())
      navigate("/login", { replace: true })
    }
  }, [status, dispatch, navigate])

  if (token && !user) {
    return <LoadingBox message="Verificando credenciales..." />
  }

  return <Outlet />
}
