import * as esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
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
const uiHtml = readFileSync(join(__dirname, "src/ui.html"), "utf8");

const watch = process.argv.includes("--watch");

const define = {
  __POWERS_CATALOG_NAMES__: JSON.stringify(names),
  __POWERS_VARIABLES_JSON__: JSON.stringify(variables),
  __html__: JSON.stringify(uiHtml),
};

/** Root manifest: Development import from design-kit/plugin/manifest.json */
const rootManifest = {
  name: "Powers Design Kit",
  id: "1671016490810398688",
  api: "1.0.0",
  main: "dist/code.js",
  ui: "dist/ui.html",
  capabilities: [],
  enableProposedApi: false,
  documentAccess: "dynamic-page",
  editorType: ["figma"],
  networkAccess: { allowedDomains: ["none"] },
};

/** Dist-local manifest: if someone imports plugin/dist/manifest.json */
const distManifest = {
  ...rootManifest,
  main: "code.js",
  ui: "ui.html",
};

async function buildOnce() {
  await esbuild.build({
    entryPoints: [join(__dirname, "src/code.ts")],
    bundle: true,
    outfile: join(dist, "code.js"),
    target: "es2017",
    format: "iife",
    logLevel: "info",
    define,
  });
  writeFileSync(join(dist, "ui.html"), uiHtml);
  writeFileSync(
    join(__dirname, "manifest.json"),
    JSON.stringify(rootManifest, null, 2) + "\n",
  );
  writeFileSync(
    join(dist, "manifest.json"),
    JSON.stringify(distManifest, null, 2) + "\n",
  );
  console.log(
    `Built plugin → design-kit/plugin/dist (catalog ${names.length} components, variables embedded)`,
  );
}

if (watch) {
  const ctx = await esbuild.context({
    entryPoints: [join(__dirname, "src/code.ts")],
    bundle: true,
    outfile: join(dist, "code.js"),
    target: "es2017",
    format: "iife",
    logLevel: "info",
    define,
    plugins: [
      {
        name: "write-manifests",
        setup(build) {
          build.onEnd((result) => {
            if (result.errors.length) return;
            writeFileSync(join(dist, "ui.html"), uiHtml);
            writeFileSync(
              join(__dirname, "manifest.json"),
              JSON.stringify(rootManifest, null, 2) + "\n",
            );
            writeFileSync(
              join(dist, "manifest.json"),
              JSON.stringify(distManifest, null, 2) + "\n",
            );
          });
        },
      },
    ],
  });
  await ctx.watch();
  console.log("watching…");
} else {
  await buildOnce();
}
