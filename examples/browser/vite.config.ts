import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    open: false,
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@power-ui/dom",
  },
  // Workspace packages point at TypeScript sources.
  optimizeDeps: {
    exclude: ["@power-ui/core", "@power-ui/dom", "@power-ui/animate"],
  },
});
