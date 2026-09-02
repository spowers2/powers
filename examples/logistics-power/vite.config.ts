import { defineConfig } from "vite";
import { powersSrcAliases } from "../powers-vite-alias.mjs";

export default defineConfig({
  resolve: {
    alias: powersSrcAliases(import.meta.url),
  },
  server: {
    port: 5182,
    open: false,
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@lab206/dom",
  },
  optimizeDeps: {
    exclude: [
      "@lab206/core",
      "@lab206/dom",
      "@lab206/router",
      "@lab206/ui",
    ],
  },
});
