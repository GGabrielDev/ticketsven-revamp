import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"
import Typography from "@mui/material/Typography"

interface LoadingBoxProps {
  message?: string
}

const LoadingBox = ({ message }: LoadingBoxProps) => {
  return (
    <Box
      sx={{
        width: 1,
        height: "100%",
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={64} />
      {message && (
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  )
}

export default LoadingBox
