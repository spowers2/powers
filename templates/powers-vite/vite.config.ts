import { defineConfig } from "vite";
import { powers } from "@lab206/dom/vite";

export default defineConfig({
  plugins: [powers()],
  server: {
    port: 5190,
  },
});
