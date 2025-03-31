import { useEffect, useState } from "react"
import { Box, Typography, Button } from "@mui/material"

import FormContact from "./components/forms/FormContact"
import FormOrganism from "./components/forms/FormOrganism"
import FormOrganismGroup from "./components/forms/FormOrganismGroup"

import ContactTable from "./components/tables/ContactTable"

import type { MouseEvent } from "react"

import { useAppDispatch, useAppSelector } from "./redux/hooks"
import { selectors, actions } from "./redux/features/contacts"

const { getAllContacts } = actions
const { selectContacts } = selectors

export default function App() {
  const [isOrganismFormVisible, setIsOrganismFormVisible] = useState(false)
  const [isOrganismGroupFormVisible, setIsOrganismGroupFormVisible] =
    useState(false)
  const [isContactFormVisible, setIsContactFormVisible] = useState(false)

  const toggleOrganismForm = (e: MouseEvent) => {
    e.stopPropagation()
    setIsOrganismFormVisible(!isOrganismFormVisible)
  }

  const toggleOrganismGroupForm = (e: MouseEvent) => {
    e.stopPropagation()
    setIsOrganismGroupFormVisible(!isOrganismGroupFormVisible)
  }

  const toggleContactForm = (e: MouseEvent) => {
    e.stopPropagation()
    setIsContactFormVisible(!isContactFormVisible)
  }

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          minWidth: "auto",
        }}
      >
        <Button
          variant="outlined"
          sx={{ maxWidth: "250px", minWidth: "auto", width: "100%" }}
          onClick={toggleOrganismForm}
        >
          Crear Organismo
        </Button>
        <Button
          variant="outlined"
          sx={{ maxWidth: "250px", minWidth: "auto", width: "100%" }}
          onClick={toggleOrganismGroupForm}
        >
          Crear Grupo de Organismos
        </Button>
        <Button
          variant="contained"
          sx={{ maxWidth: "250px", minWidth: "auto", width: "100%" }}
          onClick={toggleContactForm}
        >
          Crear Contacto
        </Button>
      </Box>
      {isOrganismFormVisible ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={toggleOrganismForm}
        >
          <Box onClick={(e: MouseEvent) => e.stopPropagation()}>
            <FormOrganism />
          </Box>
        </Box>
      ) : null}
      {isOrganismGroupFormVisible ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={toggleOrganismGroupForm}
        >
          <Box onClick={(e: MouseEvent) => e.stopPropagation()}>
            <FormOrganismGroup />
          </Box>
        </Box>
      ) : null}
      {isContactFormVisible ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={toggleContactForm}
        >
          <Box onClick={(e: MouseEvent) => e.stopPropagation()}>
            <FormContact />
          </Box>
        </Box>
      ) : null}
      {contacts.length === 0 ? (
        <Typography
          variant="h4"
          sx={{
            margin: 2,
            textAlign: "center",
          }}
        >
          No Hay Contactos Disponibles
        </Typography>
      ) : (
        <ContactTable contacts={contacts} />
      )}
    </Box>
  )
}
