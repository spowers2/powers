import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { signal, flush } from "@lab206/core";
import { installDom } from "./test-setup.js";
import { mount, component, Show, For } from "./index.js";
import { jsx, jsxs, Fragment } from "./jsx-runtime.js";

async function tick(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  flush();
}

describe("jsx-runtime", () => {
  let root: HTMLElement;

  beforeEach(() => {
    const { document } = installDom();
    root = document.createElement("div");
    document.body.appendChild(root);
  });

  it("creates elements with reactive children", async () => {
    const count = signal(0);
    const el = jsx("button", {
      type: "button",
      onClick: () => count.update((n) => n + 1),
      children: () => `n=${count()}`,
    }) as HTMLButtonElement;

    root.appendChild(el);
    assert.equal(el.textContent, "n=0");
    el.click();
    await tick();
    assert.equal(el.textContent, "n=1");
  });

  it("reactive children can return DOM nodes (not [object HTML…])", async () => {
    const showNode = signal(true);
    const p = document.createElement("p");
    p.textContent = "live panel";

    const el = jsx("div", {
      children: () => (showNode() ? p : "fallback"),
    }) as HTMLElement;
    root.appendChild(el);
    assert.equal(el.querySelector("p")?.textContent, "live panel");
    assert.equal(el.textContent?.includes("[object"), false);

    showNode.set(false);
    await tick();
    assert.equal(el.textContent, "fallback");
    assert.equal(el.querySelector("p"), null);

    showNode.set(true);
    await tick();
    assert.equal(el.querySelector("p")?.textContent, "live panel");
  });

  it("supports function components", () => {
    const Hello = (props: { name: string }) =>
      jsx("p", { children: `Hello ${props.name}` });

    const el = jsx(Hello as never, { name: "Ada" }) as HTMLElement;
    root.appendChild(el);
    assert.equal(root.textContent, "Hello Ada");
  });

  it("supports Fragment / jsxs", () => {
    const frag = jsxs(Fragment as never, {
      children: [
        jsx("span", { children: "A" }),
        jsx("span", { children: "B" }),
      ],
    }) as DocumentFragment;

    root.appendChild(frag);
    assert.equal(root.textContent, "AB");
  });

  it("component() + Show + For", async () => {
    type Item = { id: number; title: string };
    const items = signal<Item[]>([{ id: 1, title: "one" }]);

    const List = component(() => {
      const host = jsx("div", {
        children: [
          jsx(Show as never, {
            when: () => items().length === 0,
            children: () => jsx("p", { children: "empty" }),
          }),
          jsx("ul", {
            children: jsx(For as never, {
              each: () => items(),
              key: (t: Item) => t.id,
              children: (item: () => Item) =>
                jsx("li", { children: () => item().title }),
            }),
          }),
        ],
      }) as HTMLElement;
      return host;
    });

    mount(root, () => List({}));
    assert.equal(root.querySelectorAll("li").length, 1);
    assert.equal(root.textContent?.includes("one"), true);

    items.set([]);
    await tick();
    assert.equal(root.textContent?.includes("empty"), true);

    items.set([{ id: 2, title: "two" }]);
    await tick();
    assert.equal(root.querySelector("li")?.textContent, "two");
  });
});
