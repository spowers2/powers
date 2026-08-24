#!/usr/bin/env node
/**
 * Scaffold a Powers + Vite app from the embedded template.
 *
 *   pnpm create powers my-app
 *   npm create powers@latest my-app
 *   npx create-powers my-app
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE = path.join(__dirname, "..", "template");

function usage(code = 1) {
  console.log(`Usage: create-powers <name-or-path>

  create-powers my-app
  create-powers ./apps/dashboard

Then:
  cd <dir>
  pnpm install   # or npm install
  pnpm dev       # → http://localhost:5190
`);
  process.exit(code);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else fs.copyFileSync(from, to);
  }
}

function main() {
  const raw = process.argv[2];
  if (!raw || raw === "-h" || raw === "--help") usage(raw ? 0 : 1);

  const dest = path.resolve(process.cwd(), raw);
  const base = path.basename(dest);

  if (fs.existsSync(dest)) {
    console.error(`Refusing to overwrite: ${dest}`);
    process.exit(1);
  }
  if (!fs.existsSync(TEMPLATE)) {
    console.error(`Missing template at ${TEMPLATE}`);
    process.exit(1);
  }

  copyDir(TEMPLATE, dest);

  const pkgPath = path.join(dest, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pkg.name = base.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "powers-app";
    const ver = "^0.1.4";
    pkg.dependencies = {
      ...(pkg.dependencies || {}),
      "@lab206/core": ver,
      "@lab206/dom": ver,
      "@lab206/ui": ver,
    };
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
  }

  console.log(`Created ${dest}\n`);
  console.log("Next:");
  console.log(`  cd ${raw}`);
  console.log("  pnpm install   # or: npm install");
  console.log("  pnpm dev       # → http://localhost:5190\n");
  console.log("Docs: https://lab206.com/docs");
  console.log("Lab:  https://lab206.com/lab?recipe=hello");
}

main();
