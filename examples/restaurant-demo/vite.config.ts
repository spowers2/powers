import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5181,
    open: false,
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@power-ux/dom",
  },
  optimizeDeps: {
    exclude: [
      "@power-ux/core",
      "@power-ux/dom",
      "@power-ux/router",
      "@power-ux/ui",
    ],
  },
});
