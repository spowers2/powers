import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
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
      "@powers/animate",
      "@powers/router",
      "@powers/ui",
    ],
    include: ["esbuild-wasm", "gsap"],
  },
  assetsInclude: ["**/*.wasm"],
});
