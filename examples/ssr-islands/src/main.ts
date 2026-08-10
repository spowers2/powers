/**
 * SSR islands demo (Node / happy-dom):
 * 1) render shell + island HTML
 * 2) hydrate the island on a fresh document
 */
import { signal, flush } from "@power-ui/core";
import { h, bindText } from "@power-ui/dom";
import {
  renderToString,
  htmlDocument,
  island,
  hydrateIslands,
} from "@power-ui/ssr";
import { Window } from "happy-dom";

function Counter() {
  const n = signal(0);
  const btn = h("button", {
    type: "button",
    onClick: () => n.update((x) => x + 1),
  });
  bindText(btn, () => `Clicks: ${n()}`);
  return btn;
}

// —— Server render ——
const body = await renderToString(() => {
  const main = document.createElement("main");
  main.appendChild(h("h1", { text: "Static marketing shell" }));
  main.appendChild(h("p", { text: "Only the island below is interactive." }));
  main.appendChild(island("counter", () => Counter()));
  return main;
});

const page = htmlDocument(body, { title: "Islands demo" });
console.log("=== SSR HTML ===\n");
console.log(page);
console.log("\n=== Hydrate on client document ===\n");

// —— Client hydrate simulation ——
const window = new Window({ url: "https://localhost/" });
const g = globalThis as unknown as Record<string, unknown>;
g.window = window;
g.document = window.document;
g.Node = window.Node;
g.HTMLElement = window.HTMLElement;
g.Text = window.Text;
g.Element = window.Element;

window.document.body.innerHTML = body;

const dispose = hydrateIslands({
  counter: () => Counter(),
});

await Promise.resolve();
flush();

const btn = window.document.querySelector(
  "[data-pu-island=counter] button",
) as HTMLButtonElement | null;
console.log("After hydrate:", btn?.textContent);
btn?.click();
await Promise.resolve();
await Promise.resolve();
flush();
console.log("After click:", btn?.textContent);

dispose();
console.log("\nDone.");
