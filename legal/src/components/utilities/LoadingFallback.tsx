import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

// Simple functional component with proper export
const LoadingFallback = () => (
  <Box
    sx={{
      width: "100%",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress size={64} />
  </Box>
)

export default LoadingFallback
