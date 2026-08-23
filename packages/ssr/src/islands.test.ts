import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { signal, flush } from "@lab206/core";
import { h, bindText } from "@lab206/dom";
import { renderToString } from "./index.js";
import {
  island,
  hydrateIslands,
  islandPlaceholder,
  markIsland,
} from "./islands.js";
import { Window } from "happy-dom";

function installDom(url = "https://localhost/") {
  const window = new Window({ url });
  const g = globalThis as unknown as Record<string, unknown>;
  g.window = window;
  g.document = window.document;
  g.Node = window.Node;
  g.HTMLElement = window.HTMLElement;
  g.Text = window.Text;
  g.Element = window.Element;
  return window.document as unknown as Document;
}

describe("islands", () => {
  it("islandPlaceholder emits data attribute", () => {
    const html = islandPlaceholder("counter", "<span>0</span>");
    assert.ok(html.includes('data-pu-island="counter"'));
    assert.ok(html.includes("<span>0</span>"));
  });

  it("renderToString keeps island markers", async () => {
    const html = await renderToString(() => {
      const wrap = document.createElement("div");
      const host = markIsland("live");
      host.textContent = "ssr";
      wrap.appendChild(h("h1", { text: "Shell" }));
      wrap.appendChild(host);
      return wrap;
    });
    assert.ok(html.includes("Shell"));
    assert.ok(html.includes('data-pu-island="live"'));
  });

  it("hydrateIslands mounts client apps", async () => {
    const document = installDom();
    document.body.innerHTML = `
      <div id="root">
        <h1>Static</h1>
        <div data-pu-island="counter"><span>server</span></div>
      </div>
    `;

    const count = signal(1);
    const dispose = hydrateIslands(
      {
        counter: () => {
          const el = h("button", { type: "button" });
          bindText(el, () => `n=${count()}`);
          return el;
        },
      },
      document,
    );

    await Promise.resolve();
    flush();
    const btn = document.querySelector("[data-pu-island=counter] button");
    assert.ok(btn);
    assert.equal(btn!.textContent, "n=1");
    assert.equal(document.querySelector("h1")?.textContent, "Static");

    count.set(2);
    await Promise.resolve();
    await Promise.resolve();
    flush();
    assert.equal(btn!.textContent, "n=2");

    dispose();
  });

  it("island() helper sets attribute and children", () => {
    installDom();
    const host = island("x", () => h("p", { text: "hi" }));
    assert.equal(host.getAttribute("data-pu-island"), "x");
    assert.equal(host.textContent, "hi");
  });
});
