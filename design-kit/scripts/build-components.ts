/**
 * Build phase-2 component exports for Figma authors + phase-3 plugin.
 *
 * Outputs under design-kit/components/export/:
 *   catalog.json     — full machine-readable catalog
 *   by-category.json — grouped
 *   index.md         — human index
 *   pages.md         — Figma page plan + build order
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { catalog } from "../components/catalog.js";
import type { ComponentCategory, ComponentSpec } from "../components/_schema.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "components", "export");
const checkOnly = process.argv.includes("--check");

const REQUIRED = [
  "Button",
  "Input",
  "Card",
  "Badge",
  "Alert",
  "Dialog",
  "Tabs",
  "Checkbox",
  "Switch",
  "Text",
];

function validate() {
  const names = new Set(catalog.components.map((c) => c.name));
  for (const r of REQUIRED) {
    if (!names.has(r)) throw new Error(`Missing required component: ${r}`);
  }
  for (const c of catalog.components) {
    if (!c.cssClass?.startsWith("pu-")) {
      throw new Error(`${c.name}: cssClass should start with pu-`);
    }
    if (!c.tokens || Object.keys(c.tokens).length === 0) {
      throw new Error(`${c.name}: tokens required`);
    }
    if (!c.category) throw new Error(`${c.name}: category required`);
  }
  const dups = catalog.components.map((c) => c.name);
  const seen = new Set<string>();
  for (const n of dups) {
    if (seen.has(n)) throw new Error(`Duplicate component: ${n}`);
    seen.add(n);
  }
}

function byCategory(): Record<ComponentCategory, ComponentSpec[]> {
  const map = {} as Record<ComponentCategory, ComponentSpec[]>;
  for (const cat of catalog.categories) map[cat] = [];
  for (const c of catalog.components) {
    map[c.category].push(c);
  }
  return map;
}

function indexMd(): string {
  const lines: string[] = [
    `# Powers UI kit — component index`,
    ``,
    `Generated from \`components/catalog.ts\`. **${catalog.components.length}** components.`,
    ``,
    `| # | Component | Category | Figma page | Variants | Sizes |`,
    `|---|---|---|---|---|---|`,
  ];
  let i = 1;
  for (const c of catalog.components) {
    const vars = c.variants?.map((v) => v.name).join(", ") || "—";
    const sizes = c.sizes?.map((s) => s.name).join(", ") || "—";
    lines.push(
      `| ${i++} | **${c.name}** | ${c.category} | ${c.figmaPage ?? ""} | ${vars} | ${sizes} |`,
    );
  }
  lines.push(``, `See [FIGMA_BUILD.md](../FIGMA_BUILD.md) for how to construct the file.`, ``);
  return lines.join("\n");
}

function pagesMd(): string {
  const grouped = byCategory();
  const lines: string[] = [
    `# Figma file structure`,
    ``,
    `Create one Figma page per section (or frames on a single Cover + kit page).`,
    ``,
  ];
  for (const cat of catalog.categories) {
    const items = grouped[cat];
    if (!items.length) continue;
    const page = items[0]!.figmaPage;
    lines.push(`## ${page}`);
    lines.push(``);
    for (const c of items) {
      lines.push(`### ${c.name} (\`${c.cssClass}\`)`);
      lines.push(``);
      if (c.description) lines.push(`${c.description}`);
      lines.push(``);
      lines.push(`- **Build order:** ${c.buildOrder}`);
      if (c.properties?.length) {
        lines.push(`- **Properties:**`);
        for (const p of c.properties) {
          const opts = p.options ? ` [${p.options.join(" | ")}]` : "";
          lines.push(`  - \`${p.name}\` (${p.kind})${opts}`);
        }
      }
      if (c.variants?.length) {
        lines.push(`- **Variants:** ${c.variants.map((v) => v.name).join(", ")}`);
      }
      if (c.sizes?.length) {
        lines.push(`- **Sizes:** ${c.sizes.map((s) => s.name).join(", ")}`);
      }
      if (c.states?.length) {
        lines.push(`- **States:** ${c.states.join(", ")}`);
      }
      lines.push(`- **Sample:** ${c.sampleContent ?? "—"}`);
      if (c.notes) lines.push(`- **Notes:** ${c.notes}`);
      lines.push(`- **Key tokens:**`);
      const entries = Object.entries(c.tokens).slice(0, 12);
      for (const [k, v] of entries) {
        lines.push(`  - \`${k}\` → \`${v}\``);
      }
      lines.push(``);
    }
  }
  return lines.join("\n");
}

function main() {
  validate();

  const payload = {
    ...catalog,
    generatedAt: new Date().toISOString(),
    count: catalog.components.length,
  };
  const grouped = byCategory();
  const summary = {
    version: catalog.version,
    count: catalog.components.length,
    byCategory: Object.fromEntries(
      catalog.categories.map((c) => [c, grouped[c].map((x) => x.name)]),
    ),
  };

  const catalogJson = JSON.stringify(payload, null, 2) + "\n";
  const groupedJson = JSON.stringify(grouped, null, 2) + "\n";
  const summaryJson = JSON.stringify(summary, null, 2) + "\n";
  const index = indexMd();
  const pages = pagesMd();

  if (checkOnly) {
    const p = join(outDir, "catalog.json");
    if (!existsSync(p)) throw new Error("Missing components/export/catalog.json — run build");
    const existing = JSON.parse(readFileSync(p, "utf8")) as { count?: number };
    if ((existing.count ?? 0) < REQUIRED.length) {
      throw new Error("catalog.json looks incomplete");
    }
    console.log(`design-kit components check OK (${existing.count} components)`);
    return;
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "catalog.json"), catalogJson);
  writeFileSync(join(outDir, "by-category.json"), groupedJson);
  writeFileSync(join(outDir, "summary.json"), summaryJson);
  writeFileSync(join(outDir, "index.md"), index);
  writeFileSync(join(outDir, "pages.md"), pages);

  console.log(
    `Wrote design-kit/components/export/* (${catalog.components.length} components)`,
  );
}

main();
