/**
 * Unit tests for section TOC navigation (pin + bottom-of-page).
 */
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { flush } from "@powers/core";
import { createSectionNav } from "./scrollNav.js";

function installDom() {
  const window = new Window({
    url: "https://localhost/system",
    height: 800,
    width: 1200,
  });
  const g = globalThis as unknown as Record<string, unknown>;
  g.window = window;
  g.document = window.document;
  g.HTMLElement = window.HTMLElement;
  g.Node = window.Node;
  g.requestAnimationFrame = (cb: FrameRequestCallback) =>
    window.setTimeout(() => cb(0), 0) as unknown as number;
  // happy-dom scrollHeight quirks — stub document metrics used by spy
  Object.defineProperty(window.HTMLElement.prototype, "getBoundingClientRect", {
    configurable: true,
    value(this: HTMLElement) {
      const top = Number(this.dataset.top ?? 0);
      return {
        top,
        bottom: top + 100,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
        x: 0,
        y: top,
        toJSON() {
          return {};
        },
      };
    },
  });
  return window;
}

describe("createSectionNav", () => {
  let win: Window;
  let sections: string[];

  beforeEach(() => {
    win = installDom();
    sections = ["sys-color", "sys-space", "sys-code"];
    for (const id of sections) {
      const el = win.document.createElement("section");
      el.id = id;
      el.dataset.top = "400";
      win.document.body.appendChild(el);
    }
    // Fake scroll position helpers
    Object.defineProperty(win, "scrollY", {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(win, "innerHeight", {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(win.document.documentElement, "scrollHeight", {
      configurable: true,
      value: 3000,
    });
  });

  afterEach(() => {
    win.close();
  });

  it("scrollTo pins activeId to the clicked section", async () => {
    const nav = createSectionNav(sections, { activateOffset: 120 });
    nav.bindScrollSpy();
    flush();

    // Spy would pick nothing near top
    const color = win.document.getElementById("sys-color")!;
    const space = win.document.getElementById("sys-space")!;
    const code = win.document.getElementById("sys-code")!;
    color.dataset.top = "200";
    space.dataset.top = "300";
    code.dataset.top = "500";

    nav.scrollTo("sys-code");
    flush();
    assert.equal(nav.activeId(), "sys-code");

    // Mid-scroll frames that would otherwise overwrite pin
    color.dataset.top = "50";
    space.dataset.top = "80";
    code.dataset.top = "400";
    win.dispatchEvent(new win.Event("scroll"));
    await new Promise((r) => setTimeout(r, 20));
    flush();
    // Still pinned during smooth scroll window
    assert.equal(nav.activeId(), "sys-code");
  });

  it("at document end activates last section", async () => {
    const nav = createSectionNav(sections, { activateOffset: 120 });
    nav.bindScrollSpy();
    flush();

    const color = win.document.getElementById("sys-color")!;
    const space = win.document.getElementById("sys-space")!;
    const code = win.document.getElementById("sys-code")!;
    // Code never crosses the line, but we're at max scroll
    color.dataset.top = "-100";
    space.dataset.top = "50";
    code.dataset.top = "300";
    (win as unknown as { scrollY: number }).scrollY = 3000 - 800; // max
    win.dispatchEvent(new win.Event("scroll"));
    await new Promise((r) => setTimeout(r, 30));
    flush();
    assert.equal(nav.activeId(), "sys-code");
  });
});
