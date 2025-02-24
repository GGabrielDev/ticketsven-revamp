import { useState } from "react"
import {
  Box,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"
import ArrowDropUp from "@mui/icons-material/ArrowDropUp"
import ArrowDropDown from "@mui/icons-material/ArrowDropDown"

const ContactTable = ({ contacts }: { contacts: ContactType[] }) => {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [sortKey, setSortKey] = useState<"name" | "organism" | "organismGroup">(
    "name",
  )

  const handleSort = (key: "name" | "organism" | "organismGroup") => {
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc"
    setSortDirection(newDirection)
    setSortKey(key)
  }

  const sortedContacts = [...contacts].sort((a, b) => {
    const aValue = sortKey === "name" ? a.name : a.organism.name
    const bValue = sortKey === "name" ? b.name : b.organism.name

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  return (
    <Container maxWidth="md" sx={{ margin: "20px auto" }}>
      {" "}
      {/* Container to manage width */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell
                onClick={() => handleSort("name")}
                sx={{
                  width: "25%",
                  fontWeight: "bold",
                  backgroundColor: "primary.main",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <Box display="flex" alignItems="center">
                  Nombre{" "}
                  {sortKey === "name" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropUp />
                    ) : (
                      <ArrowDropDown />
                    ))}
                </Box>
              </TableCell>
              <TableCell
                align="left"
                sx={{
                  width: "20%",
                  fontWeight: "bold",
                  backgroundColor: "primary.main",
                  color: "white",
                }}
              >
                Numero de Telefono
              </TableCell>
              <TableCell
                onClick={() => handleSort("organismGroup")}
                sx={{
                  width: "25%",
                  fontWeight: "bold",
                  backgroundColor: "primary.main",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <Box display="flex" alignItems="center">
                  Grupo de Organismo{" "}
                  {sortKey === "organismGroup" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropUp />
                    ) : (
                      <ArrowDropDown />
                    ))}
                </Box>
              </TableCell>
              <TableCell
                onClick={() => handleSort("organism")}
                sx={{
                  width: "25%",
                  fontWeight: "bold",
                  backgroundColor: "primary.main",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                <Box display="flex" alignItems="center">
                  Organismo{" "}
                  {sortKey === "organism" &&
                    (sortDirection === "asc" ? (
                      <ArrowDropUp />
                    ) : (
                      <ArrowDropDown />
                    ))}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedContacts.map((entry, index) => (
              <TableRow
                key={entry.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  "&:hover": { backgroundColor: "#f1f1f1" },
                }}
              >
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.phone_number}</TableCell>
                <TableCell>{entry.organism.organismGroup.name}</TableCell>
                <TableCell>{entry.organism.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default ContactTable
