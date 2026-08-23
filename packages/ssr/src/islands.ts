import { createRoot, type Dispose } from "@lab206/core";
import { mount, type MountResult } from "@lab206/dom";

export type IslandFactory = () => MountResult;
export type IslandRegistry = Record<string, IslandFactory>;

export const ISLAND_ATTR = "data-pu-island";

/**
 * Mark a host element as a client island (sets `data-pu-island`).
 * During SSR the inner HTML is serialized; on the client call `hydrateIslands`.
 */
export function markIsland(name: string, host?: HTMLElement): HTMLElement {
  const el = host ?? document.createElement("div");
  el.setAttribute(ISLAND_ATTR, name);
  return el;
}

/**
 * Create an island host and mount `app` into it (SSR + client create path).
 * Prefer this when building trees that will be stringified, then hydrated.
 *
 * @example
 * ```ts
 * // server
 * const html = await renderToString(() =>
 *   island("counter", () => <Counter />)
 * );
 *
 * // client
 * hydrateIslands({ counter: () => <Counter /> });
 * ```
 */
export function island(name: string, app: IslandFactory): HTMLElement {
  const host = markIsland(name);
  // Mount interactive tree into the island host
  const result = app();
  if (result == null) return host;
  const nodes = Array.isArray(result) ? result : [result];
  for (const n of nodes) {
    if (n) host.appendChild(n as Node);
  }
  return host;
}

export interface HydrateIslandsOptions {
  /** Document or subtree to search (default: document) */
  root?: ParentNode;
  /**
   * Called when a `data-pu-island` has no factory.
   * Default: console.warn
   */
  onMissing?: (name: string, el: HTMLElement) => void;
  /**
   * If true, leave server HTML when no factory is registered.
   * Default: true
   */
  preserveOnMissing?: boolean;
}

/**
 * Hydrate all `[data-pu-island]` nodes under `root` using a name → factory map.
 * Clears server HTML inside each island and mounts the client app.
 * Returns a dispose that tears down every island.
 */
export function hydrateIslands(
  registry: IslandRegistry,
  rootOrOptions: ParentNode | HydrateIslandsOptions = document,
): Dispose {
  const options: HydrateIslandsOptions =
    rootOrOptions && typeof rootOrOptions === "object" && "nodeType" in rootOrOptions
      ? { root: rootOrOptions as ParentNode }
      : (rootOrOptions as HydrateIslandsOptions);

  const root = options.root ?? document;
  const preserveOnMissing = options.preserveOnMissing !== false;
  const onMissing =
    options.onMissing ??
    ((name: string) => {
      console.warn(`[powers/ssr] No island registered for "${name}"`);
    });

  const disposers: Dispose[] = [];
  const nodes = root.querySelectorAll?.(`[${ISLAND_ATTR}]`) ?? [];

  nodes.forEach((node) => {
    const el = node as HTMLElement;
    const name = el.getAttribute(ISLAND_ATTR);
    if (!name) return;
    const factory = registry[name];
    if (!factory) {
      onMissing(name, el);
      if (!preserveOnMissing) el.textContent = "";
      return;
    }
    // Replace server markup with live app
    el.textContent = "";
    disposers.push(mount(el, factory));
  });

  return () => {
    for (const d of disposers) d();
  };
}

/**
 * Hydrate a single island by name (first match).
 */
export function hydrateIsland(
  name: string,
  factory: IslandFactory,
  root: ParentNode = document,
): Dispose {
  return hydrateIslands({ [name]: factory }, { root });
}

/**
 * Static HTML placeholder for an island (no happy-dom needed).
 * Useful when the shell is a template string.
 */
export function islandPlaceholder(name: string, fallbackHtml = ""): string {
  return `<div ${ISLAND_ATTR}="${escapeAttr(name)}">${fallbackHtml}</div>`;
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

/** @internal */
export function createIslandRoot(app: IslandFactory): {
  host: HTMLElement;
  dispose: Dispose;
} {
  const host = document.createElement("div");
  let dispose!: Dispose;
  createRoot((d) => {
    dispose = d;
    const result = app();
    if (result == null) return;
    const nodes = Array.isArray(result) ? result : [result];
    for (const n of nodes) {
      if (n) host.appendChild(n as Node);
    }
  });
  return { host, dispose };
}
