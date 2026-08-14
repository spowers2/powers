import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { signal, flush } from "@power-ux/core";
import { installDom } from "./test-setup.js";
import {
  mount,
  h,
  text,
  bindText,
  bindAttr,
  bindClass,
  bindStyle,
  bindProp,
  on,
  show,
  list,
} from "./index.js";

async function tick(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  flush();
}

describe("@power-ux/dom", () => {
  let document: Document;
  let root: HTMLElement;

  beforeEach(() => {
    ({ document } = installDom());
    root = document.createElement("div");
    document.body.appendChild(root);
  });

  it("mounts and disposes", () => {
    const stop = mount(root, () => h("p", { text: "hi" }));
    assert.equal(root.textContent, "hi");
    stop();
    assert.equal(root.textContent, "");
  });

  it("h() invokes function components (classic JSX)", async () => {
    const count = signal(0);
    function App() {
      return h("button", {
        type: "button",
        onClick: () => count.update((n) => n + 1),
        text: () => `n=${count()}`,
      });
    }
    // Simulates esbuild classic transform: mount(() => h(App, null))
    const stop = mount(root, () => h(App, null));
    const btn = root.querySelector("button") as HTMLButtonElement;
    assert.ok(btn);
    assert.equal(btn.textContent, "n=0");
    btn.click();
    await tick();
    assert.equal(btn.textContent, "n=1");
    stop();
  });

  it("bindText updates on signal change", async () => {
    const name = signal("Ada");
    const el = h("span");
    bindText(el, () => name());
    root.appendChild(el);
    assert.equal(el.textContent, "Ada");
    name.set("Grace");
    await tick();
    assert.equal(el.textContent, "Grace");
  });

  it("h() supports reactive text and onClick", async () => {
    const count = signal(0);
    const btn = h("button", {
      type: "button",
      text: () => `Count: ${count()}`,
      onClick: () => count.update((n) => n + 1),
    });
    root.appendChild(btn);
    assert.equal(btn.textContent, "Count: 0");
    btn.click();
    await tick();
    assert.equal(btn.textContent, "Count: 1");
  });

  it("bindAttr toggles attributes", async () => {
    const open = signal(false);
    const el = h("div");
    bindAttr(el, "aria-expanded", () => open());
    root.appendChild(el);
    assert.equal(el.hasAttribute("aria-expanded"), false);
    open.set(true);
    await tick();
    assert.equal(el.getAttribute("aria-expanded"), "");
  });

  it("bindClass and bindStyle", async () => {
    const on = signal(true);
    const el = h("div");
    bindClass(el, () => ({ active: on(), dim: !on() }));
    bindStyle(el, () => ({ opacity: on() ? "1" : "0.5" }));
    root.appendChild(el);
    assert.ok(el.className.includes("active"));
    assert.equal(el.style.opacity, "1");
    on.set(false);
    await tick();
    assert.ok(el.className.includes("dim"));
    assert.equal(el.style.opacity, "0.5");
  });

  it("on() disposes listener", () => {
    let n = 0;
    const btn = h("button");
    const stop = on(btn, "click", () => {
      n++;
    });
    btn.click();
    assert.equal(n, 1);
    stop();
    btn.click();
    assert.equal(n, 1);
  });

  it("show mounts and unmounts", async () => {
    const open = signal(true);
    show(root, () => open(), () => h("p", { text: "panel" }));
    assert.equal(root.textContent, "panel");
    open.set(false);
    await tick();
    assert.equal(root.textContent, "");
    open.set(true);
    await tick();
    assert.equal(root.textContent, "panel");
  });

  it("list reconciles keyed items", async () => {
    type Todo = { id: number; title: string };
    const items = signal<Todo[]>([
      { id: 1, title: "a" },
      { id: 2, title: "b" },
    ]);
    const ul = h("ul");
    root.appendChild(ul);

    list(
      ul,
      () => items(),
      (item) => h("li", { text: () => item().title }),
      { key: (t) => t.id },
    );

    assert.equal(ul.children.length, 2);
    assert.equal(ul.textContent, "ab");

    // Capture node identity for key=1 before reorder
    const nodeA = ul.children[0]!;
    const nodeB = ul.children[1]!;

    items.set([
      { id: 2, title: "b2" },
      { id: 1, title: "a2" },
      { id: 3, title: "c" },
    ]);
    await tick();
    assert.equal(ul.children.length, 3);
    assert.equal(ul.children[0]!.textContent, "b2");
    assert.equal(ul.children[1]!.textContent, "a2");
    assert.equal(ul.children[2]!.textContent, "c");
    // Keyed rows must reuse DOM nodes (not remount)
    assert.equal(ul.children[0], nodeB);
    assert.equal(ul.children[1], nodeA);

    items.set([{ id: 3, title: "c" }]);
    await tick();
    assert.equal(ul.children.length, 1);
    assert.equal(ul.textContent, "c");
  });

  it("bindProp skips no-op writes (caret / focus safety)", async () => {
    const value = signal("hi");
    const input = document.createElement("input");
    root.appendChild(input);
    bindProp(input, "value", () => value());
    await tick();
    assert.equal(input.value, "hi");

    // Same value: assignment skipped — still equal
    value.set("hi");
    await tick();
    assert.equal(input.value, "hi");

    value.set("yo");
    await tick();
    assert.equal(input.value, "yo");
  });

  it("text() helper is reactive", async () => {
    const n = signal(1);
    const node = text(() => n());
    root.appendChild(node);
    assert.equal(root.textContent, "1");
    n.set(2);
    await tick();
    assert.equal(root.textContent, "2");
  });

  it("mount app with signal counter end-to-end", async () => {
    const stop = mount(root, () => {
      const count = signal(0);
      return h("div", null, h("button", {
        id: "inc",
        onClick: () => count.update((c) => c + 1),
        text: () => `n=${count()}`,
      }));
    });

    const btn = root.querySelector("#inc") as HTMLButtonElement;
    assert.equal(btn.textContent, "n=0");
    btn.click();
    await tick();
    assert.equal(btn.textContent, "n=1");
    stop();
    assert.equal(root.innerHTML, "");
  });
});
