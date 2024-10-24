import Box from "@mui/material/Box"
import CircularProgress from "@mui/material/CircularProgress"

const LoadingBox = () => {
  return (
    <Box
      sx={{
        width: 1,
        height: "100%",
        p: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={64} />
    </Box>
  )
}

export default LoadingBox
