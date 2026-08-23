/**
 * @lab206/ssr
 *
 * - `renderToString` — full tree → HTML (happy-dom)
 * - `htmlDocument` — wrap body in a document shell
 * - Islands — `island` / `markIsland` / `hydrateIslands` for selective client interactivity
 *
 * @example SSR + island
 * ```ts
 * // server
 * const body = await renderToString(() =>
 *   h("main", null,
 *     h("h1", { text: "Static" }),
 *     island("counter", () => Counter()),
 *   )
 * );
 *
 * // client
 * hydrateIslands({ counter: () => Counter() });
 * ```
 */
import { Window } from "happy-dom";
import { mount, type MountResult } from "@lab206/dom";
import { flush } from "@lab206/core";

export interface RenderToStringOptions {
  /** Wait for microtasks / flush reactive updates before serializing. Default true. */
  flush?: boolean;
  /** Optional URL for the virtual window (routing, absolute links). */
  url?: string;
}

/**
 * Mount `app` in a virtual document and return `innerHTML` of the root.
 * Disposes the app after serialization.
 */
export async function renderToString(
  app: () => MountResult,
  options: RenderToStringOptions = {},
): Promise<string> {
  const window = new Window({
    url: options.url ?? "https://localhost/",
  });
  const document = window.document;

  const g = globalThis as unknown as Record<string, unknown>;
  const prev = {
    window: g.window,
    document: g.document,
    Node: g.Node,
    HTMLElement: g.HTMLElement,
    Text: g.Text,
    Element: g.Element,
  };

  g.window = window;
  g.document = document;
  g.Node = window.Node;
  g.HTMLElement = window.HTMLElement;
  g.Text = window.Text;
  g.Element = window.Element;

  const root = document.createElement("div");
  document.body.appendChild(root);

  let html = "";
  try {
    const dispose = mount(root as unknown as ParentNode, app);
    if (options.flush !== false) {
      await Promise.resolve();
      await Promise.resolve();
      flush();
    }
    html = root.innerHTML;
    dispose();
  } finally {
    g.window = prev.window;
    g.document = prev.document;
    g.Node = prev.Node;
    g.HTMLElement = prev.HTMLElement;
    g.Text = prev.Text;
    g.Element = prev.Element;
    window.close();
  }

  return html;
}

/**
 * Wrap app HTML in a minimal document shell for full-page SSR responses.
 */
export function htmlDocument(
  body: string,
  options?: {
    title?: string;
    head?: string;
    /** Extra attributes on <html>, e.g. data-pu-theme */
    htmlAttrs?: string;
  },
): string {
  const title = options?.title ?? "Powers";
  const head = options?.head ?? "";
  const htmlAttrs = options?.htmlAttrs ? ` ${options.htmlAttrs}` : "";
  return `<!DOCTYPE html>
<html lang="en"${htmlAttrs}>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
${head}
</head>
<body>
<div id="app">${body}</div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export {
  island,
  markIsland,
  hydrateIsland,
  hydrateIslands,
  islandPlaceholder,
  ISLAND_ATTR,
} from "./islands.js";
export type {
  IslandFactory,
  IslandRegistry,
  HydrateIslandsOptions,
} from "./islands.js";

export { defineIslands, listIslandsInHtml } from "./registry.js";
export type { IslandRegistryApi } from "./registry.js";
