import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@power-ux/dom",
  },
  server: {
    port: 5190,
  },
});
