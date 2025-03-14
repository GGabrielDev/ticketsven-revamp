import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"
import { reactRouter } from "@react-router/dev/vite"
import { reactRouterDevTools } from "react-router-devtools"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRouterDevTools(), reactRouter(), tsconfigPaths()],
  server: {
    open: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
})
