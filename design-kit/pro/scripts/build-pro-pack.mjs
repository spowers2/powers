#!/usr/bin/env node
/**
 * Assemble Powers Pro Design Kit zip under design-kit/pro/dist/
 *
 *   pnpm --filter @lab206/design-kit pro:pack
 *   # or: node design-kit/pro/scripts/build-pro-pack.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const proRoot = path.resolve(__dirname, "..");
const kitRoot = path.resolve(proRoot, "..");
const repoRoot = path.resolve(kitRoot, "..");
const packSrc = path.join(proRoot, "pack");
const distDir = path.join(proRoot, "dist");
const stageName = "powers-pro-design-kit";
const version = "0.1.0";
const stage = path.join(distDir, stageName);

function rm(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === ".DS_Store" || entry.name === "node_modules") continue;
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
}

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

rm(stage);
fs.mkdirSync(stage, { recursive: true });

// Core pack content
copyDir(packSrc, stage);

// License at root of zip
copyFile(
  path.join(proRoot, "LICENSE-PRO.md"),
  path.join(stage, "LICENSE-PRO.md"),
);

// Fresh exports snapshot
const exportsDir = path.join(stage, "exports");
copyDir(path.join(kitRoot, "tokens", "export"), path.join(exportsDir, "tokens"));
copyDir(
  path.join(kitRoot, "components", "export"),
  path.join(exportsDir, "components"),
);

const builtAt = new Date().toISOString();
const manifest = {
  name: "powers-pro-design-kit",
  version,
  builtAt,
  license: "LICENSE-PRO.md",
  homepage: "https://lab206.com",
  inquire: "https://lab206.com/contact?subject=Powers%20Pro",
  contents: {
    patterns: [
      "auth-signin",
      "auth-signup",
      "auth-forgot",
      "settings",
      "admin-list",
      "billing",
      "dashboard",
      "empty",
    ],
    themes: ["slate", "warm", "mono"],
    handoff: ["CLIENT_DELIVERY.md", "QUALITY_GATES.md"],
    starters: ["designlab206.md", "hearth.md"],
    exports: ["tokens", "components"],
  },
  notes: [
    "Private Figma file share is fulfilled by email after purchase.",
    "Core npm packages remain BSL — Pro is design/handoff only.",
  ],
};

fs.writeFileSync(
  path.join(stage, "MANIFEST.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);

const zipName = `${stageName}-${version}.zip`;
const zipPath = path.join(distDir, zipName);
rm(zipPath);

execFileSync("zip", ["-r", zipPath, stageName], {
  cwd: distDir,
  stdio: "inherit",
});

const bytes = fs.statSync(zipPath).size;
console.log(`\n✓ Pro pack ready`);
console.log(`  ${zipPath}`);
console.log(`  ${(bytes / 1024).toFixed(1)} KB`);
console.log(`\nNext: upload to LemonSqueezy/Gumroad or email to buyers.`);
