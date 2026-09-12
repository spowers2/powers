import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { powers } from "./vite.js";

describe("@lab206/dom/vite", () => {
  it("sets jsxImportSource to @lab206/dom", () => {
    const plugin = powers();
    const cfg = plugin.config();
    assert.equal(cfg.esbuild.jsxImportSource, "@lab206/dom");
    assert.equal(cfg.esbuild.jsx, "automatic");
    assert.ok(cfg.optimizeDeps.include.includes("@lab206/dom"));
  });

  it("throws on build when jsxImportSource was overridden", () => {
    const plugin = powers();
    assert.throws(
      () =>
        plugin.configResolved({
          command: "build",
          esbuild: { jsxImportSource: "react" },
        }),
      /React is not defined/,
    );
  });
});
