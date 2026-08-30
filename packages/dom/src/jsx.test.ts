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

  it("function child does not remount when child setup reads/writes a store (Dialog forms)", async () => {
    // Same footgun as Dialog body: {() => <Note id={selected().id} />} where
    // Note seeds from notes() and writes notes on input. Setup must not
    // subscribe the bindDynamic slot (FOUNDATION tracking isolation).
    const selected = signal<{ id: string } | null>({ id: "a" });
    const notes = signal<Record<string, string>>({});
    let inputCalls = 0;

    function SavedNote(props: { id: string }) {
      const id = props.id;
      const draft = signal(notes()[id] || "");
      const el = document.createElement("textarea");
      el.dataset.id = id;
      el.value = draft();
      el.addEventListener("input", () => {
        inputCalls++;
        const v = el.value;
        draft.set(v);
        notes.update((n) => ({ ...n, [id]: v }));
      });
      return el;
    }

    const shell = jsx("div", {
      children: () => {
        const p = selected();
        if (!p) return null;
        return jsx(SavedNote as never, { id: p.id });
      },
    }) as HTMLElement;
    root.appendChild(shell);

    const ta1 = root.querySelector("textarea") as HTMLTextAreaElement;
    assert.ok(ta1);
    ta1.value = "a";
    ta1.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    assert.equal(inputCalls, 1, "input listener should run");
    const ta2 = root.querySelector("textarea") as HTMLTextAreaElement;
    assert.equal(ta2, ta1, "textarea node must stay mounted across keystrokes");
    assert.equal(notes()["a"], "a");

    ta2.value = "ab";
    ta2.dispatchEvent(new Event("input", { bubbles: true }));
    await tick();

    assert.equal(inputCalls, 2);
    const ta3 = root.querySelector("textarea") as HTMLTextAreaElement;
    assert.equal(ta3, ta1, "still same node after second keystroke");
    assert.equal(notes()["a"], "ab");
    assert.equal(ta3.value, "ab");
  });

  it("function child still remounts when parent remount key changes", async () => {
    const selected = signal({ id: "a" });
    const notes = signal<Record<string, string>>({ a: "from-a", b: "from-b" });

    function SavedNote(props: { id: string }) {
      const draft = signal(notes()[props.id] || "");
      return jsx("textarea", {
        "data-id": props.id,
        value: draft(),
      });
    }

    const shell = jsx("div", {
      children: () =>
        jsx(SavedNote as never, { id: selected().id }),
    }) as HTMLElement;
    root.appendChild(shell);

    const taA = root.querySelector("textarea") as HTMLTextAreaElement;
    assert.equal(taA.getAttribute("data-id"), "a");
    assert.equal(taA.value, "from-a");

    selected.set({ id: "b" });
    await tick();

    const taB = root.querySelector("textarea") as HTMLTextAreaElement;
    assert.notEqual(taB, taA, "new selected id should remount body");
    assert.equal(taB.getAttribute("data-id"), "b");
    assert.equal(taB.value, "from-b");
  });
});
