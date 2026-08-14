import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@power-ui/dom",
  },
  server: {
    port: 5190,
  },
});
