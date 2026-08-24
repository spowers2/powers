import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "@lab206/dom",
  },
  // Prebundle from dist, not package "development"→src (avoids React JSX transform).
  optimizeDeps: {
    include: ["@lab206/core", "@lab206/dom", "@lab206/ui"],
  },
  server: {
    port: 5190,
  },
});
