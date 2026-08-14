import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5180,
    open: false,
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@power-ui/dom",
  },
  optimizeDeps: {
    exclude: [
      "@power-ui/core",
      "@power-ui/dom",
      "@power-ui/router",
      "@power-ui/ui",
    ],
  },
});
