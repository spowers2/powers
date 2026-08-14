/**
 * Bundle-size baseline for @powers/core.
 * Uses esbuild to produce a minified ESM bundle, then reports raw + gzip bytes.
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
  platform: "neutral",
  write: false,
  // Keep package side-effect free; tree-shake unused exports when consumers import subset.
  treeShaking: true,
});

const code = result.outputFiles[0]?.text ?? "";
const raw = Buffer.byteLength(code, "utf8");
const gzip = gzipSync(code).length;

mkdirSync(outdir, { recursive: true });
writeFileSync(join(outdir, "core.min.js"), code);
writeFileSync(
  join(outdir, "size.json"),
  JSON.stringify(
    {
      package: "@powers/core",
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

console.log("\n@powers/core size baseline");
console.log(`  minified : ${raw} bytes (${(raw / 1024).toFixed(2)} KB)`);
console.log(`  gzip     : ${gzip} bytes (${(gzip / 1024).toFixed(2)} KB)`);
console.log(`  written  : packages/core/dist-size/`);
console.log();

// Soft budget — tighten as we optimize. Fail CI if core balloons accidentally.
const GZIP_BUDGET = 8 * 1024; // 8 KB
if (gzip > GZIP_BUDGET) {
  console.error(
    `FAIL: gzip ${gzip} bytes exceeds budget ${GZIP_BUDGET} bytes`,
  );
  process.exit(1);
}
console.log(`  budget   : OK (≤ ${GZIP_BUDGET} bytes gzip)\n`);
