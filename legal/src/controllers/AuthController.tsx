import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoadingBox from "../components/utilities/LoadingBox"

import type { ReactNode } from "react"

import { useAppSelector, useAppDispatch } from "../redux/hooks"
import { selectors, actions } from "../redux/features/user/userSlice"

const { getUser, clearToken } = actions
const { selectUser, selectStatus, selectToken } = selectors

type AuthControllerProps = {
  children: ReactNode | ReactNode[]
}

export default function AuthController(props: AuthControllerProps) {
  const user = useAppSelector(selectUser)
  const token = useAppSelector(selectToken)
  const status = useAppSelector(selectStatus)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    switch (status) {
      case "Error":
        dispatch(clearToken())
        navigate("/")
        break
      case "Idle":
        if (!token) navigate("/")
    }
  }, [dispatch, navigate, status, token])

  useEffect(() => {
    dispatch(getUser())
    const interval = setInterval(() => {
      if (token) dispatch(getUser())
    }, 60000)
    return () => clearInterval(interval)
  }, [dispatch, token])

  return status === "Loading" && !token && !user ? (
    <LoadingBox />
  ) : (
    props.children
  )
}
