import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    open: false,
  },
  // Workspace packages point at TypeScript sources.
  optimizeDeps: {
    exclude: ["@power-ui/core", "@power-ui/dom", "@power-ui/animate"],
  },
});
