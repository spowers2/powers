import * as esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const kitRoot = join(__dirname, "..");
const dist = join(__dirname, "dist");
mkdirSync(dist, { recursive: true });

const catalog = JSON.parse(
  readFileSync(join(kitRoot, "components/export/catalog.json"), "utf8"),
);
const names = catalog.components.map((c) => c.name);
const variables = readFileSync(
  join(kitRoot, "tokens/export/figma-variables.json"),
  "utf8",
);

const watch = process.argv.includes("--watch");

const ctx = await esbuild.context({
  entryPoints: [join(__dirname, "src/code.ts")],
  bundle: true,
  outfile: join(dist, "code.js"),
  target: "es2017",
  format: "iife",
  logLevel: "info",
  define: {
    __POWERS_CATALOG_NAMES__: JSON.stringify(names),
    __POWERS_VARIABLES_JSON__: JSON.stringify(variables),
  },
});

if (watch) {
  await ctx.watch();
  console.log("watching…");
} else {
  await ctx.rebuild();
  await ctx.dispose();
}

// UI: inject as __html__ string into a thin wrapper? Figma expects separate ui file.
// code.ts uses __html__ — esbuild define for that from ui.html
const uiHtml = readFileSync(join(__dirname, "src/ui.html"), "utf8");
// Rebuild code with __html__
await esbuild.build({
  entryPoints: [join(__dirname, "src/code.ts")],
  bundle: true,
  outfile: join(dist, "code.js"),
  target: "es2017",
  format: "iife",
  logLevel: "info",
  define: {
    __POWERS_CATALOG_NAMES__: JSON.stringify(names),
    __POWERS_VARIABLES_JSON__: JSON.stringify(variables),
    __html__: JSON.stringify(uiHtml),
  },
});

copyFileSync(join(__dirname, "manifest.json"), join(dist, "manifest.json"));
// Also keep ui path for manifest — we inlined via __html__, but manifest still points to ui
writeFileSync(join(dist, "ui.html"), uiHtml);
console.log(
  `Built plugin → design-kit/plugin/dist (catalog ${names.length} components, variables embedded)`,
);
