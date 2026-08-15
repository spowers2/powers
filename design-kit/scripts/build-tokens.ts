/**
 * Build Figma / Tokens Studio exports from design-kit/tokens/source.ts
 *
 * Outputs:
 *   tokens/export/tokens.studio.json   — Tokens Studio multi-set import
 *   tokens/export/figma-variables.json — flat collections for phase-3 plugin
 *   tokens/export/manifest.json        — version + theme list
 *
 * Uses `export/` (not `dist/`) so outputs can be committed; root .gitignore ignores dist/.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  THEME_IDS,
  tokensForTheme,
  getRaw,
  type FlatToken,
  type ThemeId,
  type TokenValue,
} from "../tokens/source.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outDir = join(root, "tokens", "export");
const checkOnly = process.argv.includes("--check");

function nestToken(
  rootObj: Record<string, unknown>,
  path: string[],
  leaf: Record<string, unknown>,
) {
  let cur: Record<string, unknown> = rootObj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]!;
    if (!cur[key] || typeof cur[key] !== "object") cur[key] = {};
    cur = cur[key] as Record<string, unknown>;
  }
  cur[path[path.length - 1]!] = leaf;
}

function studioValue(raw: TokenValue): unknown {
  return raw;
}

function toStudioSet(tokens: FlatToken[]): Record<string, unknown> {
  const set: Record<string, unknown> = {};
  for (const tok of tokens) {
    const raw = getRaw(tok);
    const leaf: Record<string, unknown> = {
      value: studioValue(raw),
      type: tok.type,
    };
    if (tok.description) leaf.description = tok.description;
    nestToken(set, tok.path, leaf);
  }
  return set;
}

/** Tokens Studio single-file multi-set export shape. */
function buildStudioFile(): Record<string, unknown> {
  const file: Record<string, unknown> = {};
  for (const theme of THEME_IDS) {
    file[theme] = toStudioSet(tokensForTheme(theme));
  }
  file.$themes = THEME_IDS.map((id, i) => ({
    id: `powers-${id.replace("/", "-")}`,
    name: id,
    selectedTokenSets: {
      [id]: "enabled",
    },
    $figmaStyleReferences: {},
    $figmaVariableReferences: {},
    group: id.startsWith("dual") ? "dual" : "instrument",
    orderIndex: i,
  }));
  file.$metadata = {
    tokenSetOrder: [...THEME_IDS],
    activeThemeGroup: "dual",
  };
  return file;
}

type FigmaVar = {
  name: string;
  path: string[];
  type: string;
  value: unknown;
  description?: string;
};

type FigmaCollection = {
  name: string;
  modes: { name: string; variables: FigmaVar[] }[];
};

/**
 * Phase-3 plugin input: two collections (instrument, dual), each with light/dark modes.
 * Variable names use slash paths e.g. color/accent
 */
function buildFigmaVariables(): {
  version: number;
  source: string;
  collections: FigmaCollection[];
} {
  function modeVars(theme: ThemeId): FigmaVar[] {
    return tokensForTheme(theme).map((tok) => {
      const raw = getRaw(tok);
      const v: FigmaVar = {
        name: tok.path.join("/"),
        path: tok.path,
        type: mapFigmaType(tok.type, raw),
        value: normalizeFigmaValue(raw),
      };
      if (tok.description) v.description = tok.description;
      return v;
    });
  }

  return {
    version: 1,
    source: "packages/ui/src/styles/tokens.css (mirrored in design-kit/tokens/source.ts)",
    collections: [
      {
        name: "Powers / instrument",
        modes: [
          { name: "light", variables: modeVars("instrument/light") },
          { name: "dark", variables: modeVars("instrument/dark") },
        ],
      },
      {
        name: "Powers / dual",
        modes: [
          { name: "light", variables: modeVars("dual/light") },
          { name: "dark", variables: modeVars("dual/dark") },
        ],
      },
    ],
  };
}

function mapFigmaType(
  type: FlatToken["type"],
  raw: TokenValue,
): "COLOR" | "FLOAT" | "STRING" | "BOOLEAN" {
  if (type === "color") return "COLOR";
  if (
    type === "spacing" ||
    type === "borderRadius" ||
    type === "fontSizes" ||
    type === "fontWeights" ||
    type === "lineHeights" ||
    type === "letterSpacing" ||
    type === "sizing" ||
    type === "opacity"
  ) {
    return "FLOAT";
  }
  if (type === "boxShadow") return "STRING"; // plugin can parse layers later
  void raw;
  return "STRING";
}

function normalizeFigmaValue(raw: TokenValue): unknown {
  if (typeof raw === "string") {
    // numeric strings → numbers for FLOAT vars
    if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
    if (raw.endsWith("ms") && /^\d+ms$/.test(raw)) return Number(raw.slice(0, -2));
    return raw;
  }
  if (Array.isArray(raw)) return JSON.stringify(raw);
  if (raw && typeof raw === "object" && "type" in raw) {
    return JSON.stringify(raw);
  }
  return raw;
}

function writeJson(path: string, data: unknown) {
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function main() {
  const studio = buildStudioFile();
  const figma = buildFigmaVariables();
  const manifest = {
    name: "Powers design-kit",
    version: "0.1.0",
    phase: 1,
    themes: THEME_IDS,
    generatedAt: new Date().toISOString(),
    outputs: [
      "tokens/export/tokens.studio.json",
      "tokens/export/figma-variables.json",
      "tokens/export/manifest.json",
    ],
    next: [
      "phase 2: design-kit/components/*.spec.json",
      "phase 3: design-kit/plugin (reads figma-variables.json)",
    ],
  };

  // Sanity: every theme has core semantic colors
  for (const theme of THEME_IDS) {
    const names = new Set(tokensForTheme(theme).map((t) => t.path.join(".")));
    for (const required of [
      "color.accent",
      "color.bg",
      "color.surface",
      "color.text",
      "space.4",
      "radius.md",
      "control.height.md",
    ]) {
      if (!names.has(required)) {
        throw new Error(`Theme ${theme} missing token ${required}`);
      }
    }
  }

  const studioJson = JSON.stringify(studio, null, 2) + "\n";
  const figmaJson = JSON.stringify(figma, null, 2) + "\n";
  const manifestJson = JSON.stringify(manifest, null, 2) + "\n";

  if (checkOnly) {
    const paths = [
      join(outDir, "tokens.studio.json"),
      join(outDir, "figma-variables.json"),
      join(outDir, "manifest.json"),
    ];
    for (const p of paths) {
      if (!existsSync(p)) throw new Error(`Missing build output: ${p}`);
    }
    // Rebuild and compare studio set count
    const existing = JSON.parse(readFileSync(paths[0]!, "utf8"));
    for (const id of THEME_IDS) {
      if (!existing[id]) throw new Error(`Check failed: ${id} missing in dist`);
    }
    console.log("design-kit tokens check OK");
    return;
  }

  mkdirSync(outDir, { recursive: true });
  // Drop legacy path if present
  const legacy = join(root, "tokens", "dist");
  if (existsSync(legacy)) rmSync(legacy, { recursive: true, force: true });
  writeFileSync(join(outDir, "tokens.studio.json"), studioJson, "utf8");
  writeFileSync(join(outDir, "figma-variables.json"), figmaJson, "utf8");
  writeFileSync(join(outDir, "manifest.json"), manifestJson, "utf8");

  const count = tokensForTheme("dual/light").length;
  console.log(`Wrote design-kit/tokens/export/* (${THEME_IDS.length} themes, ~${count} tokens each)`);
}

main();
