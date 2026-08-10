import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { mount } from "@power-ui/dom";
import { signal } from "@power-ui/core";
import { Button } from "./components/Button.js";
import { Dialog } from "./components/Dialog.js";
import { Tabs } from "./components/Tabs.js";
import { Progress } from "./components/Progress.js";
import { createToaster, Toaster } from "./components/Toast.js";
import { Menu } from "./components/Menu.js";
import { Popover } from "./components/Popover.js";
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

  it("Dialog toggles open class", async () => {
    const { flush } = await import("@power-ui/core");
    const open = signal(false);
    mount(root, () =>
      Dialog({ open, onClose: () => open.set(false), title: "Hi", children: "Body" }),
    );
    const rootEl = root.querySelector(".pu-dialog-root");
    assert.ok(rootEl);
    assert.equal(rootEl!.classList.contains("pu-dialog-root--open"), false);
    open.set(true);
    flush();
    assert.equal(rootEl!.classList.contains("pu-dialog-root--open"), true);
  });

  it("Tabs switches panels", async () => {
    const { flush } = await import("@power-ui/core");
    mount(root, () =>
      Tabs({
        defaultValue: "a",
        items: [
          { id: "a", label: "A", content: "Panel A" },
          { id: "b", label: "B", content: "Panel B" },
        ],
      }),
    );
    assert.match(root.textContent ?? "", /Panel A/);
    const tabs = root.querySelectorAll('[role="tab"]');
    assert.equal(tabs.length, 2);
    (tabs[1] as HTMLButtonElement).click();
    flush();
    assert.match(root.textContent ?? "", /Panel B/);
  });

  it("Progress sets aria-valuenow", async () => {
    const { flush } = await import("@power-ui/core");
    const value = signal(25);
    mount(root, () => Progress({ value, label: "Load" }));
    const bar = root.querySelector('[role="progressbar"]');
    assert.ok(bar);
    assert.equal(bar!.getAttribute("aria-valuenow"), "25");
    value.set(80);
    flush();
    assert.equal(bar!.getAttribute("aria-valuenow"), "80");
  });

  it("createToaster pushes items into Toaster", async () => {
    const { flush } = await import("@power-ui/core");
    const toaster = createToaster();
    mount(root, () => Toaster({ toaster }));
    assert.equal(root.querySelectorAll(".pu-toast").length, 0);
    toaster.push({ title: "Hello", tone: "success", duration: 0 });
    flush();
    const toasts = root.querySelectorAll(".pu-toast");
    assert.equal(toasts.length, 1);
    assert.match(toasts[0]!.textContent ?? "", /Hello/);
  });

  it("Popover toggles open class", async () => {
    const { flush } = await import("@power-ui/core");
    const open = signal(false);
    mount(root, () =>
      Popover({
        open,
        onOpenChange: (v) => open.set(v),
        trigger: "Open",
        children: "Panel body",
      }),
    );
    const el = root.querySelector(".pu-popover");
    assert.ok(el);
    assert.equal(el!.classList.contains("pu-popover--open"), false);
    open.set(true);
    flush();
    assert.equal(el!.classList.contains("pu-popover--open"), true);
  });

  it("Menu renders items when opened", async () => {
    const { flush } = await import("@power-ui/core");
    mount(root, () =>
      Menu({
        trigger: "Actions",
        items: [
          { id: "a", label: "Alpha" },
          { id: "b", label: "Beta" },
        ],
      }),
    );
    const trigger = root.querySelector(".pu-popover__trigger");
    assert.ok(trigger);
    (trigger as HTMLElement).click();
    flush();
    assert.match(root.textContent ?? "", /Alpha/);
    assert.match(root.textContent ?? "", /Beta/);
  });
});
