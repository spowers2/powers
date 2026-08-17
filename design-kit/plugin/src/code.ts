/// <reference types="@figma/plugin-typings" />

/**
 * Powers Design Kit — runs inside Figma (full Variables API; no Enterprise REST needed).
 *
 * Actions (from UI):
 * - sync-variables: create/update collections Powers / dual + Powers / instrument
 * - audit: list catalog coverage on the current file
 * - stubs: create missing catalog components as simple Auto-layout stubs
 */

type EmbeddedVar = {
  name: string;
  path: string[];
  type: string;
  value: unknown;
};

type EmbeddedCollection = {
  name: string;
  modes: Array<{ name: string; variables: EmbeddedVar[] }>;
};

type EmbeddedPayload = {
  version: number;
  collections: EmbeddedCollection[];
};

declare const __html__: string;

const catalogNames: string[] = __POWERS_CATALOG_NAMES__;
const variablesPayload = JSON.parse(__POWERS_VARIABLES_JSON__) as EmbeddedPayload;

figma.showUI(__html__, { width: 360, height: 480, themeColors: true });

function parseColor(value: unknown): RGBA | null {
  if (typeof value !== "string") return null;
  const s = value.trim();
  // #rgb #rrggbb
  if (s.startsWith("#")) {
    let hex = s.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length !== 6) return null;
    const n = parseInt(hex, 16);
    return {
      r: ((n >> 16) & 255) / 255,
      g: ((n >> 8) & 255) / 255,
      b: (n & 255) / 255,
      a: 1,
    };
  }
  // rgba(r,g,b,a) or rgb
  const m = s.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i,
  );
  if (m) {
    return {
      r: Number(m[1]) / 255,
      g: Number(m[2]) / 255,
      b: Number(m[3]) / 255,
      a: m[4] !== undefined ? Number(m[4]) : 1,
    };
  }
  return null;
}

function toFloat(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && /^-?\d+(\.\d+)?$/.test(value)) {
    return Number(value);
  }
  return null;
}

async function syncVariables(): Promise<string> {
  const lines: string[] = [];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  const existing = await figma.variables.getLocalVariableCollectionsAsync();
  const byName = new Map(existing.map((c) => [c.name, c]));

  for (const coll of variablesPayload.collections) {
    let collection = byName.get(coll.name);
    if (!collection) {
      collection = figma.variables.createVariableCollection(coll.name);
      byName.set(coll.name, collection);
      lines.push(`Created collection: ${coll.name}`);
    }

    // Ensure modes
    const modeByName = new Map(collection.modes.map((m) => [m.name, m.modeId]));
    // First mode is created with collection — rename if needed
    if (collection.modes.length === 1 && coll.modes[0]) {
      const first = collection.modes[0]!;
      if (first.name !== coll.modes[0].name) {
        collection.renameMode(first.modeId, coll.modes[0].name);
        modeByName.delete(first.name);
        modeByName.set(coll.modes[0].name, first.modeId);
      }
    }
    for (const mode of coll.modes) {
      if (!modeByName.has(mode.name)) {
        const id = collection.addMode(mode.name);
        modeByName.set(mode.name, id);
      }
    }

    // Index existing variables in this collection
    const allVars = await figma.variables.getLocalVariablesAsync();
    const varByName = new Map(
      allVars
        .filter((v) => v.variableCollectionId === collection!.id)
        .map((v) => [v.name, v]),
    );

    // Use first mode's variable list as the master name list (all modes share names)
    const master = coll.modes[0]?.variables ?? [];
    for (const def of master) {
      const figmaType =
        def.type === "COLOR"
          ? "COLOR"
          : def.type === "FLOAT"
            ? "FLOAT"
            : def.type === "BOOLEAN"
              ? "BOOLEAN"
              : "STRING";

      let variable = varByName.get(def.name);
      if (!variable) {
        try {
          variable = figma.variables.createVariable(
            def.name,
            collection,
            figmaType as VariableResolvedDataType,
          );
          varByName.set(def.name, variable);
          created++;
        } catch {
          skipped++;
          continue;
        }
      }

      for (const mode of coll.modes) {
        const modeId = modeByName.get(mode.name);
        if (!modeId) continue;
        const modeVar = mode.variables.find((v) => v.name === def.name) ?? def;
        try {
          if (figmaType === "COLOR") {
            const rgba = parseColor(modeVar.value);
            if (!rgba) {
              skipped++;
              continue;
            }
            variable.setValueForMode(modeId, rgba);
            updated++;
          } else if (figmaType === "FLOAT") {
            const n = toFloat(modeVar.value);
            if (n === null) {
              skipped++;
              continue;
            }
            variable.setValueForMode(modeId, n);
            updated++;
          } else if (figmaType === "STRING") {
            variable.setValueForMode(modeId, String(modeVar.value ?? ""));
            updated++;
          } else if (figmaType === "BOOLEAN") {
            variable.setValueForMode(modeId, Boolean(modeVar.value));
            updated++;
          }
        } catch {
          skipped++;
        }
      }
    }
  }

  lines.push(
    `Variables: +${created} created, ${updated} mode values set, ${skipped} skipped (non-bindable types/values).`,
  );
  lines.push(
    "Tip: Prefer semantic names (color/accent, space/4). Re-bind components if they still use raw hex.",
  );
  return lines.join("\n");
}

