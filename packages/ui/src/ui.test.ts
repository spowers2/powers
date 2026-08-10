import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { mount } from "@power-ui/dom";
import { Button } from "./components/Button.js";
import { createTheme } from "./theme.js";
import { cx } from "./utils.js";

function installDom() {
  const window = new Window({ url: "https://localhost/" });
  const g = globalThis as unknown as Record<string, unknown>;
  g.window = window;
  g.document = window.document;
  g.Node = window.Node;
  g.HTMLElement = window.HTMLElement;
  g.Text = window.Text;
  g.Element = window.Element;
  g.SVGElement = window.SVGElement;
  return window.document as unknown as Document;
}

describe("@power-ui/ui", () => {
  let document: Document;
  let root: HTMLElement;

  beforeEach(() => {
    document = installDom();
    root = document.createElement("div");
    document.body.appendChild(root);
  });

  it("cx joins classes", () => {
    assert.equal(cx("a", false, "b", { c: true, d: false }), "a b c");
  });

  it("Button renders with variant class", () => {
    mount(root, () => Button({ children: "Save", variant: "soft" }));
    const btn = root.querySelector("button");
    assert.ok(btn);
    assert.ok(btn!.className.includes("pu-btn--soft"));
    assert.equal(btn!.textContent, "Save");
  });

  it("createTheme sets data attribute", async () => {
    const { flush } = await import("@power-ui/core");
    const theme = createTheme("light");
    theme.bind(document.documentElement);
    assert.equal(
      document.documentElement.getAttribute("data-pu-theme"),
      "light",
    );
    theme.setMode("dark");
    await Promise.resolve();
    await Promise.resolve();
    flush();
    assert.equal(
      document.documentElement.getAttribute("data-pu-theme"),
      "dark",
    );
  });
});
