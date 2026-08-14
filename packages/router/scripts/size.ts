/**
 * Bundle-size gate for @power-ux/router (core + dom external).
 */
import { build } from "esbuild";
import { gzipSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const entry = join(__dirname, "../src/index.ts");
const outdir = join(__dirname, "../dist-size");

const result = await build({
  entryPoints: [entry],
  bundle: true,
  minify: true,
  format: "esm",
  platform: "browser",
  write: false,
  treeShaking: true,
  external: ["@power-ux/core", "@power-ux/dom"],
});

const code = result.outputFiles[0]?.text ?? "";
const raw = Buffer.byteLength(code, "utf8");
const gzip = gzipSync(code).length;

mkdirSync(outdir, { recursive: true });
writeFileSync(join(outdir, "router.min.js"), code);
writeFileSync(
  join(outdir, "size.json"),
  JSON.stringify(
    {
      package: "@power-ux/router",
      external: ["@power-ux/core", "@power-ux/dom"],
      rawBytes: raw,
      gzipBytes: gzip,
      rawKb: +(raw / 1024).toFixed(2),
      gzipKb: +(gzip / 1024).toFixed(2),
      measuredAt: new Date().toISOString(),
    },
    null,
    2,
  ),
);

console.log("\n@power-ux/router size baseline (core + dom external)");
console.log(`  minified : ${raw} bytes (${(raw / 1024).toFixed(2)} KB)`);
console.log(`  gzip     : ${gzip} bytes (${(gzip / 1024).toFixed(2)} KB)`);

const GZIP_BUDGET = 4 * 1024; // 4 KB
if (gzip > GZIP_BUDGET) {
  console.error(`FAIL: gzip ${gzip} exceeds budget ${GZIP_BUDGET}`);
  process.exit(1);
}
console.log(`  budget   : OK (≤ ${GZIP_BUDGET} bytes gzip)\n`);
