/**
 * Pull Powers UI Kit from Figma API and compare to components/export/catalog.json.
 * With PAT scope `file_variables:read`, also dumps Variable collections and
 * compares names to design-kit token paths.
 *
 * Requires monorepo root .env.local:
 *   FIGMA_FILE_KEY=…
 *   FIGMA_ACCESS_TOKEN=…   # scopes: file_content:read + file_variables:read
 *
 * Usage:
 *   pnpm design-kit:figma-audit
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { THEME_IDS, tokensForTheme } from "../tokens/source.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const kitRoot = join(__dirname, "..");
const monoRoot = join(kitRoot, "..");

const SCOPES_HELP = `
Variables API needs Figma Enterprise scope file_variables:read (often not shown on other plans).
For component audits, enable PAT UI: "Read the contents of and render images from files".
See design-kit/FIGMA.md.
`.trim();

function loadEnvLocal() {
  const path = join(monoRoot, ".env.local");
  if (!existsSync(path)) {
    throw new Error(`Missing ${path} — copy .env.example and set FIGMA_* vars\n${SCOPES_HELP}`);
  }
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

async function figma(
  path: string,
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; status: number; message: string }> {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const key = process.env.FIGMA_FILE_KEY;
  if (!token || !key) {
    throw new Error(`FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY required\n${SCOPES_HELP}`);
  }
  const url = path.startsWith("http")
    ? path
    : `https://api.figma.com/v1/files/${key}${path}`;
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const msg =
      typeof data.message === "string" ? data.message : JSON.stringify(data);
    return { ok: false, status: res.status, message: msg };
  }
  return { ok: true, data };
}

async function figmaRequired(path: string): Promise<Record<string, unknown>> {
  const r = await figma(path);
  if (!r.ok) throw new Error(`Figma API ${r.status}: ${r.message}`);
  return r.data;
}

type FigmaNode = {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
  boundVariables?: Record<string, unknown>;
  fills?: Array<Record<string, unknown>>;
};

function walk(
  n: FigmaNode,
  parentType: string | null,
  acc: {
    sets: Set<string>;
    standalone: Set<string>;
    all: Array<{ depth: number; type: string; name: string }>;
  },
  depth = 0,
) {
  acc.all.push({ depth, type: n.type, name: n.name });
  if (n.type === "COMPONENT_SET") acc.sets.add(n.name);
  if (n.type === "COMPONENT" && parentType !== "COMPONENT_SET") {
    acc.standalone.add(n.name);
  }
  for (const c of n.children ?? []) walk(c, n.type, acc, depth + 1);
}

function countBindings(n: FigmaNode): {
  nodes: number;
  withBound: number;
  rawSolidFills: number;
} {
  let nodes = 0;
  let withBound = 0;
  let rawSolidFills = 0;
  const visit = (node: FigmaNode) => {
    nodes++;
    if (node.boundVariables && Object.keys(node.boundVariables).length) {
      withBound++;
    }
    for (const f of node.fills ?? []) {
      const visible = f.visible !== false;
      const solid = f.type === "SOLID";
      const bv = f.boundVariables as Record<string, unknown> | undefined;
      if (visible && solid && !bv) rawSolidFills++;
    }
    for (const c of node.children ?? []) visit(c);
  };
  visit(n);
  return { nodes, withBound, rawSolidFills };
}

/** Token paths as Figma-style names: color/accent, space/4 */
function designKitTokenPaths(): Set<string> {
  const paths = new Set<string>();
  for (const theme of THEME_IDS) {
    for (const tok of tokensForTheme(theme)) {
      paths.add(tok.path.join("/"));
    }
  }
  return paths;
}

type VariablesReport = {
  status: "ok" | "missing_scope" | "error";
  message?: string;
  collections?: Array<{
    name: string;
    modes: string[];
    variableCount: number;
  }>;
  variableNames?: string[];
  /** In design-kit tokens, not found as a Figma variable name */
  missingInFigma?: string[];
  /** In Figma, not in design-kit token paths */
  extraInFigma?: string[];
  matchedCount?: number;
  designKitPathCount?: number;
};

