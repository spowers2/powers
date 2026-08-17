/**
 * Pull Powers UI Kit from Figma API and compare to components/export/catalog.json.
 *
 * Requires monorepo root .env.local:
 *   FIGMA_FILE_KEY=…
 *   FIGMA_ACCESS_TOKEN=…
 *
 * Usage:
 *   pnpm --filter @powers/design-kit figma:audit
 *   pnpm design-kit:figma-audit   # from monorepo root
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const kitRoot = join(__dirname, "..");
const monoRoot = join(kitRoot, "..");

function loadEnvLocal() {
  const path = join(monoRoot, ".env.local");
  if (!existsSync(path)) {
    throw new Error(`Missing ${path} — copy .env.example and set FIGMA_* vars`);
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

async function figma(path: string): Promise<unknown> {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  const key = process.env.FIGMA_FILE_KEY;
  if (!token || !key) {
    throw new Error("FIGMA_ACCESS_TOKEN and FIGMA_FILE_KEY required in .env.local");
  }
  const url = path.startsWith("http")
    ? path
    : `https://api.figma.com/v1/files/${key}${path}`;
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const msg =
      typeof data.message === "string" ? data.message : JSON.stringify(data);
    throw new Error(`Figma API ${res.status}: ${msg}`);
  }
  return data;
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

  const file = (await figma("?depth=3")) as {
    name: string;
    lastModified: string;
    document: FigmaNode;
  };

  const page = file.document.children?.[0];
  const frame = page?.children?.find((c) => c.type === "FRAME") ?? page?.children?.[0];
  if (!frame) throw new Error("No frame found on first page");

  // Full subtree for the main kit frame
  const nodesRes = (await figma(
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

  // Sample binding quality on high-value components
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
    const sampleRes = (await figma(
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

  // Variables endpoint (optional scope)
  let variablesStatus: string = "skipped";
  try {
    await figma("/variables/local");
    variablesStatus = "ok";
  } catch (e) {
    variablesStatus = e instanceof Error ? e.message : String(e);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    file: {
      name: file.name,
      key: process.env.FIGMA_FILE_KEY,
      lastModified: file.lastModified,
      page: page?.name,
      frame: root.name,
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
    variablesApi: variablesStatus,
    health: {
      catalogComplete: missing.length === 0 && extra.length === 0,
      bindingNotes:
        "pct = share of nodes with any boundVariables. rawSolidFills = solid fills without variable binding (approx).",
    },
  };

  const outDir = join(kitRoot, "figma");
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "audit-report.json");
  writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");

  console.log(`Figma: ${file.name} (${file.lastModified})`);
  console.log(`Frame: ${root.name} · nodes ${acc.all.length}`);
  console.log(
    `Catalog: ${matched.length}/${expected.size} matched · missing ${missing.length} · extra ${extra.length}`,
  );
  if (missing.length) console.log("  missing:", missing.join(", "));
  if (extra.length) console.log("  extra:", extra.join(", "));
  console.log("Binding sample (% nodes with Variables):");
  for (const [k, v] of Object.entries(binding)) {
    console.log(
      `  ${k.padEnd(12)} ${String(v.pct).padStart(5)}%  rawFills≈${v.rawSolidFills}`,
    );
  }
  console.log(`Variables API: ${variablesStatus.slice(0, 80)}`);
  console.log(`Wrote ${outPath}`);

  if (missing.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
