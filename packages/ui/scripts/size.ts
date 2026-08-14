/**
 * Bundle-size gates for @power-ux/ui (core + dom external).
 *
 * - full: entire public index (worst-case "import *")
 * - form-kit: Button + Input + Field + Stack + theme (golden path)
 */
import { build } from "esbuild";
import { gzipSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outdir = join(__dirname, "../dist-size");
const external = ["@power-ux/core", "@power-ux/dom"];

type Measure = {
  name: string;
  entry: string;
  outFile: string;
  /** gzip budget bytes */
  budget: number;
};

const targets: Measure[] = [
  {
    name: "@power-ux/ui (full index)",
    entry: join(__dirname, "../src/index.ts"),
    outFile: "ui-full.min.js",
    // Full catalog — leave headroom for new primitives; fail on accidental bloat
    budget: 32 * 1024,
  },
  {
    name: "@power-ux/ui form-kit",
    entry: join(__dirname, "../src/size-entries/form-kit.ts"),
    outFile: "ui-form-kit.min.js",
    // Golden path: Button · Input · Field · Stack · theme · form helpers
    budget: 12 * 1024,
  },
];

mkdirSync(outdir, { recursive: true });

const results: Array<{
  name: string;
  rawBytes: number;
  gzipBytes: number;
  budget: number;
  ok: boolean;
}> = [];

let failed = false;

for (const t of targets) {
  const result = await build({
    entryPoints: [t.entry],
    bundle: true,
    minify: true,
    format: "esm",
    platform: "browser",
    write: false,
    treeShaking: true,
    external,
    jsx: "automatic",
    jsxImportSource: "@power-ux/dom",
  });

  const code = result.outputFiles[0]?.text ?? "";
  const raw = Buffer.byteLength(code, "utf8");
  const gzip = gzipSync(code).length;
  const ok = gzip <= t.budget;
  if (!ok) failed = true;

  writeFileSync(join(outdir, t.outFile), code);
  results.push({
    name: t.name,
    rawBytes: raw,
    gzipBytes: gzip,
    budget: t.budget,
    ok,
  });

  console.log(`\n${t.name}`);
  console.log(`  minified : ${raw} bytes (${(raw / 1024).toFixed(2)} KB)`);
  console.log(`  gzip     : ${gzip} bytes (${(gzip / 1024).toFixed(2)} KB)`);
  console.log(
    `  budget   : ${ok ? "OK" : "FAIL"} (≤ ${t.budget} bytes gzip)`,
  );
}

writeFileSync(
  join(outdir, "size.json"),
  JSON.stringify(
    {
      package: "@power-ux/ui",
      external,
      measuredAt: new Date().toISOString(),
      results,
    },
    null,
    2,
  ),
);

console.log(`\n  written  : packages/ui/dist-size/\n`);

if (failed) {
  console.error("FAIL: one or more @power-ux/ui size budgets exceeded");
  process.exit(1);
}