/**
 * documentAccess: "dynamic-page" requires an explicit load before reading page children.
 * @see https://www.figma.com/plugin-docs/api/properties/figma-loadallpagesasync/
 */
async function ensurePagesLoaded() {
  if (typeof figma.loadAllPagesAsync === "function") {
    await figma.loadAllPagesAsync();
  } else {
    for (const page of figma.root.children) {
      if (page.type === "PAGE" && "loadAsync" in page) {
        await (page as PageNode & { loadAsync(): Promise<void> }).loadAsync();
      }
    }
  }
}

function collectComponentNames(node: BaseNode, into: Set<string>) {
  if (node.type === "COMPONENT_SET") {
    into.add(node.name);
  } else if (node.type === "COMPONENT") {
    // Only count top-level-ish: parent not a set
    const parent = node.parent;
    if (!parent || parent.type !== "COMPONENT_SET") {
      into.add(node.name);
    }
  }
  if ("children" in node) {
    for (const c of (node as ChildrenMixin).children) {
      collectComponentNames(c, into);
    }
  }
}

async function auditCatalog(): Promise<string> {
  await ensurePagesLoaded();
  const found = new Set<string>();
  for (const page of figma.root.children) {
    collectComponentNames(page, found);
  }
  const missing = catalogNames.filter((n) => !found.has(n));
  const extra = [...found]
    .filter((n) => !catalogNames.includes(n) && !n.includes("="))
    .sort();

  const lines = [
    `Catalog components: ${catalogNames.length}`,
    `Found in file: ${[...found].filter((n) => catalogNames.includes(n)).length}`,
    `Missing: ${missing.length ? missing.join(", ") : "(none)"}`,
    `Extra (not in catalog): ${extra.length ? extra.slice(0, 20).join(", ") + (extra.length > 20 ? "…" : "") : "(none)"}`,
  ];
  return lines.join("\n");
}

async function createStubs(): Promise<string> {
  await ensurePagesLoaded();
  const found = new Set<string>();
  for (const page of figma.root.children) {
    collectComponentNames(page, found);
  }
  const missing = catalogNames.filter((n) => !found.has(n));
  if (!missing.length) {
    return "No missing components — catalog fully present. Nothing to stub.";
  }

  let page = figma.root.children.find((p) => p.name === "Generated stubs");
  if (!page) {
    page = figma.createPage();
    page.name = "Generated stubs";
  }
  await figma.setCurrentPageAsync(page);

  let x = 0;
  let y = 0;
  const colW = 200;
  const rowH = 80;
  let col = 0;

  for (const name of missing) {
    const comp = figma.createComponent();
    comp.name = name;
    comp.layoutMode = "HORIZONTAL";
    comp.primaryAxisAlignItems = "CENTER";
    comp.counterAxisAlignItems = "CENTER";
    comp.paddingLeft = 16;
    comp.paddingRight = 16;
    comp.paddingTop = 10;
    comp.paddingBottom = 10;
    comp.cornerRadius = 8;
    comp.fills = [{ type: "SOLID", color: { r: 0.95, g: 0.96, b: 0.98 } }];
    comp.strokes = [{ type: "SOLID", color: { r: 0.7, g: 0.75, b: 0.82 } }];
    comp.strokeWeight = 1;
    const label = figma.createText();
    // default font
    try {
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      label.fontName = { family: "Inter", style: "Regular" };
    } catch {
      await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
      label.fontName = { family: "Roboto", style: "Regular" };
    }
    label.characters = name;
    label.fontSize = 12;
    label.fills = [{ type: "SOLID", color: { r: 0.05, g: 0.12, b: 0.22 } }];
    comp.appendChild(label);
    comp.x = x;
    comp.y = y;
    col++;
    if (col >= 4) {
      col = 0;
      x = 0;
      y += rowH;
    } else {
      x += colW;
    }
  }

  return `Created ${missing.length} stub component(s) on page "Generated stubs":\n${missing.join(", ")}\nReplace stubs with real kit components when ready.`;
}

figma.ui.onmessage = async (msg: { type: string }) => {
  try {
    if (msg.type === "sync-variables") {
      const text = await syncVariables();
      figma.ui.postMessage({ type: "result", text });
      figma.notify("Powers: variables synced");
    } else if (msg.type === "audit") {
      const text = await auditCatalog();
      figma.ui.postMessage({ type: "result", text });
    } else if (msg.type === "stubs") {
      const text = await createStubs();
      figma.ui.postMessage({ type: "result", text });
      figma.notify("Powers: stubs updated");
    } else if (msg.type === "close") {
      figma.closePlugin();
    }
  } catch (e) {
    const text = e instanceof Error ? e.message : String(e);
    figma.ui.postMessage({ type: "result", text: `Error: ${text}` });
    figma.notify("Powers plugin error", { error: true });
  }
};
