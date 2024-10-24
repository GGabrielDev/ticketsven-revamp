/*
import { useMemo } from "react";
import {
  createTheme,
  PaletteMode,
  ThemeProvider as MUIThemeProvider,
  ThemeOptions,
} from "@mui/material-ui";
import { useAppSelector } from "../redux/hooks";
import { selectors } from "../redux/features/user/userSlice";

export interface ThemeProviderProps {
  children: VNode[] | VNode;
}

const { selectTheme } = selectors;

const getThemeOptions = (mode: PaletteMode = "light"): ThemeOptions => ({
  palette: {
    mode,
  },
});

export default function ThemeProvider(props: ThemeProviderProps) {
  const themeMode = useAppSelector(selectTheme);

  const theme = useMemo(
    () => createTheme(getThemeOptions(themeMode)),
    [themeMode]
  );

  return html` <${MUIThemeProvider} theme=${theme}> ${props.children} <//> `;
}
*/

// TODO: Create redux store to handle light/dark mode (as shown in the snippet above)

import { createTheme, ThemeProvider as MUIThemeProvider } from "@mui/material"
import { useMemo } from "react"

import type { PaletteMode, ThemeOptions } from "@mui/material"
import type { ReactNode } from "react"

export type ThemeProviderProps = {
  children: ReactNode | ReactNode[]
}

const getThemeOptions = (mode: PaletteMode = "light"): ThemeOptions => ({
  palette: {
    mode,
  },
})

export default function ThemeProvider(props: ThemeProviderProps) {
  const theme = useMemo(() => createTheme(getThemeOptions()), [])

  return <MUIThemeProvider theme={theme}> {props.children} </MUIThemeProvider>
}
