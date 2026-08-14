import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { h } from "@power-ux/dom";
import { defineIslands, listIslandsInHtml } from "./registry.js";
import { islandPlaceholder } from "./islands.js";

function installDom() {
  const window = new Window({ url: "https://localhost/" });
  const g = globalThis as unknown as Record<string, unknown>;
  g.window = window;
  g.document = window.document;
  g.Node = window.Node;
  g.HTMLElement = window.HTMLElement;
  g.Text = window.Text;
  g.Element = window.Element;
  return window.document as unknown as Document;
}

describe("defineIslands", () => {
  it("listIslandsInHtml finds names", () => {
    const html = `
      ${islandPlaceholder("a")}
      ${islandPlaceholder("b", "x")}
    `;
    assert.deepEqual(listIslandsInHtml(html), ["a", "b"]);
  });

  it("discover / missing helpers", () => {
    const document = installDom();
    document.body.innerHTML = `
      <div data-pu-island="counter"></div>
      <div data-pu-island="orphan"></div>
    `;

    const islands = defineIslands({
      counter: () => h("button", { text: "ok" }),
      unused: () => h("span", { text: "nope" }),
    });

    assert.deepEqual(islands.discover(document).sort(), [
      "counter",
      "orphan",
    ]);
    assert.deepEqual(islands.missingInRegistry(document), ["orphan"]);
    assert.deepEqual(islands.missingInDom(document), ["unused"]);

    islands.hydrate(document);
    assert.equal(
      document.querySelector("[data-pu-island=counter]")?.textContent,
      "ok",
    );
    // orphan preserved (no factory)
    assert.equal(
      document.querySelector("[data-pu-island=orphan]")?.innerHTML,
      "",
    );
  });
});
