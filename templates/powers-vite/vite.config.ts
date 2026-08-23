import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@lab206/dom",
  },
  server: {
    port: 5190,
  },
});
