import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import {
  attachOverlay,
  __overlayStackSize,
  __resetOverlayStack,
} from "./overlay.js";

function installDom() {
  const window = new Window({ url: "https://localhost/" });
  const g = globalThis as unknown as Record<string, unknown>;
  g.window = window;
  g.document = window.document;
  g.Node = window.Node;
  g.HTMLElement = window.HTMLElement;
  g.KeyboardEvent = window.KeyboardEvent;
  g.Event = window.Event;
  return {
    document: window.document as unknown as Document,
    window: window as unknown as Window & typeof globalThis,
  };
}

function tick(): Promise<void> {
  return new Promise((r) => setTimeout(r, 5));
}

describe("attachOverlay", () => {
  let document: Document;
  let window: Window & typeof globalThis;

  beforeEach(() => {
    ({ document, window } = installDom());
    __resetOverlayStack();
  });

  it("Escape calls onClose for a single layer", async () => {
    let closed = 0;
    const root = document.createElement("div");
    document.body.appendChild(root);
    const panel = document.createElement("div");
    root.appendChild(panel);
    panel.tabIndex = 0;

    const dispose = attachOverlay({
      getRoot: () => root,
      getFocusRoot: () => panel,
      onClose: () => {
        closed++;
      },
      scrollLock: true,
    });
    await tick();

    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    assert.equal(closed, 1);
    dispose();
    assert.equal(__overlayStackSize(), 0);
  });

  it("only topmost layer handles Escape", async () => {
    const closed: string[] = [];
    const a = document.createElement("div");
    const b = document.createElement("div");
    document.body.appendChild(a);
    document.body.appendChild(b);

    const d1 = attachOverlay({
      getRoot: () => a,
      onClose: () => closed.push("a"),
    });
    const d2 = attachOverlay({
      getRoot: () => b,
      onClose: () => closed.push("b"),
    });
    await tick();

    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    assert.deepEqual(closed, ["b"]);

    d2();
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    assert.deepEqual(closed, ["b", "a"]);
    d1();
  });

  it("scroll lock refcounts across two modals", async () => {
    const a = document.createElement("div");
    const b = document.createElement("div");
    document.body.appendChild(a);
    document.body.appendChild(b);

    const d1 = attachOverlay({
      getRoot: () => a,
      onClose: () => {},
      scrollLock: true,
    });
    await tick();
    assert.equal(document.body.style.overflow, "hidden");

    const d2 = attachOverlay({
      getRoot: () => b,
      onClose: () => {},
      scrollLock: true,
    });
    await tick();
    assert.equal(document.body.style.overflow, "hidden");

    d1();
    // still locked while second open
    assert.equal(document.body.style.overflow, "hidden");
    d2();
    assert.notEqual(document.body.style.overflow, "hidden");
  });

  it("dismissOutside closes on outside pointerdown, not inside", async () => {
    let closed = 0;
    const root = document.createElement("div");
    const inside = document.createElement("button");
    inside.textContent = "in";
    root.appendChild(inside);
    const outside = document.createElement("button");
    outside.textContent = "out";
    document.body.appendChild(root);
    document.body.appendChild(outside);

    const dispose = attachOverlay({
      getRoot: () => root,
      onClose: () => {
        closed++;
      },
      dismissOutside: true,
    });
    await tick();
    await tick(); // skip opening interaction

    // Click inside — must not close
    inside.dispatchEvent(
      new Event("pointerdown", { bubbles: true, cancelable: true }),
    );
    assert.equal(closed, 0);

    // Click outside — closes
    outside.dispatchEvent(
      new Event("pointerdown", { bubbles: true, cancelable: true }),
    );
    assert.equal(closed, 1);

    dispose();
  });
});
