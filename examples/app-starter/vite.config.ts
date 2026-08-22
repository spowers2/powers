import { defineConfig } from "vite";
import { powersSrcAliases } from "../powers-vite-alias.mjs";

export default defineConfig({
  resolve: {
    alias: powersSrcAliases(import.meta.url),
  },
  server: {
    port: 5180,
    open: false,
  },
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@powers/dom",
  },
  optimizeDeps: {
    exclude: [
      "@powers/core",
      "@powers/dom",
      "@powers/router",
      "@powers/ui",
    ],
  },
});
