import type { Dispose } from "@power-ux/core";
import type { IslandFactory, IslandRegistry } from "./islands.js";
import { hydrateIslands, ISLAND_ATTR } from "./islands.js";

export interface IslandRegistryApi {
  /** Registered factories */
  readonly entries: IslandRegistry;
  /** Register or replace an island factory */
  register(name: string, factory: IslandFactory): void;
  /** Register many islands at once */
  registerAll(map: IslandRegistry): void;
  /** Hydrate all matching islands in the document (or root) */
  hydrate(root?: ParentNode): Dispose;
  /** List island names present under root (DOM) */
  discover(root?: ParentNode): string[];
  /** Names registered but not found in the document */
  missingInDom(root?: ParentNode): string[];
  /** Island names in the DOM that have no factory */
  missingInRegistry(root?: ParentNode): string[];
}

/**
 * Typed-ish island registry for client entrypoints.
 *
 * @example
 * ```ts
 * const islands = defineIslands({
 *   counter: () => Counter(),
 *   cart: () => CartWidget(),
 * });
 *
 * // after HTML is in the document:
 * islands.hydrate();
 * console.log(islands.missingInRegistry()); // unexpected SSR islands
 * ```
 */
export function defineIslands(
  initial: IslandRegistry = {},
): IslandRegistryApi {
  const entries: IslandRegistry = { ...initial };

  function register(name: string, factory: IslandFactory) {
    entries[name] = factory;
  }

  function registerAll(map: IslandRegistry) {
    Object.assign(entries, map);
  }

  function discover(root: ParentNode = document): string[] {
    const nodes = root.querySelectorAll?.(`[${ISLAND_ATTR}]`) ?? [];
    const names: string[] = [];
    nodes.forEach((n) => {
      const name = (n as Element).getAttribute(ISLAND_ATTR);
      if (name) names.push(name);
    });
    return names;
  }

  function missingInDom(root: ParentNode = document): string[] {
    const present = new Set(discover(root));
    return Object.keys(entries).filter((k) => !present.has(k));
  }

  function missingInRegistry(root: ParentNode = document): string[] {
    return discover(root).filter((name) => !entries[name]);
  }

  function hydrate(root: ParentNode = document): Dispose {
    const unknown = missingInRegistry(root);
    if (unknown.length) {
      console.warn(
        `[power-ux/ssr] DOM islands with no registry entry: ${unknown.join(", ")}`,
      );
    }
    return hydrateIslands(entries, root);
  }

  return {
    entries,
    register,
    registerAll,
    hydrate,
    discover,
    missingInDom,
    missingInRegistry,
  };
}

/**
 * Parse island names from an HTML string (no DOM required).
 */
export function listIslandsInHtml(html: string): string[] {
  const re = /data-pu-island=["']([^"']+)["']/g;
  const names: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1]) names.push(m[1]);
  }
  return names;
}
