import { defineConfig } from "vite";

export default defineConfig({
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
