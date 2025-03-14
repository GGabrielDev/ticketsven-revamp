import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material"
import { useMemo } from "react"
import { useAppSelector } from "../redux/hooks"
import { selectors } from "../redux/features/user/userSlice"

import type { PaletteMode, ThemeOptions } from "@mui/material"
import type { ReactNode } from "react"

const { selectTheme } = selectors

export type ThemeProviderProps = {
  children: ReactNode | ReactNode[]
}

const getThemeOptions = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
          // Light mode overrides
        }
      : {
          // Dark mode overrides
        }),
  },
  // Add other theme customizations here
})

export default function ThemeProvider(props: ThemeProviderProps) {
  const themeMode = useAppSelector(selectTheme)

  const theme = useMemo(
    () => createTheme(getThemeOptions(themeMode)),
    [themeMode],
  )

  return <MUIThemeProvider theme={theme}>{props.children}</MUIThemeProvider>
}
