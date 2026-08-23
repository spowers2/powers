import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const src = path.join(root, "templates", "powers-vite");
const dest = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../template");

function rm(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const a = path.join(from, entry.name);
    const b = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(a, b);
    else fs.copyFileSync(a, b);
  }
}

if (!fs.existsSync(src)) {
  console.error("Missing templates/powers-vite at", src);
  process.exit(1);
}

rm(dest);
copyDir(src, dest);
console.log("Synced templates/powers-vite → packages/create-powers/template");