function parseVariablesLocal(data: Record<string, unknown>): VariablesReport {
  const meta = (data.meta ?? data) as {
    variables?: Record<
      string,
      { name: string; variableCollectionId?: string; resolvedType?: string }
    >;
    variableCollections?: Record<
      string,
      { name: string; modes?: Array<{ modeId: string; name: string }>; variableIds?: string[] }
    >;
  };

  const variables = meta.variables ?? {};
  const collections = meta.variableCollections ?? {};

  const variableNames = Object.values(variables)
    .map((v) => v.name)
    .filter(Boolean)
    .sort();

  const collectionSummaries = Object.values(collections).map((c) => ({
    name: c.name,
    modes: (c.modes ?? []).map((m) => m.name),
    variableCount: (c.variableIds ?? []).length,
  }));

  const designPaths = designKitTokenPaths();
  const figmaNames = new Set(variableNames);

  // Figma often uses color/accent; we use the same. Also try without collection prefix.
  const normalize = (n: string) => n.replace(/^\//, "").trim();
  const figmaNorm = new Set([...figmaNames].map(normalize));

  const missingInFigma = [...designPaths]
    .filter((p) => !figmaNorm.has(p) && !figmaNorm.has(p.replace(/\//g, ".")))
    .sort();
  const extraInFigma = [...figmaNorm]
    .filter((p) => !designPaths.has(p) && !designPaths.has(p.replace(/\//g, ".")))
    .sort();
  const matchedCount = designPaths.size - missingInFigma.length;

  return {
    status: "ok",
    collections: collectionSummaries,
    variableNames,
    missingInFigma,
    extraInFigma,
    matchedCount,
    designKitPathCount: designPaths.size,
  };
}

async function fetchVariables(): Promise<VariablesReport> {
  const r = await figma("/variables/local");
  if (!r.ok) {
    const needsScope =
      r.status === 403 &&
      (r.message.includes("file_variables") || r.message.includes("scope"));
    return {
      status: needsScope ? "missing_scope" : "error",
      message: r.message,
    };
  }
  return parseVariablesLocal(r.data);
}

async function main() {
  loadEnvLocal();

  const catalogPath = join(kitRoot, "components/export/catalog.json");
  if (!existsSync(catalogPath)) {
    throw new Error("Run pnpm design-kit:build first (missing catalog.json)");
  }
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8")) as {
    components: Array<{ name: string }>;
  };
  const expected = new Set(catalog.components.map((c) => c.name));

  const file = (await figmaRequired("?depth=3")) as {
    name: string;
    lastModified: string;
    document: FigmaNode;
  };

  const pages = file.document.children ?? [];
  const pageSummaries = pages.map((p) => ({
    name: p.name,
    childCount: (p.children ?? []).length,
  }));

  // Prefer page named Components, else first page with a large frame
  let page =
    pages.find((p) => /component/i.test(p.name)) ?? pages[0];
  let frame =
    page?.children?.find((c) => c.type === "FRAME" && /power|kit|comp/i.test(c.name)) ??
    page?.children?.find((c) => c.type === "FRAME") ??
    page?.children?.[0];

  // Patterns page detection
  const patternsPage = pages.find((p) => /pattern/i.test(p.name));

  if (!frame) throw new Error("No frame found to audit");

  const nodesRes = (await figmaRequired(
    `/nodes?ids=${encodeURIComponent(frame.id)}&depth=8`,
  )) as { nodes: Record<string, { document: FigmaNode }> };
  const root = nodesRes.nodes[frame.id]?.document;
  if (!root) throw new Error("Could not load frame document");

  const acc = {
    sets: new Set<string>(),
    standalone: new Set<string>(),
    all: [] as Array<{ depth: number; type: string; name: string }>,
  };
  walk(root, null, acc);

  const figmaKit = new Set(
    [...acc.sets, ...acc.standalone].filter((n) => n && !n.includes("=")),
  );
  const matched = [...expected].filter((n) => figmaKit.has(n)).sort();
  const missing = [...expected].filter((n) => !figmaKit.has(n)).sort();
  const extra = [...figmaKit].filter((n) => !expected.has(n)).sort();

  const targets: Record<string, string> = {};
  for (const c of root.children ?? []) {
    if (c.type === "COMPONENT" || c.type === "COMPONENT_SET") {
      targets[c.name] = c.id;
    }
  }
  const sampleNames = [
    "Button",
    "Input",
    "Text",
    "Card",
    "Badge",
    "Alert",
    "Dialog",
    "Checkbox",
    "Switch",
    "Field",
  ];
  const sampleIds = sampleNames.map((n) => targets[n]).filter(Boolean) as string[];
  const binding: Record<
    string,
    { nodes: number; withBound: number; rawSolidFills: number; pct: number }
  > = {};
  if (sampleIds.length) {
    const sampleRes = (await figmaRequired(
      `/nodes?ids=${encodeURIComponent(sampleIds.join(","))}`,
    )) as { nodes: Record<string, { document: FigmaNode }> };
    for (const name of sampleNames) {
      const id = targets[name];
      if (!id || !sampleRes.nodes[id]) continue;
      const stats = countBindings(sampleRes.nodes[id]!.document);
      binding[name] = {
        ...stats,
        pct: Math.round((1000 * stats.withBound) / Math.max(stats.nodes, 1)) / 10,
      };
    }
  }

  const variables = await fetchVariables();

  const report = {
    generatedAt: new Date().toISOString(),
    file: {
      name: file.name,
      key: process.env.FIGMA_FILE_KEY,
      lastModified: file.lastModified,
      pages: pageSummaries,
      page: page?.name,
      frame: root.name,
      patternsPage: patternsPage?.name ?? null,
    },
    catalog: {
      expected: expected.size,
      matched: matched.length,
      missing,
      extra,
      matchedNames: matched,
    },
    figma: {
      componentSets: [...acc.sets].sort(),
      standaloneComponents: [...acc.standalone].sort(),
      nodeCount: acc.all.length,
    },
    bindingSample: binding,
    variables,
    health: {
      catalogComplete: missing.length === 0 && extra.length === 0,
      variablesReadable: variables.status === "ok",
      patternsPagePresent: Boolean(patternsPage),
      bindingNotes:
        "pct = share of nodes with any boundVariables. rawSolidFills = solid fills without variable binding (approx).",
    },
  };

  const outDir = join(kitRoot, "figma");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "audit-report.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");

  if (variables.status === "ok" && variables.variableNames) {
    writeFileSync(
      join(outDir, "variables-export.json"),
      JSON.stringify(
        {
          generatedAt: report.generatedAt,
          fileKey: process.env.FIGMA_FILE_KEY,
          collections: variables.collections,
          variables: variables.variableNames,
          vsDesignKit: {
            designKitPathCount: variables.designKitPathCount,
            matchedCount: variables.matchedCount,
            missingInFigma: variables.missingInFigma,
            extraInFigma: variables.extraInFigma,
          },
        },
        null,
        2,
      ) + "\n",
    );
  }

  console.log(`Figma: ${file.name} (${file.lastModified})`);
  console.log(`Pages: ${pageSummaries.map((p) => p.name).join(", ") || "(none)"}`);
  console.log(`Frame: ${root.name} · nodes ${acc.all.length}`);
  console.log(
    `Catalog: ${matched.length}/${expected.size} matched · missing ${missing.length} · extra ${extra.length}`,
  );
  if (missing.length) console.log("  missing:", missing.join(", "));
  if (extra.length) console.log("  extra:", extra.join(", "));
  console.log(`Patterns page: ${patternsPage?.name ?? "(none)"}`);
  console.log("Binding sample (% nodes with Variables):");
  for (const [k, v] of Object.entries(binding)) {
    console.log(
      `  ${k.padEnd(12)} ${String(v.pct).padStart(5)}%  rawFills≈${v.rawSolidFills}`,
    );
  }

  if (variables.status === "ok") {
    console.log("Variables API: OK");
    for (const c of variables.collections ?? []) {
      console.log(
        `  collection "${c.name}" modes=[${c.modes.join(", ")}] vars≈${c.variableCount}`,
      );
    }
    console.log(
      `  vs design-kit tokens: matched ~${variables.matchedCount}/${variables.designKitPathCount}`,
    );
    const miss = variables.missingInFigma ?? [];
    const show = miss.slice(0, 12);
    if (show.length) {
      console.log(`  missing in Figma (sample): ${show.join(", ")}${miss.length > 12 ? "…" : ""}`);
    }
    console.log(`Wrote ${join(outDir, "variables-export.json")}`);
  } else if (variables.status === "missing_scope") {
    console.log("Variables API: unavailable (Enterprise scope file_variables:read — often not on PAT list)");
    console.log("  Component + binding audit above is complete without it. See design-kit/FIGMA.md.");
  } else {
    console.log(`Variables API: ${variables.message}`);
  }

  console.log(`Wrote ${outPath}`);

  if (missing.length) process.exitCode = 1;
  // Don't fail CI on missing variables scope — local tooling only
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
