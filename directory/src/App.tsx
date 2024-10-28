import { useEffect } from "react"
import { Box, Typography } from "@mui/material"

import { useAppDispatch, useAppSelector } from "./redux/hooks"
import { selectors, actions } from "./redux/features/contacts"

const { getAllContacts } = actions
const { selectContacts } = selectors

export default function App() {
  const contacts = useAppSelector(selectContacts)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getAllContacts())
  }, [dispatch])

  // console.log(contacts)
  return (
    <Box
      sx={{
        minWidth: "auto",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          typography: "h1",
        }}
      >
        Directorio Telefonico
      </Typography>
      <Typography
        sx={{
          textAlign: "center",
          typography: "subtitle1",
        }}
      >
        CCCT VEN 9-1-1
      </Typography>
    </Box>
  )
}
