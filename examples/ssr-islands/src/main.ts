/**
 * SSR islands demo:
 * 1) render shell + islands to HTML
 * 2) discover islands in the string
 * 3) hydrate via defineIslands registry
 */
import { signal, flush } from "@powers/core";
import { h, bindText } from "@powers/dom";
import {
  renderToString,
  htmlDocument,
  island,
  defineIslands,
  listIslandsInHtml,
} from "@powers/ssr";
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

function Clock() {
  const ticks = signal(0);
  const el = h("p");
  bindText(el, () => `Island clock ticks: ${ticks()}`);
  // one tick for the demo
  ticks.set(1);
  return el;
}

// —— Server render ——
const body = await renderToString(() => {
  const main = document.createElement("main");
  main.appendChild(h("h1", { text: "Static marketing shell" }));
  main.appendChild(
    h("p", { text: "Two islands hydrate independently below." }),
  );
  main.appendChild(island("counter", () => Counter()));
  main.appendChild(island("clock", () => Clock()));
  return main;
});

const page = htmlDocument(body, { title: "Islands demo" });
console.log("=== SSR HTML ===\n");
console.log(page);

const found = listIslandsInHtml(body);
console.log("\nIslands in HTML:", found);

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

const islands = defineIslands({
  counter: () => Counter(),
  clock: () => Clock(),
});

console.log("\nMissing in registry:", islands.missingInRegistry(window.document));
console.log("Registered but unused:", islands.missingInDom(window.document));

const dispose = islands.hydrate(window.document);

await Promise.resolve();
flush();

const btn = window.document.querySelector(
  "[data-pu-island=counter] button",
) as HTMLButtonElement | null;
console.log("\nAfter hydrate counter:", btn?.textContent);
console.log(
  "After hydrate clock:",
  window.document.querySelector("[data-pu-island=clock]")?.textContent,
);

btn?.click();
await Promise.resolve();
await Promise.resolve();
flush();
console.log("After click:", btn?.textContent);

dispose();
console.log("\nDone.");
